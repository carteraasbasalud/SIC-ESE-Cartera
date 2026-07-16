@echo off
title Deteniendo Sistema Inteligente de Cartera E.S.E.
echo ==============================================================
echo   DETENIENDO SERVICIOS DE CARTERA - ASBASALUD E.S.E.
echo ==============================================================
echo.

echo [+] Buscando procesos en el puerto 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [+] Deteniendo proceso con PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

:: Detener de forma complementaria cualquier proceso de pythonw que haya quedado huerfano
echo [+] Deteniendo procesos adicionales de Pythonw...
taskkill /F /IM pythonw.exe >nul 2>&1

echo.
echo ==============================================================
echo   ¡SERVICIOS DETENIDOS CORRECTAMENTE!
echo ==============================================================
timeout /t 3 >nul
exit
