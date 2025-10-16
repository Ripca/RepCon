# 📊 GUÍA TÉCNICA: CÓMO FUNCIONA LA APLICACIÓN DE PRONÓSTICO

## 📋 TABLA DE CONTENIDOS
1. [Visión General](#visión-general)
2. [Flujo de Datos](#flujo-de-datos)
3. [Procesamiento de Datos](#procesamiento-de-datos)
4. [Algoritmos de Pronóstico](#algoritmos-de-pronóstico)
5. [Fórmulas Matemáticas](#fórmulas-matemáticas)
6. [Recursos y Librerías](#recursos-y-librerías)
7. [Ejemplo Práctico](#ejemplo-práctico)

---

## 🎯 VISIÓN GENERAL

La aplicación es un **sistema de pronóstico de series temporales** que predice el consumo futuro en diferentes categorías de gastos. Utiliza datos históricos de transacciones para:

1. **Identificar tendencias** (¿está aumentando o disminuyendo el gasto?)
2. **Detectar patrones estacionales** (¿hay períodos con más gasto?)
3. **Generar predicciones** (¿cuánto se gastará en las próximas semanas?)
4. **Calcular intervalos de confianza** (¿qué tan segura es la predicción?)

---

## 📊 FLUJO DE DATOS

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. ENTRADA DE DATOS                                             │
│    • CSV con transacciones (cliente_id, fecha, monto, categoría)│
│    • Datos históricos de 3 años (1095 días)                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. PROCESAMIENTO                                                │
│    • Validación de datos                                        │
│    • Normalización de categorías                                │
│    • Agrupación semanal                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. ANÁLISIS                                                     │
│    • Cálculo de tendencia (regresión lineal)                   │
│    • Detección de estacionalidad                                │
│    • Cálculo de residuales                                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. PRONÓSTICO                                                   │
│    • Generación de predicciones (14 semanas por defecto)       │
│    • Cálculo de intervalos de confianza (95%)                  │
│    • Combinación de tendencia + estacionalidad                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. VISUALIZACIÓN                                                │
│    • Gráficos de series temporales                              │
│    • Gráficos de pronóstico con intervalos                      │
│    • Comparación de categorías                                  │
│    • Tabla de datos detallada                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 PROCESAMIENTO DE DATOS

### Paso 1: Carga de Datos (Múltiples Formatos)

La aplicación soporta **3 formatos de datos**:

#### 1️⃣ CSV (Comma-Separated Values)

**Formato esperado:**
```
cliente_id,fecha,monto,categoria
C000001,2022-01-05,1500.00,ALIMENTACION
C000002,2022-01-06,250.50,TRANSPORTE
C000003,2022-01-07,5000.00,EDUCACION
```

**Carga en Python:**
```python
import pandas as pd
df = pd.read_csv('data/csv/transacciones.csv')
```

**Carga en JavaScript:**
```javascript
const csvContent = fileInput.files[0];
const text = await csvContent.text();
dataProcessor.loadFromCSV(text);
```

#### 2️⃣ JSON (JavaScript Object Notation)

**Formato esperado:**
```json
[
  {
    "cliente_id": "C000001",
    "fecha": "2022-01-05",
    "monto": 1500.00,
    "categoria": "ALIMENTACION"
  },
  {
    "cliente_id": "C000002",
    "fecha": "2022-01-06",
    "monto": 250.50,
    "categoria": "TRANSPORTE"
  }
]
```

**Carga en Python:**
```python
import json
import pandas as pd

with open('data/json/transacciones.json', 'r') as f:
    data = json.load(f)
    df = pd.DataFrame(data)
```

#### 3️⃣ XML (eXtensible Markup Language)

**Formato esperado:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <row>
    <cliente_id>C000001</cliente_id>
    <fecha>2022-01-05</fecha>
    <monto>1500.00</monto>
    <categoria>ALIMENTACION</categoria>
  </row>
  <row>
    <cliente_id>C000002</cliente_id>
    <fecha>2022-01-06</fecha>
    <monto>250.50</monto>
    <categoria>TRANSPORTE</categoria>
  </row>
</root>
```

**Carga en Python:**
```python
import xml.etree.ElementTree as ET
import pandas as pd

tree = ET.parse('data/xml/transacciones.xml')
root = tree.getroot()

data = []
for row in root.findall('row'):
    record = {}
    for child in row:
        record[child.tag] = child.text
    data.append(record)

df = pd.DataFrame(data)
```

### Paso 1b: Combinación de Múltiples Formatos

**En Python (data_processor.py):**
```python
def _load_all_data(self):
    """Carga datos de todos los formatos disponibles"""
    dfs = []

    # Cargar CSV
    csv_path = os.path.join(self.data_path, 'csv')
    if os.path.exists(csv_path):
        for file in os.listdir(csv_path):
            if file.endswith('.csv'):
                df = pd.read_csv(os.path.join(csv_path, file))
                dfs.append(df)

    # Cargar JSON
    json_path = os.path.join(self.data_path, 'json')
    if os.path.exists(json_path):
        for file in os.listdir(json_path):
            if file.endswith('.json'):
                with open(os.path.join(json_path, file), 'r') as f:
                    data = json.load(f)
                    df = pd.DataFrame(data)
                    dfs.append(df)

    # Cargar XML
    xml_path = os.path.join(self.data_path, 'xml')
    if os.path.exists(xml_path):
        for file in os.listdir(xml_path):
            if file.endswith('.xml'):
                df = self._load_xml(os.path.join(xml_path, file))
                if df is not None:
                    dfs.append(df)

    # Combinar todos los datos
    if dfs:
        self.df = pd.concat(dfs, ignore_index=True)
        self._normalize_data()
        self._aggregate_weekly()
```

**Ventaja:** La aplicación puede procesar múltiples archivos de diferentes formatos simultáneamente.

### Validaciones:**
- ✅ Fecha válida (formato YYYY-MM-DD)
- ✅ Monto numérico positivo
- ✅ Categoría no vacía
- ✅ Eliminación de filas con valores nulos

### Paso 2: Normalización

**En Python (data_processor.py):**
```python
def _normalize_data(self):
    """Normaliza los datos cargados"""
    # Convertir fecha a datetime
    self.df['fecha'] = pd.to_datetime(self.df['fecha'])

    # Convertir monto a float
    self.df['monto'] = self.df['monto'].astype(float)

    # Convertir categoría a mayúsculas
    self.df['categoria'] = self.df['categoria'].str.upper()

    # Eliminar filas con valores nulos
    self.df = self.df.dropna(subset=['fecha', 'monto', 'categoria'])

    # Obtener categorías únicas
    self.categories = sorted(self.df['categoria'].unique().tolist())
```

**En JavaScript (data-processor.js):**
```javascript
// Convertir a mayúsculas
categoria = "alimentacion" → "ALIMENTACION"

// Convertir fecha a objeto Date
fecha = "2022-01-05" → Date(2022, 0, 5)

// Convertir monto a número
monto = "1500.00" → 1500.00
```

**Transformaciones realizadas:**
- ✅ Categorías a MAYÚSCULAS
- ✅ Fechas a formato estándar (YYYY-MM-DD)
- ✅ Montos a números decimales
- ✅ Eliminación de registros incompletos

### Paso 3: Agrupación Semanal

Los datos se agrupan por **semana** (domingo a sábado):

**En Python (data_processor.py):**
```python
def _aggregate_weekly(self):
    """Agrega datos a nivel semanal"""
    # Agrupar por semana
    self.df['semana'] = self.df['fecha'].dt.to_period('W')

    # Sumar montos por semana y categoría
    self.weekly_data = self.df.groupby(['semana', 'categoria'])['monto'].sum().reset_index()

    # Convertir período a fecha
    self.weekly_data['fecha'] = self.weekly_data['semana'].dt.start_time

    # Ordenar por fecha
    self.weekly_data = self.weekly_data.sort_values('fecha')
```

**En JavaScript (data-processor.js):**
```javascript
_processData() {
    // Obtener categorías únicas
    this.categories = [...new Set(this.rawData.map(r => r.categoria))].sort();

    // Agregar por semana
    this.weeklyData = {};

    this.categories.forEach(category => {
        this.weeklyData[category] = {};

        this.rawData
            .filter(r => r.categoria === category)
            .forEach(record => {
                const weekStart = this._getWeekStart(record.fecha);
                const weekKey = weekStart.toISOString().split('T')[0];

                if (!this.weeklyData[category][weekKey]) {
                    this.weeklyData[category][weekKey] = 0;
                }

                this.weeklyData[category][weekKey] += record.monto;
            });
    });
}
```

**Ejemplo de agrupación:**
```
Datos diarios:
  2022-01-05 (Miércoles): ALIMENTACION 1500
  2022-01-06 (Jueves):    ALIMENTACION 2000
  2022-01-07 (Viernes):   ALIMENTACION 1800
  2022-01-08 (Sábado):    TRANSPORTE 250

Agrupados por semana (Semana 1: 01-02 a 01-08):
  ALIMENTACION: 1500 + 2000 + 1800 = 5300
  TRANSPORTE:   250

Semana 2 (01-09 a 01-15):
  ALIMENTACION: 1600 + 2100 + 1900 = 5600
  TRANSPORTE:   280 + 320 + 220 = 820
```

**¿Por qué semanal?**
- ✅ Reduce ruido en los datos (variaciones diarias)
- ✅ Detecta mejor los patrones (tendencias semanales)
- ✅ Mejora la precisión del pronóstico
- ✅ Reduce el volumen de datos (más manejable)
- ✅ Alinea con ciclos de negocio (semanas laborales)

---

## 🔮 ALGORITMOS DE PRONÓSTICO

### Algoritmo Principal: Regresión Lineal + Estacionalidad

La aplicación utiliza un modelo **híbrido** que combina:

1. **Regresión Lineal** → Captura la tendencia general
2. **Análisis Estacional** → Captura patrones repetitivos
3. **Intervalos de Confianza** → Mide la incertidumbre

---

## 📐 FÓRMULAS MATEMÁTICAS

### 1. REGRESIÓN LINEAL (Tendencia)

**Objetivo:** Encontrar la línea que mejor se ajusta a los datos históricos.

**Fórmula:**
```
y = mx + b

Donde:
  y = monto predicho
  x = número de semana (0, 1, 2, 3, ...)
  m = pendiente (cambio por semana)
  b = intersección (valor inicial)
```

**Cálculo de m (pendiente):**
```
m = Σ[(xi - x̄)(yi - ȳ)] / Σ[(xi - x̄)²]

Donde:
  xi = número de semana i
  yi = monto en semana i
  x̄ = promedio de semanas
  ȳ = promedio de montos
```

**Cálculo de b (intersección):**
```
b = ȳ - m × x̄
```

**Ejemplo:**
```
Datos históricos:
Semana 1: 5000
Semana 2: 5200
Semana 3: 5400
Semana 4: 5600

Cálculos:
x̄ = (0 + 1 + 2 + 3) / 4 = 1.5
ȳ = (5000 + 5200 + 5400 + 5600) / 4 = 5300

m = [(0-1.5)(5000-5300) + (1-1.5)(5200-5300) + (2-1.5)(5400-5300) + (3-1.5)(5600-5300)] / [(0-1.5)² + (1-1.5)² + (2-1.5)² + (3-1.5)²]
m = [(-1.5)(-300) + (-0.5)(-100) + (0.5)(100) + (1.5)(300)] / [2.25 + 0.25 + 0.25 + 2.25]
m = [450 + 50 + 50 + 450] / 5
m = 1000 / 5 = 200

b = 5300 - 200 × 1.5 = 5300 - 300 = 5000

Ecuación: y = 200x + 5000

Predicción Semana 5: y = 200(4) + 5000 = 5800
```

### 2. ANÁLISIS ESTACIONAL

**Objetivo:** Detectar patrones que se repiten cada cierto período.

**Fórmula:**
```
factor_estacional[i] = (valor[i] - tendencia[i]) / tendencia[i]

Donde:
  valor[i] = monto real en período i
  tendencia[i] = valor predicho por regresión lineal
```

**Aplicación al pronóstico:**
```
pronóstico_final = tendencia × (1 + factor_estacional)
```

**Ejemplo:**
```
Semana 1:
  Valor real: 5000
  Tendencia: 5000
  Factor: (5000 - 5000) / 5000 = 0

Semana 2:
  Valor real: 5200
  Tendencia: 5200
  Factor: (5200 - 5200) / 5200 = 0

Semana 3 (Navidad - gasto mayor):
  Valor real: 8000
  Tendencia: 5400
  Factor: (8000 - 5400) / 5400 = 0.48 (48% más)

Pronóstico Semana 7 (próxima Navidad):
  Tendencia: 5800
  Factor estacional: 0.48
  Pronóstico: 5800 × (1 + 0.48) = 8584
```

### 3. INTERVALOS DE CONFIANZA (95%)

**Objetivo:** Medir la incertidumbre de la predicción.

**Fórmula:**
```
σ = √[Σ(residual²) / n]

Donde:
  residual = valor_real - valor_predicho
  n = número de observaciones

Límite Superior = Pronóstico + 1.96 × σ
Límite Inferior = max(0, Pronóstico - 1.96 × σ)
```

**¿Por qué 1.96?**
- En una distribución normal, 1.96 × σ cubre el 95% de los datos
- Significa que hay 95% de probabilidad de que el valor real esté dentro del intervalo

**Ejemplo:**
```
Pronóstico: 5800
Desviación estándar (σ): 200

Límite Superior: 5800 + 1.96 × 200 = 5800 + 392 = 6192
Límite Inferior: 5800 - 1.96 × 200 = 5800 - 392 = 5408

Interpretación: Hay 95% de probabilidad de que el gasto esté entre 5408 y 6192
```

---

## 🛠️ RECURSOS Y LIBRERÍAS

### Frontend (Web)

| Librería | Versión | Propósito |
|----------|---------|----------|
| **Chart.js** | 3.9.1 | Gráficos interactivos |
| **DataTables** | 1.13.6 | Tablas con paginación y búsqueda |
| **jQuery** | 3.6.0 | Dependencia de DataTables |
| **PapaParse** | 5.4.1 | Parseo de CSV |
| **SweetAlert2** | 11 | Alertas elegantes |

### Backend (Python)

| Librería | Propósito |
|----------|----------|
| **NumPy** | Operaciones numéricas |
| **Pandas** | Manipulación de datos |
| **Scikit-learn** | Regresión lineal |
| **Flask** | API REST |

---

## 💡 EJEMPLO PRÁCTICO COMPLETO

### Datos de Entrada
```
Transacciones de ALIMENTACION (últimas 4 semanas):
Semana 1: 5000
Semana 2: 5200
Semana 3: 5400
Semana 4: 5600
```

### Paso 1: Calcular Tendencia
```
m = 200 (aumenta 200 por semana)
b = 5000 (valor inicial)
Ecuación: y = 200x + 5000
```

### Paso 2: Calcular Estacionalidad
```
Factores: [0, 0, 0, 0] (sin variación estacional)
```

### Paso 3: Calcular Residuales
```
Residual Semana 1: 5000 - 5000 = 0
Residual Semana 2: 5200 - 5200 = 0
Residual Semana 3: 5400 - 5400 = 0
Residual Semana 4: 5600 - 5600 = 0
σ = 0
```

### Paso 4: Generar Pronóstico (Semana 5)
```
Tendencia: 200 × 4 + 5000 = 5800
Factor estacional: 0
Pronóstico: 5800 × (1 + 0) = 5800
Intervalo: [5800, 5800] (sin incertidumbre)
```

### Resultado
```
Semana 5: 5800 ± 0 (95% confianza)
```

---

## 🎓 CONCEPTOS CLAVE

| Término | Definición |
|---------|-----------|
| **Tendencia** | Dirección general de los datos (arriba, abajo, plano) |
| **Estacionalidad** | Patrones que se repiten en períodos específicos |
| **Residual** | Diferencia entre valor real y predicho |
| **Desviación Estándar (σ)** | Medida de dispersión de los datos |
| **Intervalo de Confianza** | Rango donde probablemente esté el valor real |
| **Regresión Lineal** | Técnica para encontrar la línea que mejor ajusta los datos |

---

## 📦 COMBINACIÓN DE MÚLTIPLES FORMATOS

### Cómo se Combinan CSV, JSON y XML

La aplicación puede procesar **múltiples archivos de diferentes formatos simultáneamente**:

**Flujo de combinación:**
```
CSV Files          JSON Files         XML Files
    ↓                  ↓                  ↓
  Parse            Parse              Parse
    ↓                  ↓                  ↓
DataFrame 1      DataFrame 2        DataFrame 3
    ↓                  ↓                  ↓
    └──────────────────┴──────────────────┘
                       ↓
            pd.concat([df1, df2, df3])
                       ↓
            Combined DataFrame (All Data)
                       ↓
            Normalize & Aggregate Weekly
```

**Ejemplo:**
```
Archivo CSV:
  - TRX_POS_AUTH_2022.csv (726,634 registros)
  - TRX_POS_AUTH_2023.csv (registros 2023)

Archivo JSON:
  - txnstream-issuer_2022.json (1,091,648 registros)
  - txnstream-issuer_2023.json (registros 2023)

Archivo XML:
  - AXIS_ISS_AUTH_2022.xml (1,092,778 registros)
  - AXIS_ISS_AUTH_2023.xml (registros 2023)

Total combinado: ~3 millones de registros
```

**Ventajas:**
- ✅ Flexibilidad en formatos de entrada
- ✅ Consolidación de datos de múltiples fuentes
- ✅ Mayor volumen de datos para análisis
- ✅ Mejor precisión en pronósticos

---

## ✅ RESUMEN

La aplicación funciona en **5 pasos principales**:

1. **Carga** datos de transacciones (CSV, JSON, XML)
2. **Procesa** agrupando por semana y normalizando
3. **Analiza** calculando tendencia y estacionalidad
4. **Pronostica** combinando tendencia + estacionalidad
5. **Visualiza** en gráficos interactivos

**Algoritmo:** Regresión Lineal + Estacionalidad + Intervalos de Confianza (95%)

**Formatos soportados:** CSV, JSON, XML

**Precisión:** Depende de la cantidad y calidad de datos históricos

**Volumen de datos:** Puede procesar millones de registros de múltiples fuentes

