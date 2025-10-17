@echo off
REM Script para ejecutar la aplicación de pronóstico
REM Autor: Sistema de Análisis de Datos
REM Descripción: Inicia la aplicación Flask con todos los datos reales

echo.
echo ============================================================
echo   DASHBOARD DE PRONÓSTICO - DATOS REALES
echo ============================================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no está instalado o no está en PATH
    echo.
    echo Solución:
    echo 1. Descarga Python desde https://www.python.org/downloads/
    echo 2. Durante la instalación, marca "Add Python to PATH"
    echo 3. Reinicia esta ventana
    echo.
    pause
    exit /b 1
)

echo [✓] Python detectado
echo.

REM Verificar si requirements.txt existe
if not exist "requirements.txt" (
    echo [ERROR] requirements.txt no encontrado
    echo.
    echo Asegúrate de estar en la carpeta python_project
    echo.
    pause
    exit /b 1
)

echo [✓] requirements.txt encontrado
echo.

REM Instalar dependencias si es necesario
echo [*] Verificando dependencias...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo [*] Instalando dependencias (esto puede tardar 1-2 minutos)...
    echo.
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias
        pause
        exit /b 1
    )
    echo.
    echo [✓] Dependencias instaladas correctamente
    echo.
) else (
    echo [✓] Dependencias ya están instaladas
    echo.
)

REM Iniciar la aplicación
echo ============================================================
echo   INICIANDO APLICACIÓN
echo ============================================================
echo.
echo [*] Cargando datos (primera vez: 1-2 minutos)...
echo [*] Próximas ejecuciones serán instantáneas (caché)
echo.
echo [*] Abre tu navegador en: http://localhost:5000
echo.
echo [*] Presiona Ctrl+C para detener la aplicación
echo.
echo ============================================================
echo.

python app.py

pause

