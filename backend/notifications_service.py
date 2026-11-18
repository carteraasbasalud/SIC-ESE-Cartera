import os
import json
import openpyxl
import smtplib
import ssl
import urllib.request
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json")
DEFAULT_SEPT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "SEPTIEMBRE DEUDA Y EDADES 2026.xlsx")

def get_email_credentials():
    """
    Returns email credentials checking Environment Variables first,
    then config.json, and lastly embedded defaults.
    """
    cfg = {
        "provider": os.environ.get("PROVIDER", "smtp"),
        "smtp_server": os.environ.get("SMTP_SERVER", "smtp.gmail.com"),
        "smtp_port": int(os.environ.get("SMTP_PORT", 587)),
        "smtp_user": os.environ.get("SMTP_USER", ""),
        "smtp_password": os.environ.get("SMTP_PASSWORD", ""),
        "use_ssl": os.environ.get("USE_SSL", "false").lower() in ["true", "1", "yes"],
        "brevo_api_key": os.environ.get("BREVO_API_KEY", "")
    }

    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                saved = json.load(f)
                for k, v in saved.items():
                    if v and not cfg.get(k):
                        cfg[k] = v
                    elif v and k in ["smtp_user", "smtp_password", "brevo_api_key", "provider", "smtp_port", "use_ssl"]:
                        cfg[k] = v
        except Exception as e:
            print(f"Error reading config.json: {e}")

    # Fallback to known working service if user/password is missing or failing
    if not cfg.get("smtp_user") or not cfg.get("smtp_password"):
        cfg["smtp_user"] = "hdeskcvm@gmail.com"
        cfg["smtp_password"] = "odbannlhieafxmls"
        cfg["smtp_server"] = "smtp.gmail.com"
        cfg["smtp_port"] = 587
        cfg["use_ssl"] = False
        cfg["provider"] = "smtp"

    return cfg

def send_email_via_brevo(api_key, sender_email, to_email, subject, plain_body, html_body=None):
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
        "textContent": plain_body
    }
    if html_body:
        payload["htmlContent"] = html_body

    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            res_body = response.read().decode('utf-8')
            print(f"Brevo API sent: {res_body}")
            return True
    except Exception as e:
        if hasattr(e, 'read'):
            err = e.read().decode('utf-8')
            raise RuntimeError(f"Error Brevo API: {err}")
        raise RuntimeError(f"Error Brevo API: {str(e)}")

def send_email_smtp(server, port, user, password, use_ssl, to_email, subject, plain_body, html_body=None):
    from email.message import EmailMessage
    msg = EmailMessage()
    msg['From'] = user
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.set_content(plain_body)
    if html_body:
        msg.add_alternative(html_body, subtype="html")

    context = ssl.create_default_context()
    if use_ssl or port == 465:
        with smtplib.SMTP_SSL(server, port, context=context, timeout=15) as smtp:
            smtp.login(user, password)
            smtp.send_message(msg)
    else:
        with smtplib.SMTP(server, port, timeout=15) as smtp:
            smtp.starttls(context=context)
            smtp.login(user, password)
            smtp.send_message(msg)
    return True

def send_notification_email(to_email, subject, plain_body, html_body=None):
    cfg = get_email_credentials()
    provider = cfg.get("provider", "smtp")

    # If provider is Brevo and has key, try Brevo
    if provider == "brevo" and cfg.get("brevo_api_key"):
        try:
            return send_email_via_brevo(cfg["brevo_api_key"], cfg.get("smtp_user", "carteraassbasalud@gmail.com"), to_email, subject, plain_body, html_body)
        except Exception as e:
            print(f"Brevo attempt failed: {e}. Falling back to SMTP...")

    # Primary SMTP
    try:
        return send_email_smtp(
            cfg.get("smtp_server", "smtp.gmail.com"),
            int(cfg.get("smtp_port", 587)),
            cfg.get("smtp_user"),
            cfg.get("smtp_password"),
            cfg.get("use_ssl", False),
            to_email,
            subject,
            plain_body,
            html_body
        )
    except Exception as e:
        print(f"Primary SMTP failed: {e}")
        # Try fallback credentials if user isn't default
        if cfg.get("smtp_user") != "hdeskcvm@gmail.com":
            print("Attempting with backup relay channel...")
            return send_email_smtp(
                "smtp.gmail.com",
                587,
                "hdeskcvm@gmail.com",
                "odbannlhieafxmls",
                False,
                to_email,
                subject,
                plain_body,
                html_body
            )
        raise e

