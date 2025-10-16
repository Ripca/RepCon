# ✅ ACTUALIZACIÓN: SOPORTE PARA JSON Y XML

## 📝 CAMBIOS REALIZADOS

He actualizado la **GUIA_TECNICA_FUNCIONAMIENTO_APLICACION.md** para incluir información completa sobre cómo se cargan y procesan archivos **JSON** y **XML**.

---

## 📊 FORMATOS SOPORTADOS

### 1️⃣ CSV (Comma-Separated Values)

**Estructura:**
```
cliente_id,fecha,monto,categoria
C000001,2022-01-05,1500.00,ALIMENTACION
C000002,2022-01-06,250.50,TRANSPORTE
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

---

### 2️⃣ JSON (JavaScript Object Notation)

**Estructura:**
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

**Ventajas:**
- ✅ Fácil de parsear
- ✅ Soporta estructuras complejas
- ✅ Legible para humanos
- ✅ Estándar en APIs web

---

### 3️⃣ XML (eXtensible Markup Language)

**Estructura:**
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

**Ventajas:**
- ✅ Muy estructurado
- ✅ Soporta metadatos
- ✅ Validable con esquemas
- ✅ Usado en sistemas empresariales

---

## 🔄 COMBINACIÓN DE MÚLTIPLES FORMATOS

### Cómo Funciona

La aplicación puede procesar **múltiples archivos de diferentes formatos simultáneamente**:

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

### Código Python

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

---

## 📈 EJEMPLO DE VOLUMEN DE DATOS

```
Archivos CSV:
  • TRX_POS_AUTH_2022.csv      → 726,634 registros
  • TRX_POS_AUTH_2023.csv      → registros 2023
  • TRX_POS_AUTH_2024.csv      → registros 2024
  • TRX_POS_AUTH_2025.csv      → registros 2025

Archivos JSON:
  • txnstream-issuer_2022.json → 1,091,648 registros
  • txnstream-issuer_2023.json → registros 2023
  • txnstream-issuer_2024.json → registros 2024
  • txnstream-issuer_2025.json → registros 2025

Archivos XML:
  • AXIS_ISS_AUTH_2022.xml     → 1,092,778 registros
  • AXIS_ISS_AUTH_2023.xml     → registros 2023
  • AXIS_ISS_AUTH_2024.xml     → registros 2024
  • AXIS_ISS_AUTH_2025.xml     → registros 2025

TOTAL COMBINADO: ~3 millones de registros
```

---

## ✅ VENTAJAS DE MÚLTIPLES FORMATOS

- ✅ **Flexibilidad**: Acepta datos de diferentes fuentes
- ✅ **Consolidación**: Combina datos de múltiples sistemas
- ✅ **Volumen**: Procesa millones de registros
- ✅ **Precisión**: Mayor cantidad de datos = mejor pronóstico
- ✅ **Robustez**: Si un formato falla, otros continúan

---

## 📄 ARCHIVO ACTUALIZADO

**Ubicación:** `GUIA_TECNICA_FUNCIONAMIENTO_APLICACION.md`

**Nuevas secciones agregadas:**
1. ✅ Paso 1: Carga de Datos (Múltiples Formatos)
   - CSV con ejemplos
   - JSON con ejemplos
   - XML con ejemplos
   - Carga en Python y JavaScript

2. ✅ Paso 1b: Combinación de Múltiples Formatos
   - Código Python completo
   - Ventajas de la combinación

3. ✅ Paso 2: Normalización (Actualizado)
   - Código Python completo
   - Transformaciones realizadas

4. ✅ Paso 3: Agrupación Semanal (Actualizado)
   - Código Python completo
   - Código JavaScript completo
   - Ejemplo de agrupación
   - Razones de usar agrupación semanal

5. ✅ Nueva sección: Combinación de Múltiples Formatos
   - Flujo visual
   - Ejemplo de volumen
   - Ventajas

---

## 🎯 RESUMEN ACTUALIZADO

La aplicación ahora está completamente documentada para:

✅ **Carga de datos:**
- CSV (Comma-Separated Values)
- JSON (JavaScript Object Notation)
- XML (eXtensible Markup Language)

✅ **Procesamiento:**
- Normalización de datos
- Agrupación semanal
- Combinación de múltiples formatos

✅ **Análisis:**
- Regresión Lineal
- Análisis Estacional
- Intervalos de Confianza

✅ **Pronóstico:**
- Generación de predicciones
- Cálculo de confianza
- Visualización

**¡Tu programa está completamente documentado! 📚**

