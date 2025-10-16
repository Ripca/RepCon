# 🔧 DETALLES TÉCNICOS PROFUNDOS - CÓMO FUNCIONA TODO

## 1️⃣ CARGA DE DATOS - DETALLES TÉCNICOS

### CSV (Comma-Separated Values)

**Estructura:**
```
cliente_id,fecha,monto,categoria
1001,2024-01-15,150.50,ALIMENTACION
1002,2024-01-15,45.00,TRANSPORTE
```

**Carga en Python:**
```python
import pandas as pd

# Leer archivo CSV
df = pd.read_csv('data/csv/TRX_POS_AUTH_2025_v3.csv')

# Resultado: DataFrame con columnas
# cliente_id | fecha | monto | categoria
# 1001       | 2024-01-15 | 150.50 | ALIMENTACION
```

**Carga en JavaScript:**
```javascript
// Leer archivo
const file = document.getElementById('fileInput').files[0];
const text = await file.text();

// Parsear líneas
const lines = text.trim().split('\n');
const headers = lines[0].split(',');

// Crear objetos
const records = [];
for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const record = {};
    headers.forEach((h, idx) => {
        record[h.trim()] = values[idx].trim();
    });
    records.push(record);
}
```

### JSON (JavaScript Object Notation)

**Estructura:**
```json
[
  {
    "cliente_id": "1001",
    "fecha": "01/15/2024",
    "monto": 150.50,
    "categoria": "ALIMENTACION"
  },
  {
    "cliente_id": "1002",
    "fecha": "01/15/2024",
    "monto": 45.00,
    "categoria": "TRANSPORTE"
  }
]
```

**Carga en Python:**
```python
import json

# Leer archivo JSON
with open('data/json/txnstream-issuer_2025.json', 'r') as f:
    data = json.load(f)

# Convertir a DataFrame
df = pd.DataFrame(data)

# Resultado: DataFrame con mismas columnas
```

### XML (eXtensible Markup Language)

**Estructura:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <row>
    <cliente_id>1001</cliente_id>
    <fecha>2024-01-15</fecha>
    <monto>150,50</monto>
    <categoria>ALIMENTACION</categoria>
  </row>
  <row>
    <cliente_id>1002</cliente_id>
    <fecha>2024-01-15</fecha>
    <monto>45,00</monto>
    <categoria>TRANSPORTE</categoria>
  </row>
</root>
```

**Carga en Python:**
```python
import xml.etree.ElementTree as ET

# Parsear XML
tree = ET.parse('data/xml/AXIS_ISS_AUTH_2025_batchB.xml')
root = tree.getroot()

# Extraer datos
data = []
for row in root.findall('row'):
    record = {}
    for child in row:
        record[child.tag] = child.text
    data.append(record)

# Convertir a DataFrame
df = pd.DataFrame(data)
```

---

## 2️⃣ NORMALIZACIÓN - TRANSFORMACIÓN DE DATOS

### Problema 1: Fechas en Diferentes Formatos

**Entrada:**
```
CSV:  2024-01-15 (ISO 8601)
JSON: 01/15/2024 (MM/DD/YYYY)
XML:  2024-01-15 (ISO 8601)
```

**Solución Python:**
```python
# Convertir todas a datetime
df['fecha'] = pd.to_datetime(df['fecha'], errors='coerce')

# Resultado: Timestamp('2024-01-15 00:00:00')
```

**Solución JavaScript:**
```javascript
// Parsear diferentes formatos
function parseDate(dateStr) {
    // Intentar ISO 8601
    let date = new Date(dateStr);
    if (!isNaN(date)) return date;
    
    // Intentar MM/DD/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        date = new Date(parts[2], parts[0]-1, parts[1]);
        if (!isNaN(date)) return date;
    }
    
    return null;
}

record.fecha = parseDate(record.fecha);
```

### Problema 2: Montos con Comas Decimales

**Entrada:**
```
CSV:  150.50 (punto)
JSON: 150.50 (punto)
XML:  150,50 (coma)
```

**Solución Python:**
```python
# Convertir a string, reemplazar coma por punto
df['monto'] = df['monto'].astype(str).str.replace(',', '.')

# Convertir a float
df['monto'] = pd.to_numeric(df['monto'], errors='coerce')

# Resultado: 150.50 (float)
```

**Solución JavaScript:**
```javascript
// Reemplazar coma por punto
let monto = record.monto.toString().replace(',', '.');