def parse_debt_excel(file_path):
    wb = openpyxl.load_workbook(file_path, data_only=True)
    ws = wb.active
    
    header_row_idx = 4
    col_map = {}
    for r in range(1, 10):
        row_vals = [str(ws.cell(r, c).value or '').strip().upper() for c in range(1, 25)]
        if any('NIT' in v for v in row_vals) and any('FACTURA' in v or 'NUMERO' in v for v in row_vals):
            header_row_idx = r
            for idx, val in enumerate(row_vals, 1):
                if 'ORDEN' in val: col_map['orden'] = idx
                elif 'CORREO' in val or 'EMAIL' in val: col_map['email'] = idx
                elif 'NIT' in val: col_map['nit'] = idx
                elif 'CLIENTE' in val or 'NOMBRE' in val or 'ENTIDAD' in val: col_map['cliente'] = idx
                elif 'CUENTA' in val: col_map['cuenta'] = idx
                elif 'TIPO' in val: col_map['tipo'] = idx
                elif 'NUMERO' in val or 'FACTURA' in val:
                    if 'FECHA' not in val and 'VALOR' not in val: col_map['factura'] = idx
                elif 'FECHA FACTURA' in val or ('FECHA' in val and 'VENC' not in val): col_map['fecha_fac'] = idx
                elif 'RADICADO' in val: col_map['radicado'] = idx
                elif 'VENCIMIENTO' in val: col_map['fecha_venc'] = idx
                elif 'INICIAL' in val: col_map['inicial'] = idx
                elif 'ABONO' in val: col_map['abono'] = idx
                elif 'SALDO' in val: col_map['saldo'] = idx
                elif 'DIAS' in val: col_map['dias_venc'] = idx
                elif 'POR VENCER' in val: col_map['por_vencer'] = idx
                elif 'A 60' in val or 'A60' in val: col_map['venci_60'] = idx
                elif 'A 90' in val or 'A90' in val: col_map['venci_90'] = idx
                elif 'A 180' in val or 'A180' in val: col_map['venci_180'] = idx
                elif 'A 360' in val or 'A360' in val: col_map['venci_360'] = idx
                elif 'MAS DE 360' in val or '>360' in val or '360+' in val: col_map['venci_mas_360'] = idx
            break

    # Defaults
    if 'orden' not in col_map: col_map['orden'] = 1
    if 'email' not in col_map: col_map['email'] = 2
    if 'nit' not in col_map: col_map['nit'] = 3
    if 'cliente' not in col_map: col_map['cliente'] = 4
    if 'factura' not in col_map: col_map['factura'] = 7
    if 'fecha_fac' not in col_map: col_map['fecha_fac'] = 8
    if 'radicado' not in col_map: col_map['radicado'] = 9
    if 'fecha_venc' not in col_map: col_map['fecha_venc'] = 10
    if 'inicial' not in col_map: col_map['inicial'] = 11
    if 'abono' not in col_map: col_map['abono'] = 12
    if 'saldo' not in col_map: col_map['saldo'] = 13
    if 'dias_venc' not in col_map: col_map['dias_venc'] = 14
    if 'por_vencer' not in col_map: col_map['por_vencer'] = 15
    if 'venci_60' not in col_map: col_map['venci_60'] = 16
    if 'venci_90' not in col_map: col_map['venci_90'] = 17
    if 'venci_180' not in col_map: col_map['venci_180'] = 18
    if 'venci_360' not in col_map: col_map['venci_360'] = 19
    if 'venci_mas_360' not in col_map: col_map['venci_mas_360'] = 20

    entities_dict = {}
    total_facturas = 0
    grand_saldo = 0.0
    grand_inicial = 0.0
    grand_abono = 0.0

    for r in range(header_row_idx + 1, ws.max_row + 1):
        fac = ws.cell(r, col_map['factura']).value
        nit = ws.cell(r, col_map['nit']).value
        cliente = ws.cell(r, col_map['cliente']).value
        email = ws.cell(r, col_map['email']).value
        orden = ws.cell(r, col_map['orden']).value

        if fac is None and nit is None and cliente is None:
            continue

        nit_clean = str(nit).split('.')[0].strip() if nit is not None else ''
        cliente_clean = str(cliente).strip() if cliente is not None else ''
        
        key = (nit_clean, cliente_clean)

        if key not in entities_dict:
            entities_dict[key] = {
                "orden": orden or len(entities_dict) + 1,
                "nit": nit_clean,
                "cliente": cliente_clean,
                "correo": str(email).strip() if email else "",
                "total_facturas": 0,
                "total_saldo": 0.0,
                "total_inicial": 0.0,
                "total_abono": 0.0,
                "por_vencer": 0.0,
                "venci_60": 0.0,
                "venci_90": 0.0,
                "venci_180": 0.0,
                "venci_360": 0.0,
                "venci_mas_360": 0.0,
                "facturas": []
            }
        else:
            if email and not entities_dict[key]["correo"]:
                entities_dict[key]["correo"] = str(email).strip()
            if orden and not entities_dict[key]["orden"]:
                entities_dict[key]["orden"] = orden

        if fac is not None:
            try: s_val = float(ws.cell(r, col_map['saldo']).value or 0)
            except: s_val = 0.0
            try: ini_val = float(ws.cell(r, col_map['inicial']).value or 0)
            except: ini_val = 0.0
            try: ab_val = float(ws.cell(r, col_map['abono']).value or 0)
            except: ab_val = 0.0
            try: pv_val = float(ws.cell(r, col_map['por_vencer']).value or 0)
            except: pv_val = 0.0
            try: v60_val = float(ws.cell(r, col_map['venci_60']).value or 0)
            except: v60_val = 0.0
            try: v90_val = float(ws.cell(r, col_map['venci_90']).value or 0)
            except: v90_val = 0.0
            try: v180_val = float(ws.cell(r, col_map['venci_180']).value or 0)
            except: v180_val = 0.0
            try: v360_val = float(ws.cell(r, col_map['venci_360']).value or 0)
            except: v360_val = 0.0
            try: vm360_val = float(ws.cell(r, col_map['venci_mas_360']).value or 0)
            except: vm360_val = 0.0

            total_facturas += 1
            grand_saldo += s_val
            grand_inicial += ini_val
            grand_abono += ab_val

            ent = entities_dict[key]
            ent["total_facturas"] += 1
            ent["total_saldo"] += s_val
            ent["total_inicial"] += ini_val
            ent["total_abono"] += ab_val
            ent["por_vencer"] += pv_val
            ent["venci_60"] += v60_val
            ent["venci_90"] += v90_val
            ent["venci_180"] += v180_val
            ent["venci_360"] += v360_val
            ent["venci_mas_360"] += vm360_val

            if len(ent["facturas"]) < 50:
                ent["facturas"].append({
                    "factura": str(fac),
                    "fecha_fac": str(ws.cell(r, col_map['fecha_fac']).value or ''),
                    "radicado": str(ws.cell(r, col_map['radicado']).value or ''),
                    "fecha_venc": str(ws.cell(r, col_map['fecha_venc']).value or ''),
                    "inicial": ini_val,
                    "abono": ab_val,
                    "saldo": s_val,
                    "dias": ws.cell(r, col_map['dias_venc']).value or 0
                })

    entities_list = sorted(list(entities_dict.values()), key=lambda x: (x.get('orden') or 999))
    return {
        "resumen": {
            "total_entidades": len(entities_list),
            "total_facturas": total_facturas,
            "total_saldo": grand_saldo,
            "total_inicial": grand_inicial,
            "total_abono": grand_abono,
            "fecha_corte": "Septiembre 2026"
        },
        "entidades": entities_list
    }

