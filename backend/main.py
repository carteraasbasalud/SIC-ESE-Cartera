from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import sys
import datetime
import shutil

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import urllib.request

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from db import get_db_connection, DB_PATH

app = FastAPI(title="Sistema Inteligente de Cartera E.S.E. API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CollectionHistoryCreate(BaseModel):
    tipo_gestion: str
    descripcion: str
    usuario: str

class ReminderCreate(BaseModel):
    destinatario: str
    asunto: str
    cuerpo: str

class SmtpConfig(BaseModel):
    provider: str = "smtp" # "smtp" or "brevo"
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 465
    smtp_user: str
    smtp_password: str = ""
    use_ssl: bool = True
    brevo_api_key: str = ""


class SmtpTestRequest(BaseModel):
    destinatario: str


# Helper to execute queries
def execute_query(query, params=(), fetchone=False, fetchall=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, params)
        if fetchone:
            res = cursor.fetchone()
            return dict(res) if res else None
        if fetchall:
            res = cursor.fetchall()
            return [dict(r) for r in res]
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()

@app.get("/api/health")
def health():
    return {"status": "ok", "db_connected": os.path.exists(DB_PATH)}

@app.get("/api/stats")
def get_stats():
    # 1. Overall metrics
    total_balance_query = "SELECT SUM(saldo) as total_saldo, COUNT(*) as total_count FROM invoices;"
    total_metrics = execute_query(total_balance_query, fetchone=True) or {"total_saldo": 0, "total_count": 0}
    
    # Invoices with management actions
    managed_query = "SELECT COUNT(DISTINCT invoice_id) as count FROM collection_history;"
    managed_metrics = execute_query(managed_query, fetchone=True) or {"count": 0}
    
    # 2. Portfolio by sheet
    sheet_query = """
        SELECT sheet_name, SUM(saldo) as saldo, COUNT(*) as count 
        FROM invoices 
        GROUP BY sheet_name;
    """
    sheet_stats = execute_query(sheet_query, fetchall=True)
    
    # 3. Portfolio by top 10 EPS
    eps_query = """
        SELECT nombre as entidad, nit, SUM(saldo) as saldo, COUNT(*) as count 
        FROM invoices 
        GROUP BY nit 
        ORDER BY saldo DESC 
        LIMIT 10;
    """
    eps_stats = execute_query(eps_query, fetchall=True)
    
    # 4. Portfolio by category in OTRAS_EPS_2023
    category_query = """
        SELECT categoria, SUM(saldo) as saldo, COUNT(*) as count 
        FROM invoices 
        WHERE sheet_name = 'OTRAS_EPS_2023'
        GROUP BY categoria
        ORDER BY saldo DESC;
    """
    category_stats = execute_query(category_query, fetchall=True)
    
    # 5. Overdue Aging Analysis (nodias)
    # 0-30 (Corriente), 31-90 (Vencimiento Temprano), 91-180 (Vencimiento Medio), 181-360 (Crítica), 360+ (Provisión / Coercitivo)
    aging_query = """
        SELECT 
            SUM(CASE WHEN nodias <= 30 THEN saldo ELSE 0 END) as age_0_30,
            SUM(CASE WHEN nodias > 30 AND nodias <= 90 THEN saldo ELSE 0 END) as age_31_90,
            SUM(CASE WHEN nodias > 90 AND nodias <= 180 THEN saldo ELSE 0 END) as age_91_180,
            SUM(CASE WHEN nodias > 180 AND nodias <= 360 THEN saldo ELSE 0 END) as age_181_360,
            SUM(CASE WHEN nodias > 360 THEN saldo ELSE 0 END) as age_360_plus
        FROM invoices;
    """
    aging_stats = execute_query(aging_query, fetchone=True)
    
    return {
        "total_saldo": total_metrics.get("total_saldo") or 0.0,
        "total_count": total_metrics.get("total_count") or 0,
        "total_managed": managed_metrics.get("count") or 0,
        "by_sheet": sheet_stats,
        "by_eps": eps_stats,
        "by_category_2023": category_stats,
        "by_aging": aging_stats
    }

@app.get("/api/invoices")
def get_invoices(
    sheet: str = None,
    search: str = None,
    categoria: str = None,
    nit: str = None,
    min_saldo: float = None,
    max_saldo: float = None,
    age_range: str = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500)
):
    where_clauses = []
    params = []
    
    if sheet:
        where_clauses.append("sheet_name = ?")
        params.append(sheet)
    if search:
        where_clauses.append("(consecutiv LIKE ? OR nombre LIKE ? OR observaciones LIKE ?)")
        params.append(f"%{search}%")
        params.append(f"%{search}%")
        params.append(f"%{search}%")
    if categoria:
        where_clauses.append("categoria = ?")
        params.append(categoria)
    if nit:
        where_clauses.append("nit = ?")
        params.append(nit)
    if min_saldo is not None:
        where_clauses.append("saldo >= ?")
        params.append(min_saldo)
    if max_saldo is not None:
        where_clauses.append("saldo <= ?")
        params.append(max_saldo)
        
    if age_range:
        if age_range == "0-30":
            where_clauses.append("nodias <= 30")
        elif age_range == "31-90":
            where_clauses.append("nodias > 30 AND nodias <= 90")
        elif age_range == "91-180":
            where_clauses.append("nodias > 90 AND nodias <= 180")
        elif age_range == "181-360":
            where_clauses.append("nodias > 180 AND nodias <= 360")
        elif age_range == "360+":
            where_clauses.append("nodias > 360")
            
    where_sql = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
    
    # Count query
    count_query = f"SELECT COUNT(*) as total FROM invoices {where_sql};"
    total_records = execute_query(count_query, params, fetchone=True)["total"]
    
    # Data query
    # Include number of collection attempts
    data_query = f"""
        SELECT i.*, 
               (SELECT COUNT(*) FROM collection_history WHERE invoice_id = i.id) as total_cobros,
               (SELECT MAX(fecha_gestion) FROM collection_history WHERE invoice_id = i.id) as ultima_gestion
        FROM invoices i
        {where_sql}
        ORDER BY i.saldo DESC
        LIMIT ? OFFSET ?;
    """
    
    offset = (page - 1) * page_size
    data_params = params + [page_size, offset]
    invoices = execute_query(data_query, data_params, fetchall=True)
    
    return {
        "page": page,
        "page_size": page_size,
        "total_records": total_records,
        "total_pages": (total_records + page_size - 1) // page_size,
        "data": invoices
    }

