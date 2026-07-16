import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cartera.db")

def verify():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file does not exist at {DB_PATH}")
        return
        
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("--- SQLite Database Verification ---")
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r['name'] for r in cursor.fetchall()]
    print("Tables in database:", tables)
    
    # Check invoice count per sheet
    for sheet in ['CONSOLIDADO', 'ASMETSALUD_REPORTADAS', 'OTRAS_EPS_2013_2022', 'OTRAS_EPS_2023']:
        cursor.execute("SELECT COUNT(*) as count, SUM(saldo) as total_saldo FROM invoices WHERE sheet_name = ?;", (sheet,))
        res = cursor.fetchone()
        print(f"Sheet '{sheet}': Count = {res['count']}, Total Saldo = {res['total_saldo']}")
        
    # Check categories in OTRAS_EPS_2023
    print("\nCategories in OTRAS_EPS_2023:")
    cursor.execute("""
        SELECT categoria, COUNT(*) as count, SUM(saldo) as total_saldo 
        FROM invoices 
        WHERE sheet_name = 'OTRAS_EPS_2023' 
        GROUP BY categoria 
        ORDER BY total_saldo DESC;
    """)
    for r in cursor.fetchall():
        print(f"  - {r['categoria']}: Count={r['count']}, Total Saldo={r['total_saldo']}")
        
    conn.close()

if __name__ == "__main__":
    verify()