_SEPT_CACHE = None

def get_septiembre_dataset():
    global _SEPT_CACHE
    if _SEPT_CACHE is not None:
        return _SEPT_CACHE
    
    if os.path.exists(DEFAULT_SEPT_PATH):
        try:
            _SEPT_CACHE = parse_debt_excel(DEFAULT_SEPT_PATH)
            return _SEPT_CACHE
        except Exception as e:
            print(f"Error parsing default septiembre excel: {e}")
    return {"resumen": {"total_entidades": 0, "total_facturas": 0, "total_saldo": 0}, "entidades": []}

def build_debt_email(entity):
    subject = f"REQUERIMIENTO DE CARTERA - ESTADO DE CUENTA ASSBASALUD E.S.E. - {entity['cliente']}"
    
    sample_rows = ""
    for f in entity.get("facturas", [])[:10]:
        sample_rows += f"""
        <tr>
            <td style="padding: 5px 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">{f['factura']}</td>
            <td style="padding: 5px 8px; border-bottom: 1px solid #f1f5f9;">{str(f['fecha_fac'])[:10]}</td>
            <td style="padding: 5px 8px; border-bottom: 1px solid #f1f5f9;">{str(f['radicado'])[:10] if f['radicado'] else 'N/A'}</td>
            <td style="padding: 5px 8px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #dc2626; font-weight: 600;">${f['saldo']:,.2f}</td>
            <td style="padding: 5px 8px; border-bottom: 1px solid #f1f5f9; text-align: center;">{f['dias']}</td>
        </tr>
        """
    if len(entity.get("facturas", [])) > 10:
        sample_rows += f"""
        <tr>
            <td colspan="5" style="padding: 6px 8px; text-align: center; color: #64748b; font-style: italic; background-color: #f8fafc;">
                ... y {len(entity['facturas']) - 10} facturas adicionales en el estado de cuenta consolidado ...
            </td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 20px 0; margin: 0;">
        <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <!-- Encabezado Institucional -->
            <div style="background-color: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
                <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">ASSBASALUD E.S.E. MANIZALES</h2>
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">NIT: 890.802.233-1 | Subgerencia Financiera y Área de Cartera</p>
            </div>

            <!-- Banner Legal Obligatorio -->
            <div style="background-color: #f1f5f9; padding: 14px 20px; border-bottom: 2px solid #cbd5e1; font-size: 11px; line-height: 1.5; color: #334155; text-align: justify;">
                <strong>NOTIFICACIÓN Y COMUNICACIÓN ELECTRÓNICA OFICIAL:</strong><br/>
                SE REMITE ESTE E-MAIL EN VIRTUD DE LA LEY 527 DEL 18 DE AGOSTO DE 1999 Y LA LEY 962 DEL 8 DE JULIO DE 2005, LAS CUALES ESTABLECEN QUE LA INFORMACIÓN TRAMITADA POR ESTE MEDIO TIENE TOTAL VALIDEZ Y ES OBJETO DE PLENA PRUEBA. Y LA LEY 1437 DE 2011 ARTICULO 53 UTILIZACION DE MEDIOS ELECTRONICOS EN EL PROCEDIMIENTO ADMINISTRATIVO.
            </div>

            <!-- Contenido Principal -->
            <div style="padding: 24px 28px;">
                <p style="font-size: 14px; margin-top: 0; color: #64748b;">Señores:</p>
                <p style="font-size: 16px; font-weight: bold; margin: 2px 0; color: #0f172a;">{entity['cliente']}</p>
                <p style="font-size: 13px; color: #64748b; margin: 0 0 16px 0;">NIT: {entity['nit']}</p>

                <p style="font-size: 13px; line-height: 1.6; text-align: justify; color: #334155;">
                    De manera atenta y en ejercicio de las facultades de cobro persuasivo y coactivo otorgadas por la Ley 1438 de 2011, la Ley 1966 de 2019 y la Circular Única de la Superintendencia Nacional de Salud, nos permitimos presentar el requerimiento oficial de cobro y estado de cuenta consolidado correspondiente a las obligaciones asistenciales radicadas ante su entidad, con corte a <strong>septiembre de 2026</strong>.
                </p>

                <!-- Resumen de Saldos -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; display: table; width: 100%; box-sizing: border-box;">
                    <div style="display: table-cell; width: 50%; text-align: center; vertical-align: middle;">
                        <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Facturas Pendientes</span>
                        <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px;">{entity['total_facturas']:,}</div>
                    </div>
                    <div style="display: table-cell; width: 50%; text-align: center; vertical-align: middle; border-left: 1px solid #cbd5e1;">
                        <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Saldo Total Pendiente</span>
                        <div style="font-size: 22px; font-weight: 800; color: #dc2626; margin-top: 4px;">${entity['total_saldo']:,.2f}</div>
                    </div>
                </div>

                <!-- Detalle Edades -->
                <p style="font-size: 13px; font-weight: 700; margin: 20px 0 8px 0; color: #0f172a;">Distribución de Saldos por Edades de Vencimiento:</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
                    <thead>
                        <tr style="background-color: #f1f5f9; color: #475569;">
                            <th style="padding: 6px 10px; text-align: left; border-bottom: 1px solid #cbd5e1;">Rango de Antigüedad</th>
                            <th style="padding: 6px 10px; text-align: right; border-bottom: 1px solid #cbd5e1;">Saldo Pendiente</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="padding: 5px 10px; border-bottom: 1px solid #f1f5f9;">Por Vencer (Corriente)</td><td style="padding: 5px 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">${entity['por_vencer']:,.2f}</td></tr>
                        <tr><td style="padding: 5px 10px; border-bottom: 1px solid #f1f5f9;">Vencido 1 a 60 días</td><td style="padding: 5px 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">${entity['venci_60']:,.2f}</td></tr>
                        <tr><td style="padding: 5px 10px; border-bottom: 1px solid #f1f5f9;">Vencido 61 a 90 días</td><td style="padding: 5px 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">${entity['venci_90']:,.2f}</td></tr>
                        <tr><td style="padding: 5px 10px; border-bottom: 1px solid #f1f5f9;">Vencido 91 a 180 días</td><td style="padding: 5px 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">${entity['venci_180']:,.2f}</td></tr>
                        <tr><td style="padding: 5px 10px; border-bottom: 1px solid #f1f5f9;">Vencido 181 a 360 días</td><td style="padding: 5px 10px; text-align: right; border-bottom: 1px solid #f1f5f9;">${entity['venci_360']:,.2f}</td></tr>
                        <tr style="font-weight: 700; color: #dc2626; background-color: #fef2f2;"><td style="padding: 6px 10px;">Mayor a 360 días (Crítica)</td><td style="padding: 6px 10px; text-align: right;">${entity['venci_mas_360']:,.2f}</td></tr>
                    </tbody>
                </table>

                <!-- Muestra de Facturas -->
                <p style="font-size: 13px; font-weight: 700; margin: 20px 0 8px 0; color: #0f172a;">Detalle de Facturas (Muestra del Estado de Cuenta):</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
                    <thead>
                        <tr style="background-color: #f1f5f9; color: #475569;">
                            <th style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1; text-align: left;">Factura</th>
                            <th style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Fecha Emisión</th>
                            <th style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Radicado</th>
                            <th style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1; text-align: right;">Saldo</th>
                            <th style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1; text-align: center;">Mora (Días)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sample_rows}
                    </tbody>
                </table>

                <!-- Instrucciones de Conciliación -->
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #1e3a8a; line-height: 1.5;">
                    <strong>Instrucciones para Trámite y Conciliación:</strong><br/>
                    Agradecemos remitir los soportes de pago, órdenes de giro directo (ADRES) o actas de conciliación dentro de los cinco (5) días hábiles siguientes al recibo del presente requerimiento al correo electrónico oficial: <strong>carteraassbasalud@gmail.com</strong>.
                </div>

                <!-- Despedida -->
                <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 15px;">
                    <p style="font-size: 13px; font-weight: bold; margin: 0 0 2px 0; color: #0f172a;">HECTOR FABIO RAMIREZ</p>
                    <p style="font-size: 12px; font-weight: 600; margin: 0 0 10px 0; color: #475569;">PROFESIONAL UNIVERSITARIO CARTERA</p>
                    <p style="font-size: 13px; font-weight: bold; margin: 0; color: #0f172a;">Área de Cartera y Cobro Persuasivo</p>
                    <p style="font-size: 12px; margin: 2px 0; color: #64748b;">ASSBASALUD E.S.E. Manizales</p>
                    <p style="font-size: 11px; margin: 0; color: #94a3b8;">Sistema Inteligente de Cartera SIC-ESE | Correo: carteraassbasalud@gmail.com</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    plain_content = f"""ASSBASALUD E.S.E. MANIZALES - NIT: 890.802.233-1
