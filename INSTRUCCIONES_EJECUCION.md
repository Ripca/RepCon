# 🚀 INSTRUCCIONES DE EJECUCIÓN - PROYECTO PYTHON

## ⚡ INICIO RÁPIDO (3 pasos)

### Paso 1: Abre PowerShell o CMD
```
Presiona: Windows + R
Escribe: powershell
Presiona: Enter
```

### Paso 2: Navega a la carpeta del proyecto
```powershell
cd "C:\Users\aricardo\Desktop\Proc10\hackathon-bam-debug-my-destiny-main\hackathon-bam-debug-my-destiny-main\python_project"
```

### Paso 3: Ejecuta el programa
```powershell
python app.py
```

---

## 📋 COMANDOS COMPLETOS

### Opción A: Ejecución Simple (Recomendado)
```powershell
cd python_project
pip install -r requirements.txt
python app.py
```

### Opción B: Usando Script Batch (Windows)
```cmd
cd python_project
run.bat
```

### Opción C: Usando Script PowerShell
```powershell
cd python_project
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\run.ps1
```

---

## 🌐 ACCEDER A LA APLICACIÓN

Una vez que veas en la consola:
```
 * Running on http://127.0.0.1:5000
```

Abre tu navegador y ve a:
```
http://localhost:5000
```

---

## ⏱️ TIEMPOS DE EJECUCIÓN

### Primera Ejecución
- **Tiempo**: 1-2 minutos
- **Qué hace**: Carga 11.5M registros, normaliza, agrega por semana
- **Resultado**: Se guarda en caché

### Ejecuciones Posteriores
- **Tiempo**: 5-10 segundos
- **Qué hace**: Carga desde caché
- **Resultado**: Instantáneo

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "Python no está instalado"
```
Solución:
1. Descarga Python desde https://www.python.org/downloads/
2. Durante instalación, marca "Add Python to PATH"
3. Reinicia PowerShell/CMD
4. Intenta de nuevo
```

### Error: "ModuleNotFoundError: No module named 'flask'"
```powershell
pip install -r requirements.txt
```

### Error: "Port 5000 already in use"
```
Solución 1: Cierra otras aplicaciones que usen puerto 5000
Solución 2: Edita app.py y cambia:
    app.run(debug=True, port=8000)  # Cambiar 5000 a 8000
```

### Limpiar caché (si hay problemas)
```powershell
cd data
Remove-Item .cache_data.pkl -Force
cd ..
python app.py
```

---

## 📊 INTERFAZ WEB

Una vez abierta, verás 4 secciones:

### 1. Dashboard
- Estadísticas generales
- Gráficos de tendencias
- Resumen de datos

### 2. Análisis
- Selecciona una categoría
- Ve serie temporal
- Estadísticas detalladas

### 3. Pronósticos
- Selecciona categoría
- Elige horizonte (1-52 semanas)
- Visualiza predicción ARIMA

### 4. Datos
- Tabla completa
- Todos los datos agregados por semana
- Exportable

---

## 📁 ESTRUCTURA DEL PROYECTO

```
python_project/
├── app.py                 ← Aplicación principal
├── data_processor.py      ← Procesa datos
├── forecaster.py          ← Algoritmos ARIMA
├── requirements.txt       ← Dependencias
├── run.bat               ← Script Windows
├── run.ps1               ← Script PowerShell
├── templates/
│   └── index.html        ← Interfaz web
└── README.md             ← Documentación completa
```

---

## 💡 TIPS IMPORTANTES

1. **Primera ejecución es lenta**: Normal, procesa 11.5M registros
2. **Próximas ejecuciones son rápidas**: Usa caché automático
3. **Datos reales**: Carga CSV, JSON y XML juntos
4. **Pronósticos precisos**: Usa ARIMA con búsqueda automática de parámetros
5. **Interfaz responsiva**: Funciona en desktop y móvil

---

## 🎯 VERIFICACIÓN

Cuando ejecutes `python app.py`, deberías ver:

```
============================================================
🚀 INICIANDO APLICACIÓN DE PRONÓSTICO
============================================================

📂 Cargando datos de archivos (primera vez, puede tardar ~1-2 minutos)...
  📄 Cargando CSV...
    - TRX_POS_AUTH_2022_v2.csv
    - TRX_POS_AUTH_2023_v1.csv
    - TRX_POS_AUTH_2024_v2.csv
    - TRX_POS_AUTH_2025_v3.csv
  📋 Cargando JSON...
  🔗 Cargando XML...
  ✓ Combinando 12 archivos...
  ✓ Total de registros: 11,500,000
  🔄 Normalizando datos...
  ✓ Registros válidos: 11,450,000
  ✓ Categorías encontradas: 8
  📊 Agregando datos por semana...
  ✓ Semanas procesadas: 208
  💾 Datos guardados en caché

🤖 Inicializando Forecaster...
✓ Forecaster listo

 * Running on http://127.0.0.1:5000
```

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la consola de Python (mensajes de error)
2. Abre F12 en el navegador → Console (errores JavaScript)
3. Verifica que Python 3.8+ esté instalado
4. Verifica que tengas conexión a internet (primera instalación)

---

## ✅ CHECKLIST ANTES DE EJECUTAR

- [ ] Python 3.8+ instalado
- [ ] Estás en la carpeta `python_project`
- [ ] Archivo `requirements.txt` existe
- [ ] Carpeta `data` existe con archivos CSV/JSON/XML
- [ ] Puerto 5000 disponible

---

**¡Listo! Ahora ejecuta los comandos y disfruta del dashboard.**