// Convertir a float
record.monto = parseFloat(monto);

// Validar
if (!isNaN(record.monto)) {
    // Es válido
}
```

### Problema 3: Categorías en Diferentes Casos

**Entrada:**
```
"alimentacion"
"ALIMENTACION"
"Alimentacion"
"ALIMENTACIÓN"
```

**Solución Python:**
```python
# Convertir a mayúsculas
df['categoria'] = df['categoria'].str.upper()

# Resultado: "ALIMENTACION"
```

**Solución JavaScript:**
```javascript
record.categoria = record.categoria.toUpperCase();
// Resultado: "ALIMENTACION"
```

### Problema 4: Valores Nulos

**Entrada:**
```
cliente_id | fecha | monto | categoria
1001       | NULL  | 150   | ALIMENTACION  ← Eliminar
1002       | 2024  | NULL  | TRANSPORTE    ← Eliminar
1003       | 2024  | 100   | NULL          ← Eliminar
1004       | 2024  | 200   | VIAJES        ← Mantener
```

**Solución Python:**
```python
# Eliminar filas con valores nulos en columnas críticas
df = df.dropna(subset=['fecha', 'monto', 'categoria'])

# Resultado: Solo filas completas
```

**Solución JavaScript:**
```javascript
// Validar antes de agregar
if (record.fecha && record.monto && record.categoria) {
    if (!isNaN(record.monto) && record.fecha instanceof Date) {
        this.rawData.push(record);
    }
}
```

---

## 3️⃣ AGREGACIÓN SEMANAL - AGRUPAMIENTO

### Concepto

Agrupar transacciones diarias por **semana** (domingo a sábado) y **sumar montos por categoría**.

### Cálculo de Semana

**Método Python:**
```python
# Usar período semanal de Pandas
df['semana'] = df['fecha'].dt.to_period('W')

# Resultado: 2024W03 (semana 3 de 2024)
```

**Método JavaScript:**
```javascript
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

const weekStart = getWeekStart(record.fecha);
// Resultado: 2024-01-07 (domingo)
```

### Agrupamiento y Suma

**Entrada (Datos Diarios):**
```
Fecha       | Categoría      | Monto
2024-01-07  | ALIMENTACION   | 100
2024-01-08  | ALIMENTACION   | 150
2024-01-09  | ALIMENTACION   | 200
2024-01-07  | TRANSPORTE     | 50
2024-01-08  | TRANSPORTE     | 45
```

**Proceso Python:**
```python
# Agrupar por semana y categoría
weekly = df.groupby(['semana', 'categoria'])['monto'].sum()

# Resultado:
# semana    | categoria      | monto
# 2024W02   | ALIMENTACION   | 450
# 2024W02   | TRANSPORTE     | 95
```

**Proceso JavaScript:**
```javascript
const weeklyData = {};

rawData.forEach(record => {
    const weekStart = getWeekStart(record.fecha);
    const key = weekStart.toISOString().split('T')[0];
    
    if (!weeklyData[key]) {
        weeklyData[key] = {};
    }
    
    if (!weeklyData[key][record.categoria]) {
        weeklyData[key][record.categoria] = 0;
    }
    
    weeklyData[key][record.categoria] += record.monto;
});

// Resultado:
// {
//   "2024-01-07": {
//     "ALIMENTACION": 450,
//     "TRANSPORTE": 95
//   }
// }
```

---

## 4️⃣ ESTADÍSTICAS - CÁLCULOS MATEMÁTICOS

### Fórmulas

**Media (Mean):**
```
μ = (x₁ + x₂ + ... + xₙ) / n
```

**Mediana (Median):**
```
Valor central cuando n es impar
Promedio de dos valores centrales cuando n es par
```

**Desviación Estándar (Std Dev):**
```
σ = √(Σ(xᵢ - μ)² / n)
```

**Mínimo y Máximo:**
```
min = valor más pequeño
max = valor más grande
```

### Implementación Python

```python
def get_statistics(self, category):
    data = self.get_weekly_data(category)
    values = np.array(data['values'])
    
    return {
        'count': len(values),
        'mean': np.mean(values),
        'median': np.median(values),
        'std_dev': np.std(values),
        'min': np.min(values),
        'max': np.max(values),
        'total': np.sum(values),
        'variance': np.var(values)
    }