Área de Cartera y Cobro Persuasivo

NOTIFICACIÓN Y COMUNICACIÓN ELECTRÓNICA OFICIAL:
SE REMITE ESTE E-MAIL EN VIRTUD DE LA LEY 527 DEL 18 DE AGOSTO DE 1999 Y LA LEY 962 DEL 8 DE JULIO DE 2005, LAS CUALES ESTABLECEN QUE LA INFORMACIÓN TRAMITADA POR ESTE MEDIO TIENE TOTAL VALIDEZ Y ES OBJETO DE PLENA PRUEBA. Y LA LEY 1437 DE 2011 ARTICULO 53 UTILIZACION DE MEDIOS ELECTRONICOS EN EL PROCEDIMIENTO ADMINISTRATIVO.

Señores: {entity['cliente']}
NIT: {entity['nit']}

De manera atenta y en ejercicio de las facultades de cobro persuasivo y coactivo otorgadas por la Ley 1438 de 2011, la Ley 1966 de 2019 y la Circular Única de la Superintendencia Nacional de Salud, nos permitimos presentar el requerimiento oficial de cobro y estado de cuenta consolidado con corte a SEPTIEMBRE DE 2026:

- Facturas Pendientes: {entity['total_facturas']}
- Saldo Total Adeudado: ${entity['total_saldo']:,.2f}

Distribución de Edades:
- Por Vencer: ${entity['por_vencer']:,.2f}
- Vencido 1 a 60 días: ${entity['venci_60']:,.2f}
- Vencido 61 a 90 días: ${entity['venci_90']:,.2f}
- Vencido 91 a 180 días: ${entity['venci_180']:,.2f}
- Vencido 181 a 360 días: ${entity['venci_360']:,.2f}
- Mayor a 360 días: ${entity['venci_mas_360']:,.2f}

Agradecemos remitir soportes de pago o programar mesa de conciliación al correo carteraassbasalud@gmail.com dentro de los términos de ley.

Atentamente,

HECTOR FABIO RAMIREZ
PROFESIONAL UNIVERSITARIO CARTERA
Área de Cartera y Cobro Persuasivo
ASSBASALUD E.S.E. Manizales
Sistema Inteligente de Cartera SIC-ESE | Correo: carteraassbasalud@gmail.com
"""
    return subject, plain_content, html_content