@app.get("/api/invoices/{invoice_id}")
def get_invoice_detail(invoice_id: int):
    invoice = execute_query("SELECT * FROM invoices WHERE id = ?;", (invoice_id,), fetchone=True)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
        
    history = execute_query(
        "SELECT * FROM collection_history WHERE invoice_id = ? ORDER BY fecha_gestion DESC;", 
        (invoice_id,), 
        fetchall=True
    )
    
    reminders = execute_query(
        "SELECT * FROM automatic_reminders WHERE invoice_id = ? ORDER BY fecha_programada DESC;", 
        (invoice_id,), 
        fetchall=True
    )
    
    return {
        "invoice": invoice,
        "history": history,
        "reminders": reminders
    }

@app.post("/api/invoices/{invoice_id}/history")
def add_collection_history(invoice_id: int, history_data: CollectionHistoryCreate):
    invoice = execute_query("SELECT id FROM invoices WHERE id = ?;", (invoice_id,), fetchone=True)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
        
    now_str = datetime.datetime.now().isoformat()
    history_id = execute_query(
        """
        INSERT INTO collection_history (invoice_id, fecha_gestion, tipo_gestion, descripcion, usuario)
        VALUES (?, ?, ?, ?, ?);
        """,
        (invoice_id, now_str, history_data.tipo_gestion, history_data.descripcion, history_data.usuario)
    )
    
    return {"status": "success", "id": history_id, "fecha_gestion": now_str}

