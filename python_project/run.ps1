# Script PowerShell para ejecutar la aplicación de pronóstico
# Autor: Sistema de Análisis de Datos
# Descripción: Inicia la aplicación Flask con todos los datos reales

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  DASHBOARD DE PRONÓSTICO - DATOS REALES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[✓] Python detectado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python no está instalado o no está en PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solución:" -ForegroundColor Yellow
    Write-Host "1. Descarga Python desde https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "2. Durante la instalación, marca 'Add Python to PATH'" -ForegroundColor Yellow
    Write-Host "3. Reinicia PowerShell" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# Verificar si requirements.txt existe
if (-not (Test-Path "requirements.txt")) {
    Write-Host "[ERROR] requirements.txt no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Asegúrate de estar en la carpeta python_project" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[✓] requirements.txt encontrado" -ForegroundColor Green
Write-Host ""

# Instalar dependencias si es necesario
Write-Host "[*] Verificando dependencias..." -ForegroundColor Yellow
$flaskInstalled = pip show flask 2>&1 | Select-String "Name: Flask"

if (-not $flaskInstalled) {
    Write-Host "[*] Instalando dependencias (esto puede tardar 1-2 minutos)..." -ForegroundColor Yellow
    Write-Host ""
    pip install -r requirements.txt
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Error al instalar dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
    
    Write-Host ""
    Write-Host "[✓] Dependencias instaladas correctamente" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[✓] Dependencias ya están instaladas" -ForegroundColor Green
    Write-Host ""
}

# Iniciar la aplicación
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  INICIANDO APLICACIÓN" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[*] Cargando datos (primera vez: 1-2 minutos)..." -ForegroundColor Yellow
Write-Host "[*] Próximas ejecuciones serán instantáneas (caché)" -ForegroundColor Yellow
Write-Host ""
Write-Host "[*] Abre tu navegador en: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "[*] Presiona Ctrl+C para detener la aplicación" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

python app.py

Read-Host "Presiona Enter para salir"