```

### Implementación JavaScript

```javascript
getStatistics(category) {
    const data = this.getWeeklyData(category);
    const values = data.values;
    
    const mean = values.reduce((a, b) => a + b) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2)) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return {
        count: values.length,
        mean: mean,
        median: median,
        std_dev: stdDev,
        min: Math.min(...values),
        max: Math.max(...values),
        total: values.reduce((a, b) => a + b)
    };
}
```

---

## 5️⃣ PRONÓSTICO - ALGORITMO CORE

### Paso 1: Regresión Lineal

**Fórmula:**
```
y = mx + b

Donde:
- y = valor predicho
- x = número de período (0, 1, 2, ...)
- m = pendiente (cambio por período)
- b = intersección (valor inicial)
```

**Cálculo de m y b:**
```
m = (n·Σ(xy) - Σx·Σy) / (n·Σ(x²) - (Σx)²)
b = (Σy - m·Σx) / n
```

**Implementación Python:**
```python
from sklearn.linear_model import LinearRegression

# Datos históricos
values = np.array([100, 110, 120, 130, 140]).reshape(-1, 1)

# Crear características (índice temporal)
X = np.arange(len(values)).reshape(-1, 1)  # [0, 1, 2, 3, 4]

# Entrenar modelo
model = LinearRegression()
model.fit(X, values)

# Obtener parámetros
m = model.coef_[0][0]  # pendiente
b = model.intercept_[0]  # intersección