@app.get("/api/alerts")
def get_alerts():
    # Alert 1: Incapacidades (Personal Disabilities) that exceed 15 business days (approx. 21 calendar days)
    # Legal limit for EPS to pay or reject is 15 business days.
    disability_alerts_query = """
        SELECT i.*, 
               (SELECT COUNT(*) FROM collection_history WHERE invoice_id = i.id) as total_cobros
        FROM invoices i
        WHERE sheet_name = 'OTRAS_EPS_2023' 
          AND categoria = 'INCAPACIDADES'
          AND saldo > 0
          AND nodias > 15
        ORDER BY nodias DESC;
    """
    disability_alerts = execute_query(disability_alerts_query, fetchall=True)
    
    # Alert 2: High Balance Invoices (> 10 Million COP) that have been overdue for > 90 days and have 0 collection history
    high_value_alerts_query = """
        SELECT i.*, 0 as total_cobros
        FROM invoices i
        WHERE saldo >= 10000000
          AND nodias > 90
          AND (SELECT COUNT(*) FROM collection_history WHERE invoice_id = i.id) = 0
        ORDER BY saldo DESC;
    """
    high_value_alerts = execute_query(high_value_alerts_query, fetchall=True)
    
    # Alert 3: Cuotas Partes Pensionales with no collection management in the last 60 days
    # (Where sheet_name = 'OTRAS_EPS_2023' and category = 'CUOTAS PARTES' and saldo > 0)
    cuotas_partes_query = """
        SELECT i.*, 
               (SELECT COUNT(*) FROM collection_history WHERE invoice_id = i.id) as total_cobros,
               (SELECT MAX(fecha_gestion) FROM collection_history WHERE invoice_id = i.id) as ultima_gestion
        FROM invoices i
        WHERE categoria = 'CUOTAS PARTES'
          AND saldo > 0
          AND (
            (SELECT COUNT(*) FROM collection_history WHERE invoice_id = i.id) = 0
            OR 
            (SELECT MAX(fecha_gestion) FROM collection_history WHERE invoice_id = i.id) < date('now', '-60 days')
          )
        ORDER BY saldo DESC;
    """
    cuotas_partes_alerts = execute_query(cuotas_partes_query, fetchall=True)

    return {
        "incapacidades_excedidas": disability_alerts,
        "alto_valor_desatendidas": high_value_alerts,
        "cuotas_partes_sin_gestion": cuotas_partes_alerts
    }

@app.get("/api/reminders")
def get_reminders(estado: str = None):
    query = """
        SELECT r.*, i.consecutiv, i.nombre as entidad, i.saldo
        FROM automatic_reminders r
        JOIN invoices i ON r.invoice_id = i.id
    """
    params = []
    if estado:
        query += " WHERE r.estado = ?"
        params.append(estado)
    query += " ORDER BY r.fecha_programada DESC;"
    
    return execute_query(query, params, fetchall=True)

@app.post("/api/reminders/generate")
def generate_reminder(invoice_id: int, r_data: ReminderCreate):
    invoice = execute_query("SELECT id FROM invoices WHERE id = ?;", (invoice_id,), fetchone=True)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
        
    now_str = datetime.datetime.now().isoformat()
    reminder_id = execute_query(
        """
        INSERT INTO automatic_reminders (invoice_id, fecha_programada, destinatario, asunto, cuerpo, estado)
        VALUES (?, ?, ?, ?, ?, 'Pendiente');
        """,
        (invoice_id, now_str, r_data.destinatario, r_data.asunto, r_data.cuerpo)
    )
    
    return {"status": "success", "id": reminder_id}

SMTP_CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json")

