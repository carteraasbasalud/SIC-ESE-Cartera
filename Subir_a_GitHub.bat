@echo off
title Preparar y Subir Proyecto a GitHub - SIC-ESE
echo ==============================================================
echo   SUBIR PROYECTO A GITHUB - SISTEMA DE CARTERA SIC-ESE
echo ==============================================================
echo.

:: 1. Verificar si Git esta instalado
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git no esta instalado o no se encuentra en el PATH.
    echo Por favor, instale Git o suba los archivos manualmente a GitHub.
    pause
    exit /b 1
)

:: 2. Inicializar repositorio Git si no existe
if not exist ".git" (
    echo [+] Inicializando repositorio Git local...
    git init
    git branch -M main
) else (
    echo [+] Repositorio Git ya inicializado.
)

:: 3. Configurar el origen remoto (GitHub)
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Ingrese la URL de su repositorio de GitHub vacio.
    echo (Ejemplo: https://github.com/tu-usuario/nombre-repositorio.git)
    echo.
    set /p REPO_URL="URL del Repositorio: "
    
    if "%REPO_URL%"=="" (
        echo [ERROR] URL no valida. Operacion cancelada.
        pause
        exit /b 1
    )
    
    git remote add origin %REPO_URL%
) else (
    echo [+] Repositorio remoto (origin) ya configurado.
)

:: 4. Agregar archivos y hacer commit
echo.
echo [+] Agregando archivos al indice (excluyendo carpetas pesadas)...
git add .

echo [+] Creando confirmacion (commit)...
git commit -m "Despliegue de produccion SIC-ESE"

:: 5. Subir a GitHub
echo.
echo [+] Subiendo archivos a GitHub (puede solicitar autenticacion en el navegador)...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al subir a GitHub. 
    echo Verifique sus permisos de acceso o intente de nuevo.
) else (
    echo.
    echo ==============================================================
    echo   ¡PROYECTO SUBIDO A GITHUB CON EXITO!
    echo.
    echo   Siguiente paso:
    echo   1. Inicie sesion en Render.com usando su GitHub.
    echo   2. Cree un "Web Service" y conecte este repositorio.
    echo ==============================================================
)
echo.
pause
exit
