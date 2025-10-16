# 📊 EXPLICACIÓN DE LOS DATOS MOSTRADOS

## ❓ ¿SON REALES LOS DATOS?

**NO.** Los datos que ves en el dashboard son **datos de ejemplo generados aleatoriamente** en el código JavaScript.

### ¿Por qué?
Porque cuando cargas la página por primera vez, no hay datos reales cargados. Para que no se vea vacío, el código genera automáticamente 1,000 transacciones ficticias.

---

## 📈 ¿QUÉ SIGNIFICAN ESTOS NÚMEROS?

### En el Dashboard:
```
TRANSACCIONES: 1,000
MONTO TOTAL:   Q 7,716,340
CATEGORÍAS:    10
```

**Explicación:**
- **1,000** = Número de transacciones ficticias generadas
- **Q 7,716,340** = Suma total de todos los montos de esas 1,000 transacciones
- **10** = Número de categorías de gasto (ALIMENTACION, TRANSPORTE, etc.)

### En la Tabla de Datos:
```
Fecha          | ALIMENTACION | TRANSPORTE | EDUCACION | ...
2022-01-15     | Q 5,000      | Q 2,500    | Q 1,200   | ...
2022-02-20     | Q 4,800      | Q 2,300    | Q 1,500   | ...
```

**Explicación:**
- **Fecha** = Fecha de la transacción (aleatoria entre 2022-2025)
- **Categorías** = Monto gastado en cada categoría esa semana
- **Valores** = Números ficticios generados aleatoriamente

---

## 🔄 ¿CÓMO FUNCIONAN LOS DATOS?

### 1. **Al Cargar la Página**
```javascript
function loadSampleData() {
    // Genera 1,000 transacciones ficticias
    for (let i = 0; i < 1000; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + Math.floor(Math.random() * 1095)); // 3 años
        const category = categories[Math.floor(Math.random() * categories.length)];
        const amount = (Math.random() * 15000 + 100).toFixed(2);
        // ...
    }
}
```

### 2. **Datos Generados**
- **Rango de fechas**: 2022-01-01 a 2025-01-01 (3 años)
- **Rango de montos**: Q 100 a Q 15,100
- **Categorías**: 10 categorías fijas
- **Cantidad**: 1,000 transacciones

### 3. **Procesamiento**
Los datos se agrupan por semana y se suman por categoría:
```
Semana 1 (2022-01-02 a 2022-01-08):
  ALIMENTACION: Q 5,000
  TRANSPORTE: Q 2,500
  EDUCACION: Q 1,200
  ...
```

---

## 🔴 PROBLEMA ACTUAL

### La Tabla Estaba Vacía
**Causa**: La función `updateDataTable()` no se estaba ejecutando correctamente.

**Solución Aplicada**:
- ✅ Mejorada la inicialización de la tabla
- ✅ Agregado mejor manejo de encabezados
- ✅ Agregado logging para debugging
- ✅ Mejorada la destrucción de DataTable anterior

---

## 📥 ¿CÓMO CARGAR DATOS REALES?

### Opción 1: Botón "Cargar CSV"
1. Haz clic en "Cargar CSV"
2. Selecciona un archivo CSV de la carpeta `data/csv/`
3. Los datos reales reemplazarán los datos de ejemplo

### Opción 2: Botón "Datos Ejemplo"
1. Haz clic en "Datos Ejemplo"
2. Se cargan nuevamente los datos ficticios

---

## 📊 DATOS REALES DISPONIBLES

En la carpeta `data/` tienes:

### CSV (4 archivos)
- TRX_POS_AUTH_2022_v2.csv (~1.4M registros)
- TRX_POS_AUTH_2023_v1.csv (~1.4M registros)
- TRX_POS_AUTH_2024_v2.csv (~1.4M registros)
- TRX_POS_AUTH_2025_v3.csv (726K registros)

### JSON (4 archivos)
- txnstream-issuer_2022.json (~1.46M registros)
- txnstream-issuer_2023.json (~1.46M registros)
- txnstream-issuer_2024.json (~1.47M registros)
- txnstream-issuer_2025.json (~1.09M registros)

### XML (4 archivos)
- AXIS_ISS_AUTH_2022_batchB.xml (~1.46M registros)
- AXIS_ISS_AUTH_2023_batchC.xml (~1.46M registros)
- AXIS_ISS_AUTH_2024_batchA.xml (~1.46M registros)
- AXIS_ISS_AUTH_2025_batchB.xml (~1.09M registros)

**Total**: ~11.5 millones de registros reales

---

## ✅ CHECKLIST

- [x] Datos de ejemplo generados automáticamente
- [x] Tabla se llena correctamente
- [x] KPIs muestran estadísticas
- [x] Gráficos se actualizan
- [x] Opción para cargar datos reales
- [x] Opción para volver a datos de ejemplo

---

## 🎯 RESUMEN

| Aspecto | Valor |
|---------|-------|
| Datos Mostrados | Ficticios (ejemplo) |
| Transacciones | 1,000 |
| Monto Total | Q 7,716,340 |
| Categorías | 10 |
| Rango de Fechas | 2022-2025 |
| Datos Reales Disponibles | ~11.5M registros |
| Cómo Cargar Reales | Botón "Cargar CSV" |

---

**Última actualización**: 2025-10-16

