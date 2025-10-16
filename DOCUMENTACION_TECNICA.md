# 🔧 Documentación Técnica

## Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    Interfaz de Usuario                   │
│              (HTML/CSS/JavaScript o Flask)               │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼──────────┐
│  Data Processor  │    │   Forecaster      │
│  - CSV/JSON/XML  │    │  - Regresión      │
│  - Normalización │    │  - Estacionalidad │
│  - Agregación    │    │  - Confianza      │
└──────────────────┘    └───────────────────┘
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │   Datos Procesados      │
        │  - Series Temporales    │
        │  - Pronósticos          │
        │  - Estadísticas         │
        └─────────────────────────┘
```

## Módulos Python

### app.py
**Responsabilidad:** Servidor Flask y API REST

**Endpoints:**
```
GET  /                          → Página principal
GET  /api/data/summary          → Resumen de datos
GET  /api/data/categories       → Lista de categorías
GET  /api/data/weekly/<cat>     → Datos semanales
GET  /api/data/all-weekly       → Todos los datos
POST /api/forecast              → Generar pronóstico
POST /api/forecast/all          → Todos los pronósticos
GET  /api/statistics/<cat>      → Estadísticas
GET  /api/chart/timeseries/<cat>→ Gráfico serie temporal
GET  /api/chart/comparison      → Gráfico comparativo
```

### data_processor.py
**Responsabilidad:** Carga y procesamiento de datos

**Métodos principales:**
```python
loadFromCSV(filepath)           # Carga CSV
loadFromJSON(filepath)          # Carga JSON
loadFromXML(filepath)           # Carga XML
_normalize_data()               # Normaliza datos
_aggregate_weekly()             # Agrega semanalmente
get_summary()                   # Resumen
get_categories()                # Categorías
get_weekly_data(category)       # Datos semanales
get_all_weekly_data()           # Todos los datos
get_statistics(category)        # Estadísticas
```

### forecaster.py
**Responsabilidad:** Generación de pronósticos

**Métodos principales:**
```python
forecast(category, weeks)       # Pronóstico individual
forecast_all(weeks)             # Todos los pronósticos
_calculate_trend(values)        # Regresión lineal
_calculate_seasonal(values)     # Análisis estacional
_calculate_confidence(...)      # Intervalos de confianza
export_forecast_csv(...)        # Exporta a CSV
```

## Módulos JavaScript

### data-processor.js
**Responsabilidad:** Procesamiento de datos en navegador

**Métodos principales:**
```javascript
loadFromCSV(csvContent)         // Carga CSV
_normalize_data()               // Normaliza datos
_aggregate_weekly()             // Agrega semanalmente
getSummary()                    // Resumen
getCategories()                 // Categorías
getWeeklyData(category)         // Datos semanales
getAllWeeklyData()              // Todos los datos
getStatistics(category)         // Estadísticas
```

### forecaster.js
**Responsabilidad:** Pronósticos en navegador

**Métodos principales:**
```javascript
forecast(category, weeks)       // Pronóstico individual
forecastAll(weeks)              // Todos los pronósticos
_calculateTrend(values)         // Regresión lineal
_calculateSeasonal(values)      // Análisis estacional
_calculateConfidence(...)       // Intervalos de confianza
exportToCSV()                   // Exporta a CSV
downloadCSV()                   // Descarga CSV
```

### app.js
**Responsabilidad:** Lógica principal y UI

**Funciones principales:**
```javascript
loadSampleData()                // Carga datos ejemplo
handleFileUpload(event)         // Carga archivo
updateUI()                      // Actualiza interfaz
updateStats()                   // Actualiza estadísticas
updateCategoryList()            // Actualiza lista
updateTimeseriesChart()         // Gráfico serie temporal
updateComparisonChart()         // Gráfico comparativo
generateAllForecasts()          // Genera pronósticos
updateForecastChart(category)   // Gráfico pronóstico
updateDataTable()               // Actualiza tabla
exportResults()                 // Exporta resultados
```

## Algoritmo de Pronóstico

### Paso 1: Cálculo de Tendencia
```
Regresión Lineal: y = mx + b
m = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)
b = ȳ - m*x̄
```

### Paso 2: Cálculo de Estacionalidad
```
Para cada período p:
  promedio_p = Σ(valores en período p) / cantidad
  factor_p = (promedio_p - media_total) / media_total
