import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cartera.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create invoices table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sheet_name TEXT,
        nit TEXT,
        nombre TEXT,
        cta1 TEXT,
        tipo TEXT,
        consecutiv TEXT,
        fecha_vencimiento TEXT,
        valor REAL,
        abonos REAL,
        saldo REAL,
        ano INTEGER,
        fecha_emision TEXT,
        radicado TEXT,
        nodias INTEGER,
        porven REAL,
        ven060 REAL,
        ven090 REAL,
        ven180 REAL,
        ven360 REAL,
        venmas REAL,
        categoria TEXT,
        color_hex TEXT,
        observaciones TEXT
    );
    """)
    
    # Create indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_invoices_sheet ON invoices(sheet_name);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_invoices_nit ON invoices(nit);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_invoices_consecutiv ON invoices(consecutiv);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_invoices_saldo ON invoices(saldo);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_invoices_categoria ON invoices(categoria);")

    # Create collection history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS collection_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER,
        fecha_gestion TEXT,
        tipo_gestion TEXT,
        descripcion TEXT,
        usuario TEXT,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_history_invoice ON collection_history(invoice_id);")

    # Create automatic reminders table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS automatic_reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER,
        fecha_programada TEXT,
        destinatario TEXT,
        asunto TEXT,
        cuerpo TEXT,
        estado TEXT DEFAULT 'Pendiente',
        fecha_envio TEXT,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_reminders_invoice ON automatic_reminders(invoice_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_reminders_estado ON automatic_reminders(estado);")

    conn.commit()
    conn.close()
    print("Database initialized successfully at:", DB_PATH)

if __name__ == "__main__":
    init_db()
