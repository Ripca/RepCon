# Verificar estructura del proyecto
Write-Host "Verificando estructura del proyecto..." -ForegroundColor Cyan
Write-Host ""

# Archivos principales
 = @(
    "python_project/app.py",
    "python_project/data_processor.py",
    "python_project/forecaster.py",
    "python_project/requirements.txt",
    "python_project/templates/index.html",
    "python_project/README.md",
    "python_project/run.bat",
    "python_project/run.ps1"
)

 = True
foreach ( in ) {
    if (Test-Path ) {
        Write-Host "[✓] " -ForegroundColor Green
    } else {
        Write-Host "[✗] " -ForegroundColor Red
         = False
    }
}

Write-Host ""
if () {
    Write-Host "✅ Todos los archivos están en su lugar" -ForegroundColor Green
} else {
    Write-Host "❌ Faltan algunos archivos" -ForegroundColor Red
}

Write-Host ""
Write-Host "Archivos de instrucciones:" -ForegroundColor Cyan
 = @(
    "INSTRUCCIONES_EJECUCION.md",
    "RESUMEN_PROYECTO.txt",
    "COMANDOS_COPIAR_PEGAR.txt"
)

foreach ( in ) {
    if (Test-Path ) {
        Write-Host "[✓] " -ForegroundColor Green
    } else {
        Write-Host "[✗] " -ForegroundColor Red
    }
}