```

### Paso 3: Pronóstico
```
pronóstico = tendencia × (1 + factor_estacional)
```

### Paso 4: Intervalos de Confianza
```
residuales = valores_reales - valores_ajustados
σ = √(Σ(residuales²) / n)
superior = pronóstico + 1.96 × σ
inferior = max(0, pronóstico - 1.96 × σ)
```

## Formato de Datos

### Entrada CSV
```csv
cliente_id,fecha,monto,categoria
C122794,2024-01-01,6373.4,ALIMENTACION
```

**Validaciones:**
- cliente_id: String (requerido)
- fecha: ISO 8601 o DD/MM/YYYY (requerido)
- monto: Float positivo (requerido)
- categoria: String (requerido)

### Salida Pronóstico
```csv
fecha,ALIMENTACION,TRANSPORTE,...
2025-02-02,15000.50,8500.25,...
```

## Estructura de Datos

### Objeto Pronóstico
```javascript
{
  category: "ALIMENTACION",
  historicalDates: ["2024-01-01", ...],
  historicalValues: [5000, ...],
  forecastDates: ["2025-02-02", ...],
  forecastValues: [15000.50, ...],
  confidence: {
    upper: [16000, ...],
    lower: [14000, ...]
  }
}
```

### Objeto Resumen
```javascript
{
  totalTransactions: 1000,
  totalAmount: 5000000,
  categoriesCount: 10,
  dateRange: {
    start: "2024-01-01",
    end: "2024-12-31"
  }
}
```

## Rendimiento

### Complejidad Temporal
- Carga de datos: O(n)
- Agregación semanal: O(n log n)
- Pronóstico: O(n)
- Exportación: O(n)

### Complejidad Espacial
- Datos en memoria: O(n)
- Pronósticos: O(m) donde m = semanas

### Optimizaciones
- Pandas para procesamiento eficiente
- Caching de datos procesados
- Gráficos limitados a últimas 100 semanas
- Lazy loading de datos

## Seguridad

### Validaciones
- Validación de tipos de datos
- Rango de fechas válidas
- Montos positivos
- Categorías conocidas

### Protecciones
- CORS habilitado (Python)
- Sin acceso a archivos del sistema
- Datos en memoria (no persistencia)
- Sanitización de entrada

## Testing

### Casos de Prueba
```python
# Python
test_load_csv()
test_load_json()
test_load_xml()
test_normalize_data()
test_aggregate_weekly()
test_forecast()
test_export_csv()
```

```javascript
// JavaScript
test_loadFromCSV()
test_normalize_data()
test_aggregate_weekly()
test_forecast()
test_exportToCSV()
```

## Deployment

### Python
```bash
# Producción
gunicorn app:app --workers 4 --bind 0.0.0.0:5000

# Docker
docker build -t forecasting .
docker run -p 5000:5000 forecasting
```

### Web
```bash
# Servidor estático
nginx -c /path/to/nginx.conf

# O cualquier servidor web
python -m http.server 8000
```

## Monitoreo

### Métricas
- Tiempo de carga de datos
- Tiempo de pronóstico
- Uso de memoria
- Errores de validación

### Logs
```
[2025-01-16 10:30:45] INFO: Datos cargados (1000 registros)
[2025-01-16 10:30:46] INFO: Pronóstico generado (14 semanas)
[2025-01-16 10:30:47] ERROR: Categoría no encontrada
```

## Extensiones Futuras

1. **Modelos Avanzados**
   - ARIMA
   - Prophet
   - LSTM

2. **Características**
   - Múltiples usuarios
   - Persistencia de datos
   - Alertas automáticas
   - Integración con APIs

3. **Optimizaciones**
   - Caché distribuido
   - Procesamiento paralelo
   - Compresión de datos

---

**Versión:** 1.0.0  
**Última actualización:** 2025-01-16