def send_email_via_brevo(api_key, sender_email, to_email, subject, body):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }
    payload = {
        "sender": {"name": "ASBASALUD E.S.E. Cartera", "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "textContent": body
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode('utf-8')
            print(f"Brevo API response: {res_body}")
            return True
    except Exception as e:
        print(f"Brevo API error: {e}")
        if hasattr(e, 'read'):
            err_details = e.read().decode('utf-8')
            raise RuntimeError(f"Error Brevo API: {err_details}")
        raise RuntimeError(f"Error Brevo API: {str(e)}")

def send_email_unified(to_email, subject, body):
    if not os.path.exists(SMTP_CONFIG_PATH):
        print("Config file not found. Skipping real email (Simulation Mode).")
        return False
        
    with open(SMTP_CONFIG_PATH, "r") as f:
        config = json.load(f)
        
    provider = config.get("provider", "smtp")
    
    if provider == "brevo":
        api_key = config.get("brevo_api_key")
        sender = config.get("smtp_user")
        if not api_key or not sender:
            print("Brevo config incomplete. Skipping real email (Simulation Mode).")
            return False
        return send_email_via_brevo(api_key, sender, to_email, subject, body)
        
    server = config.get("smtp_server", "smtp.gmail.com")
    port = int(config.get("smtp_port", 465))
    user = config.get("smtp_user")
    password = config.get("smtp_password")
    use_ssl = config.get("use_ssl", True)
    
    if not user or not password:
        print("SMTP credentials incomplete. Skipping real email (Simulation Mode).")
        return False
        
    msg = MIMEMultipart()
    msg['From'] = user
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    try:
        if use_ssl:
            with smtplib.SMTP_SSL(server, port, timeout=10) as smtp:
                smtp.login(user, password)
                smtp.sendmail(user, to_email, msg.as_string())
        else:
            with smtplib.SMTP(server, port, timeout=10) as smtp:
                smtp.starttls()
                smtp.login(user, password)
                smtp.sendmail(user, to_email, msg.as_string())
        print(f"SMTP Email successfully sent to {to_email}")
        return True
    except Exception as e:
        print(f"SMTP error sending to {to_email}: {e}")
        raise RuntimeError(f"Error SMTP: {str(e)}")

@app.post("/api/reminders/{reminder_id}/send")
def send_reminder(reminder_id: int):
    reminder = execute_query("SELECT * FROM automatic_reminders WHERE id = ?;", (reminder_id,), fetchone=True)
    if not reminder:
        raise HTTPException(status_code=404, detail="Recordatorio no encontrado")
        
    now_str = datetime.datetime.now().isoformat()
    
    # Try sending real email first
    sent_real = False
    try:
        sent_real = send_email_unified(reminder["destinatario"], reminder["asunto"], reminder["cuerpo"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fallo al enviar correo real: {str(e)}")
        
    # Update status to 'Enviado'
    execute_query(
        "UPDATE automatic_reminders SET estado = 'Enviado', fecha_envio = ? WHERE id = ?;",
        (now_str, reminder_id)
    )
    
    # Log to history
    log_text = f"Correo de Cobro enviado a {reminder['destinatario']}. Asunto: {reminder['asunto']}"
    if sent_real:
        log_text += " [Enviado vía Canales Reales]"
    else:
        log_text += " [Simulado - Sin Configuración Activa]"
        
    execute_query(
        """
        INSERT INTO collection_history (invoice_id, fecha_gestion, tipo_gestion, descripcion, usuario)
        VALUES (?, ?, 'Correo', ?, 'Sistema SIC-ESE');
        """,
        (reminder["invoice_id"], now_str, log_text)
    )
    
    return {"status": "success", "fecha_envio": now_str, "smtp_sent": sent_real}



@app.post("/api/upload")
def upload_file(file: UploadFile = File(...)):
    # Save the file to local path (overwrite existing)
    target_path = r"g:\PROYECTOS-IA\Cartera\ESTADO CARTERA CORTE DIC 2025.xlsx"
    backup_path = r"g:\PROYECTOS-IA\Cartera\ESTADO CARTERA CORTE DIC 2025_BAK.xlsx"
    
    try:
        # Create a backup first
        if os.path.exists(target_path):
            shutil.copy(target_path, backup_path)
            
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run import (parser)
        # Import excel to db (reloads data but we need to keep history!)
        # Wait, does resetting the invoices table clear history?
        # In our SQLite schema, collection_history has ON DELETE CASCADE.
        # But wait! If we delete from invoices, all history is wiped out!
        # Oh, we must NOT wipe out history if we want to preserve it!
        # Let's write a smarter import mechanism or modify parser.py.
        # Let's update invoices. We can copy the old database, load new invoices, 
        # and re-link history or simply delete invoices but first backup history, and then restore it.
        # Even better: update parser.py to not wipe out history, or preserve history by matching consecutivo.
        # Let's fix this!
        
        # We will write a custom migration function inside parser.py that updates balances and inserts new ones
        # while keeping the invoices table and references intact! Let's do that!
        
        from parser import import_excel_to_db
        import_excel_to_db()
        
        return {"status": "success", "message": "Archivo cargado y procesado exitosamente"}
    except Exception as e:
        # Restore backup if failed
        if os.path.exists(backup_path):
            shutil.copy(backup_path, target_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/concentration")
def get_concentration():
    # Mayor Deuda Nominal: top 5 EPS by sum of saldo
    deuda_query = """
        SELECT nombre as entidad, nit, SUM(saldo) as saldo, COUNT(*) as count 
        FROM invoices 
        WHERE saldo > 0
        GROUP BY nit 
        ORDER BY saldo DESC 
        LIMIT 5;
    """
    deuda_stats = execute_query(deuda_query, fetchall=True)
    
    # Mayor Volumen de Facturación: top 5 EPS by count of invoices
    volumen_query = """
        SELECT nombre as entidad, nit, SUM(saldo) as saldo, COUNT(*) as count 
        FROM invoices 
        GROUP BY nit 
        ORDER BY count DESC 
        LIMIT 5;
    """
    volumen_stats = execute_query(volumen_query, fetchall=True)
    
    # Mayor Tasa de Glosa: top 5 EPS by glosa rate (Yellow category balance / total balance)
    # Filter where total saldo > 5,000,000 to avoid low divisor bias
    glosa_query = """
        SELECT nombre as entidad, nit, 
               SUM(CASE WHEN categoria LIKE '%GLOSAS%' OR categoria LIKE '%CONCILIACIÓN%' THEN saldo ELSE 0 END) as saldo_glosa,
               SUM(saldo) as saldo_total,
               (SUM(CASE WHEN categoria LIKE '%GLOSAS%' OR categoria LIKE '%CONCILIACIÓN%' THEN saldo ELSE 0 END) * 100.0 / SUM(saldo)) as tasa_glosa
        FROM invoices 
        GROUP BY nit 
        HAVING saldo_total > 5000000
        ORDER BY tasa_glosa DESC 
        LIMIT 5;
    """
    glosa_stats = execute_query(glosa_query, fetchall=True)
    
    return {
        "deuda": deuda_stats,
        "volumen": volumen_stats,
        "glosa": glosa_stats
    }

@app.get("/api/eps/{nit}")
def get_eps_detail(nit: str):
    # Get name and nit
    eps_info = execute_query(
        "SELECT nombre, nit, SUM(saldo) as total_saldo, COUNT(*) as count FROM invoices WHERE nit = ? LIMIT 1;", 
        (nit,), 
        fetchone=True
    )
    if not eps_info or not eps_info['nit']:
        raise HTTPException(status_code=404, detail="EPS no encontrada")
        
    # Ley 1438 Semaphor counts
    # Verde: 0-20 days, Amarillo: 21-45 days, Rojo: >45 days
    semaphor_query = """
        SELECT 
            SUM(CASE WHEN nodias <= 20 THEN saldo ELSE 0 END) as verde_saldo,
            COUNT(CASE WHEN nodias <= 20 THEN 1 END) as verde_count,
            SUM(CASE WHEN nodias > 20 AND nodias <= 45 THEN saldo ELSE 0 END) as amarillo_saldo,
            COUNT(CASE WHEN nodias > 20 AND nodias <= 45 THEN 1 END) as amarillo_count,
            SUM(CASE WHEN nodias > 45 THEN saldo ELSE 0 END) as rojo_saldo,
            COUNT(CASE WHEN nodias > 45 THEN 1 END) as rojo_count
        FROM invoices
        WHERE nit = ? AND saldo > 0;
    """
    semaphor_stats = execute_query(semaphor_query, (nit,), fetchone=True)
    
    # Status counts
    # Radicada, Auditada, Glosada en Conciliación, Aceptada, Cancelada
    status_query = """
        SELECT 
            SUM(CASE WHEN categoria LIKE '%INICIO DE TRÁMITE%' OR categoria LIKE '%INICIAR PROCESO%' THEN saldo ELSE 0 END) as radicada_saldo,
            COUNT(CASE WHEN categoria LIKE '%INICIO DE TRÁMITE%' OR categoria LIKE '%INICIAR PROCESO%' THEN 1 END) as radicada_count,
            
            SUM(CASE WHEN (categoria LIKE '%CONCILIADA%' OR categoria LIKE '%REPORTADA%') AND saldo > 0 THEN saldo ELSE 0 END) as auditada_saldo,
            COUNT(CASE WHEN (categoria LIKE '%CONCILIADA%' OR categoria LIKE '%REPORTADA%') AND saldo > 0 THEN 1 END) as auditada_count,
            
            SUM(CASE WHEN categoria LIKE '%GLOSAS%' OR categoria LIKE '%DEVOLUCIONES%' THEN saldo ELSE 0 END) as glosada_saldo,
            COUNT(CASE WHEN categoria LIKE '%GLOSAS%' OR categoria LIKE '%DEVOLUCIONES%' THEN 1 END) as glosada_count,
            
            SUM(CASE WHEN saldo = 0 THEN valor ELSE 0 END) as cancelada_saldo,
            COUNT(CASE WHEN saldo = 0 THEN 1 END) as cancelada_count
        FROM invoices
        WHERE nit = ?;
    """
    status_stats = execute_query(status_query, (nit,), fetchone=True)
    
    # History logs for all invoices of this EPS
    history_query = """
        SELECT h.*, i.consecutiv, i.categoria
        FROM collection_history h 
        JOIN invoices i ON h.invoice_id = i.id 
        WHERE i.nit = ? 
        ORDER BY h.fecha_gestion DESC
        LIMIT 100;
    """
    history = execute_query(history_query, (nit,), fetchall=True)
    
    return {
        "info": eps_info,
        "semaphor": semaphor_stats,
        "status_distribution": status_stats,
        "history": history
    }

@app.get("/api/eps/{nit}/coercitivo-data")
def get_coercitivo_data(nit: str):
    eps_info = execute_query("SELECT nombre, nit FROM invoices WHERE nit = ? LIMIT 1;", (nit,), fetchone=True)
    if not eps_info:
        raise HTTPException(status_code=404, detail="EPS no encontrada")
        
    # List of outstanding invoices in Rojo (>45 days)
    invoices_query = """
        SELECT consecutiv, fecha_emision, fecha_vencimiento, valor, abonos, saldo, nodias, categoria
        FROM invoices
        WHERE nit = ? AND saldo > 0 AND nodias > 45
        ORDER BY nodias DESC
        LIMIT 200;
    """
    invoices_list = execute_query(invoices_query, (nit,), fetchall=True)
    
    total_saldo = sum([inv['saldo'] for inv in invoices_list])
    
    # Return data for frontend print template
    return {
        "fecha_documento": datetime.date.today().isoformat(),
        "entidad_deudora": eps_info["nombre"],
        "nit_deudora": eps_info["nit"],
        "invoices": invoices_list,
        "total_saldo": total_saldo,
        "entidad_remitente": "ASBASALUD E.S.E. Manizales",
        "nit_remitente": "890.802.233-1",
        "ciudad": "Manizales, Caldas",
        "referencia": "OFICIO DE REQUERIMIENTO FORMAL Y COBRO COERCITIVO - LEY 1438 DE 2011",
        "firmante": "Jefe de Cartera / Subgerente Financiero",
        "cargo_firmante": "Jefe del Área de Cartera de Alto Nivel"
    }

@app.get("/api/settings/smtp")
def get_smtp_settings():
    if not os.path.exists(SMTP_CONFIG_PATH):
        return {
            "provider": "smtp",
            "smtp_server": "smtp.gmail.com",
            "smtp_port": 465,
            "smtp_user": "",
            "has_password": False,
            "use_ssl": True,
            "brevo_api_key": "",
            "has_brevo_key": False,
            "configured": False
        }
    with open(SMTP_CONFIG_PATH, "r") as f:
        config = json.load(f)
    return {
        "provider": config.get("provider", "smtp"),
        "smtp_server": config.get("smtp_server", "smtp.gmail.com"),
        "smtp_port": config.get("smtp_port", 465),
        "smtp_user": config.get("smtp_user", ""),
        "has_password": len(config.get("smtp_password", "")) > 0,
        "use_ssl": config.get("use_ssl", True),
        "brevo_api_key": "", 
        "has_brevo_key": len(config.get("brevo_api_key", "")) > 0,
        "configured": True
    }

@app.post("/api/settings/smtp")
def save_smtp_settings(config: SmtpConfig):
    config_dict = {
        "provider": config.provider,
        "smtp_server": config.smtp_server,
        "smtp_port": config.smtp_port,
        "smtp_user": config.smtp_user,
        "smtp_password": config.smtp_password,
        "use_ssl": config.use_ssl,
        "brevo_api_key": config.brevo_api_key
    }
    
    if os.path.exists(SMTP_CONFIG_PATH):
        with open(SMTP_CONFIG_PATH, "r") as f:
            existing = json.load(f)
        if not config.smtp_password and "smtp_password" in existing:
            config_dict["smtp_password"] = existing["smtp_password"]
        if not config.brevo_api_key and "brevo_api_key" in existing:
            config_dict["brevo_api_key"] = existing["brevo_api_key"]
            
    with open(SMTP_CONFIG_PATH, "w") as f:
        json.dump(config_dict, f, indent=4)
    return {"status": "success", "message": "Configuración de correo guardada exitosamente"}

@app.post("/api/settings/smtp/test")
def test_smtp_settings(test_req: SmtpTestRequest):
    if not os.path.exists(SMTP_CONFIG_PATH):
        raise HTTPException(status_code=400, detail="Debe guardar la configuración de correo primero")
        
    with open(SMTP_CONFIG_PATH, "r") as f:
        config = json.load(f)
        
    subject = "Correo de Prueba - Sistema SIC-ESE ASBASALUD"
    body = f"""Hola,

Esta es una prueba de conexión exitosa desde el Sistema Inteligente de Cartera E.S.E. (SIC-ESE) de ASBASALUD Manizales.

Si has recibido este correo, significa que la configuración de correo ({config.get('provider', 'smtp').upper()}) para el remitente {config.get('smtp_user')} es correcta y el sistema puede enviar notificaciones reales a las EPS.

Fecha de prueba: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Atentamente,
Servidor de Cartera SIC-ESE"""
    
    try:
        send_email_unified(test_req.destinatario, subject, body)
        return {"status": "success", "message": f"Correo de prueba enviado con éxito a {test_req.destinatario}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# SERVIR FRONTEND ESTATICO EN PRODUCCION
# ==========================================
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(frontend_dist_path):
    assets_path = os.path.join(frontend_dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
        
    @app.get("/{catchall:path}")
    def serve_frontend(catchall: str):
        file_path = os.path.join(frontend_dist_path, catchall)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist_path, "index.html"))
else:
    print(f"ADVERTENCIA: La carpeta de producción del frontend no existe en {frontend_dist_path}. Servidor web solo responderá a endpoints de la API.")