# Predecir futuro
future_X = np.array([[5], [6], [7]])  # próximas 3 semanas
predictions = model.predict(future_X)
# Resultado: [150, 160, 170]
```

**Implementación JavaScript:**
```javascript
_calculateTrend(values) {
    const n = values.length;
    const x = Array.from({length: n}, (_, i) => i);
    
    const sumX = x.reduce((a, b) => a + b);
    const sumY = values.reduce((a, b) => a + b);
    const sumXY = x.reduce((a, i) => a + i * values[i], 0);
    const sumX2 = x.reduce((a, i) => a + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
}
```

### Paso 2: Análisis Estacional

**Concepto:**
```
Detectar patrones que se repiten cada N períodos
Ejemplo: Gasto en VIAJES es mayor en verano
```

**Fórmula:**
```
factor_estacional = (promedio_período - promedio_total) / promedio_total

Ejemplo:
- Promedio total: 500
- Promedio verano: 600
- Factor: (600 - 500) / 500 = 0.20 (20% más alto)
```

**Implementación Python:**
```python
def _add_seasonality(self, forecast, historical):
    if len(historical) < 4:
        return forecast
    
    # Calcular promedio móvil
    trend = np.convolve(historical.flatten(), np.ones(4)/4, mode='valid')
    
    # Calcular factor estacional
    seasonal_factor = 1.0 + (np.std(historical) / np.mean(historical)) * 0.1
    
    # Aplicar al pronóstico
    return forecast * seasonal_factor
```

**Implementación JavaScript:**
```javascript
_calculateSeasonal(values) {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const seasonal = [];
    
    // Calcular factor para cada período
    for (let i = 0; i < values.length; i++) {
        const factor = (values[i] - mean) / mean;
        seasonal.push(factor);
    }
    
    return seasonal;
}
```

### Paso 3: Intervalos de Confianza (95%)

**Concepto:**
```
Rango donde el valor real tiene 95% de probabilidad de estar

Fórmula:
Límite_superior = Pronóstico + 1.96 × σ
Límite_inferior = Pronóstico - 1.96 × σ

Donde σ = desviación estándar de residuales
```

**Implementación Python:**
```python
def _calculate_confidence(self, forecast, historical):
    # Calcular residuales
    residuals = historical - np.mean(historical)
    
    # Desviación estándar
    sigma = np.std(residuals)
    
    # Intervalos de confianza (95%)
    z_score = 1.96
    
    upper = forecast + z_score * sigma
    lower = forecast - z_score * sigma
    
    return {
        'upper': upper.flatten().tolist(),
        'lower': lower.flatten().tolist(),
        'sigma': sigma
    }
```

**Implementación JavaScript:**
```javascript
_calculateConfidence(forecast, historical) {
    const mean = historical.reduce((a, b) => a + b) / historical.length;
    const residuals = historical.map(v => v - mean);
    
    const variance = residuals.reduce((a, b) => a + b * b) / residuals.length;
    const sigma = Math.sqrt(variance);
    
    const zScore = 1.96;
    
    const upper = forecast.map(v => v + zScore * sigma);
    const lower = forecast.map(v => v - zScore * sigma);
    
    return { upper, lower, sigma };
}
```

---

## 6️⃣ VISUALIZACIÓN - GRÁFICOS

### Versión Python (Plotly)

```python
import plotly.graph_objects as go

# Crear figura
fig = go.Figure()

# Agregar serie histórica
fig.add_trace(go.Scatter(
    x=historical_dates,
    y=historical_values,
    mode='lines+markers',
    name='Histórico',
    line=dict(color='blue', width=2)
))

# Agregar pronóstico
fig.add_trace(go.Scatter(
    x=forecast_dates,
    y=forecast_values,
    mode='lines',
    name='Pronóstico',
    line=dict(color='red', width=2, dash='dash')
))

# Agregar intervalo de confianza
fig.add_trace(go.Scatter(
    x=forecast_dates + forecast_dates[::-1],
    y=upper_bound + lower_bound[::-1],
    fill='toself',
    name='Intervalo 95%',
    fillcolor='rgba(255,0,0,0.2)',
    line=dict(color='rgba(255,255,255,0)')
))

fig.update_layout(
    title='Pronóstico de ALIMENTACION',
    xaxis_title='Fecha',
    yaxis_title='Monto (Q)',
    hovermode='x unified'
)

fig.show()
```

### Versión Web (Chart.js)

```javascript
const ctx = document.getElementById('chart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [...historicalDates, ...forecastDates],
        datasets: [
            {
                label: 'Histórico',
                data: [...historicalValues, ...Array(forecastValues.length).fill(null)],
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,255,0.1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Pronóstico',
                data: [...Array(historicalValues.length).fill(null), ...forecastValues],
                borderColor: 'red',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Intervalo Superior',
                data: [...Array(historicalValues.length).fill(null), ...upperBound],
                borderColor: 'rgba(255,0,0,0.3)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Intervalo Inferior',
                data: [...Array(historicalValues.length).fill(null), ...lowerBound],
                borderColor: 'rgba(255,0,0,0.3)',
                borderWidth: 1,
                fill: '-1'
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Pronóstico de ALIMENTACION'
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Monto (Q)'
                }
            }
        }
    }
});
```

---

## 7️⃣ EXPORTACIÓN - GENERACIÓN DE CSV

### Estructura de Salida

```csv
fecha,ALIMENTACION,TRANSPORTE,ENTRETENIMIENTO,EDUCACION,CUIDADO_PERSONAL,VIAJES,COMPRAS_EN_LINEA,HOGAR,TECNOLOGIA,ABASTECIMIENTO
2024-01-07,530.00,135.00,200.00,0.00,150.00,0.00,450.00,300.00,0.00,0.00
2024-01-14,560.00,142.00,210.00,0.00,160.00,0.00,480.00,320.00,0.00,0.00
2024-01-21,575.00,148.00,220.00,0.00,170.00,0.00,500.00,330.00,0.00,0.00
```

### Implementación Python

```python
def export_forecast_csv(self, forecast_data, filename='forecast.csv'):
    # Crear DataFrame
    df = pd.DataFrame(forecast_data)
    
    # Guardar a CSV
    df.to_csv(filename, index=False, encoding='utf-8')
    
    return filename
```

### Implementación JavaScript

```javascript
exportToCSV(data, filename = 'forecast.csv') {
    // Crear encabezado
    let csv = 'fecha,' + this.categories.join(',') + '\n';
    
    // Agregar datos
    data.forEach(row => {
        csv += row.fecha + ',' + row.values.join(',') + '\n';
    });
    
    // Crear blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
```

---

## 📊 RESUMEN DE COMPLEJIDAD

| Operación | Complejidad | Tiempo (3M registros) |
|-----------|-------------|----------------------|
| Carga de datos | O(n) | ~5 segundos |
| Normalización | O(n) | ~3 segundos |
| Agregación semanal | O(n log n) | ~2 segundos |
| Estadísticas | O(n) | ~1 segundo |
| Regresión lineal | O(n) | ~0.5 segundos |
| Pronóstico | O(n) | ~0.1 segundos |
| **Total** | **O(n log n)** | **~11.6 segundos** |

---

**Proyecto Completado: ✅ TOTALMENTE FUNCIONAL**

