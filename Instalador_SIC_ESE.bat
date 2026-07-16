@echo off
title Instalador Automatizado - SIC-ESE ASBASALUD
echo ==============================================================
echo   INSTALADOR DE UN CLIC - SISTEMA INTELIGENTE DE CARTERA ESE
echo ==============================================================
echo.

:: 1. Comprobar privilegios de Administrador (requerido para instalar Python y escribir en C:\)
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Solicitando permisos de Administrador...
    powershell -Command "Start-Process -FilePath '%0' -Verb RunAs"
    exit /b
)

:: 2. Detectar e instalar Python de forma silenciosa si no existe
echo [+] Verificando si Python esta instalado en el sistema...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python no fue detectado. Iniciando descarga automatica...
    echo [+] Descargando instalador oficial de Python 3.10.11...
    curl -L -o "%temp%\python_setup.exe" "https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe"
    if %errorlevel% neq 0 (
        echo [ERROR] No se pudo descargar el instalador de Python. Verifique su conexion a internet.
        pause
        exit /b 1
    )
    
    echo [+] Instalando Python en segundo plano (silencioso). Por favor, espere...
    start /wait "" "%temp%\python_setup.exe" /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    del "%temp%\python_setup.exe"
    
    echo [+] Refrescando variables de entorno de la sesion actual...
    set "PATH=C:\Program Files\Python310;C:\Program Files\Python310\Scripts;%PATH%"
) else (
    echo [+] Python ya esta instalado en el sistema.
)

:: 3. Instalar librerias requeridas del backend
echo [+] Instalando/Actualizando dependencias de Python (FastAPI, Uvicorn, Pydantic)...
python -m pip install --upgrade pip >nul 2>&1
python -m pip install fastapi uvicorn pydantic

:: 4. Copiar archivos del proyecto al disco C:
echo [+] Creando directorio de produccion en C:\SIC-ESE...
if not exist "C:\SIC-ESE" mkdir "C:\SIC-ESE"

echo [+] Copiando archivos de aplicacion a C:\SIC-ESE...
xcopy /E /I /Y "backend" "C:\SIC-ESE\backend" >nul
if not exist "C:\SIC-ESE\frontend\dist" mkdir "C:\SIC-ESE\frontend\dist"
xcopy /E /I /Y "frontend\dist" "C:\SIC-ESE\frontend\dist" >nul
copy /Y "Iniciar_SIC_ESE.bat" "C:\SIC-ESE\Iniciar_SIC_ESE.bat" >nul
copy /Y "Detener_SIC_ESE.bat" "C:\SIC-ESE\Detener_SIC_ESE.bat" >nul

:: 5. Crear accesos directos en el Escritorio
echo [+] Creando accesos directos con iconos en el Escritorio...
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%userprofile%\Desktop\Iniciar SIC-ESE.lnk');$s.TargetPath='C:\SIC-ESE\Iniciar_SIC_ESE.bat';$s.WorkingDirectory='C:\SIC-ESE';$s.IconLocation='C:\Windows\System32\shell32.dll,263';$s.Save()"
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%userprofile%\Desktop\Detener SIC-ESE.lnk');$s.TargetPath='C:\SIC-ESE\Detener_SIC_ESE.bat';$s.WorkingDirectory='C:\SIC-ESE';$s.IconLocation='C:\Windows\System32\shell32.dll,131';$s.Save()"

echo.
echo ==============================================================
echo   ¡INSTALACION COMPLETADA CON EXITO!
echo.
echo   Se han creado dos accesos directos en tu Escritorio:
echo   1. "Iniciar SIC-ESE" (Lanza la app silenciosamente)
echo   2. "Detener SIC-ESE" (Apaga el servicio)
echo.
echo   La aplicacion ha sido copiada correctamente a: C:\SIC-ESE
echo ==============================================================
echo.
pause
exit
