@echo off
title Iniciando Sistema Inteligente de Cartera E.S.E. (SIC-ESE)
echo ==============================================================
echo   INICIANDO SERVICIOS DE CARTERA - ASBASALUD E.S.E.
echo ==============================================================
echo.

:: 1. Verificar si Python esta instalado
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no esta instalado o no se encuentra en el PATH.
    echo Por favor, instale Python para poder ejecutar el sistema.
    pause
    exit /b 1
)

:: 2. Verificar si el directorio del backend existe
if not exist "backend\main.py" (
    echo [ERROR] No se encuentra la carpeta de backend o el archivo main.py.
    echo Asegurese de ejecutar este archivo desde la carpeta raiz del proyecto.
    pause
    exit /b 1
)

:: 3. Iniciar el backend usando pythonw (en segundo plano y sin ventana negra de consola)
echo [+] Iniciando servidor en segundo plano...
cd backend
start "" pythonw -m uvicorn main:app --host 127.0.0.1 --port 8000 > server_startup.log 2>&1
cd ..

:: 4. Esperar 3 segundos para que el servidor se enlace al puerto 8000
echo [+] Esperando que los servicios se activen...
timeout /t 3 /nobreak >nul

:: 5. Abrir el navegador web predeterminado en la direccion del servidor local
echo [+] Abriendo navegador web...
start http://127.0.0.1:8000/

echo.
echo ==============================================================
echo   ¡SISTEMA INICIADO CORRECTAMENTE!
echo   Para detener los servicios, ejecute el archivo:
echo   "Detener_SIC_ESE.bat"
echo ==============================================================
timeout /t 4 >nul
exit
