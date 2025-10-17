# 🚀 Dashboard de Pronóstico - Datos Reales

## 📊 Descripción

Aplicación Python completa que procesa **TODOS los datos reales** (~11.5 millones de registros) de múltiples formatos (CSV, JSON, XML) y genera pronósticos precisos usando algoritmos ARIMA y Regresión Lineal.

### ✨ Características

- ✅ **Procesa 11.5M+ registros** de datos reales
- ✅ **Múltiples formatos**: CSV, JSON, XML
- ✅ **Algoritmos avanzados**: ARIMA + Regresión Lineal
- ✅ **Caché automático**: Primera carga ~1-2 min, posteriores instantáneas
- ✅ **Dashboard interactivo**: Interfaz web moderna y responsiva
- ✅ **Análisis profundo**: Estadísticas, tendencias, pronósticos
- ✅ **Exportación**: Datos en múltiples formatos

---

## 🛠️ Instalación

### Paso 1: Instalar Python (si no lo tienes)
```bash
# Descargar desde https://www.python.org/downloads/
# Asegúrate de marcar "Add Python to PATH"
```

### Paso 2: Instalar dependencias
```bash
cd python_project
pip install -r requirements.txt
```

---

## ▶️ Ejecución

### Opción 1: Ejecución Simple (Recomendado)
```bash
cd python_project
python app.py
```

Luego abre en tu navegador:
```
http://localhost:5000
```

### Opción 2: Con Modo Debug
```bash
cd python_project
python app.py --debug
```

---

## 📋 Primera Ejecución

**⏱️ Tiempo estimado: 1-2 minutos**

La primera vez que ejecutes la aplicación:
1. Cargará TODOS los archivos (CSV, JSON, XML)
2. Normalizará y procesará ~11.5M registros
3. Agregará datos por semana
4. Guardará en caché para futuras ejecuciones

**Verás en consola:**
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
    - txnstream-issuer_2022.json
    - txnstream-issuer_2023.json
    - txnstream-issuer_2024.json
    - txnstream-issuer_2025.json
  🔗 Cargando XML...
    - AXIS_ISS_AUTH_2022_batchB.xml
    - AXIS_ISS_AUTH_2023_batchC.xml
    - AXIS_ISS_AUTH_2024_batchA.xml
    - AXIS_ISS_AUTH_2025_batchB.xml
  ✓ Combinando 12 archivos...
  ✓ Total de registros: 11,500,000
  🔄 Normalizando datos...
  ✓ Registros válidos: 11,450,000 (removidos: 50,000)
  ✓ Categorías encontradas: 8
  📊 Agregando datos por semana...
  ✓ Semanas procesadas: 208
  💾 Datos guardados en caché

🤖 Inicializando Forecaster...
✓ Forecaster listo

 * Running on http://127.0.0.1:5000
```

---

## 🌐 Interfaz Web

### Dashboard
- **Estadísticas**: Total de transacciones, monto, categorías
- **Gráficos**: Tendencias generales y distribución

### Análisis
- Selecciona una categoría
- Ve serie temporal y estadísticas detalladas
- Media, desviación estándar, mín/máx

### Pronósticos
- Selecciona categoría y horizonte (1-52 semanas)
- Visualiza pronóstico ARIMA con intervalo de confianza
- Compara histórico vs predicción

### Datos
- Tabla completa de datos agregados por semana
- Todos los formatos procesados juntos

---

## 📁 Estructura de Archivos

```
python_project/
├── app.py                 # Aplicación Flask principal
├── data_processor.py      # Procesamiento de datos
├── forecaster.py          # Algoritmos de pronóstico
├── requirements.txt       # Dependencias
├── templates/
│   └── index.html        # Interfaz web
└── README.md             # Este archivo
```

---

## 🔧 Configuración

### Puerto
Por defecto: `5000`

Para cambiar, edita `app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=8000)  # Cambiar 5000 a 8000
```

### Debug
Para desactivar modo debug:
```python
if __name__ == '__main__':
    app.run(debug=False, port=5000)
```

---

## 📊 Datos Procesados

### Archivos Cargados
- **CSV**: 4 archivos (2022-2025) - ~190 MB
- **JSON**: 4 archivos (2022-2025)
- **XML**: 4 archivos (2022-2025)

### Total
- **Registros**: ~11.5 millones
- **Categorías**: 8
- **Período**: 2022-2025 (208 semanas)

---

## 🚨 Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### Error: "Port 5000 already in use"
```bash
# Cambiar puerto en app.py o usar:
python app.py --port 8000
```

### Aplicación lenta en primera ejecución
- Normal: Primera carga procesa 11.5M registros
- Próximas ejecuciones serán instantáneas (caché)

### Limpiar caché
```bash
# Eliminar archivo de caché
rm data/.cache_data.pkl
```

---

## 📈 Algoritmos Utilizados

### ARIMA (AutoRegressive Integrated Moving Average)
- Análisis de series temporales
- Búsqueda automática de parámetros óptimos
- Intervalos de confianza al 95%

### Regresión Lineal (Fallback)
- Se usa si ARIMA falla
- Modelo simple y rápido
- Útil para tendencias lineales

---

## 💡 Tips

1. **Primera ejecución**: Espera 1-2 minutos mientras se procesan los datos
2. **Caché**: Los datos se guardan automáticamente para futuras ejecuciones
3. **Pronósticos**: Ajusta el horizonte (semanas) según necesites
4. **Exportación**: Los datos se pueden descargar desde la interfaz

---

## 📞 Soporte

Para problemas o preguntas, revisa:
- Consola de Python (mensajes de error)
- Consola del navegador (F12 → Console)
- Logs de Flask

---

## 📝 Licencia

Proyecto de análisis de datos - Centro de Excelencia de Capacidades Analíticas

