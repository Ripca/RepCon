# 🔬 ANÁLISIS DETALLADO DE DATOS

## 📊 RESUMEN EJECUTIVO

Tienes **12 archivos de datos** con aproximadamente **11.5 millones de registros** de transacciones de tarjetas de crédito desde 2022 hasta 2025.

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### Cobertura Temporal
- **2022**: 3 archivos (CSV, JSON, XML)
- **2023**: 3 archivos (CSV, JSON, XML)
- **2024**: 3 archivos (CSV, JSON, XML)
- **2025**: 3 archivos (CSV, JSON, XML)

### Categorías de Gasto (10 Total)
1. ALIMENTACION / Alimentacion / Alimentación
2. TRANSPORTE / Transporte
3. ENTRETENIMIENTO / Entretenimiento
4. EDUCACION / Educacion / Educación
5. CUIDADO PERSONAL / Cuidado personal / Cuidado Personal
6. VIAJES / Viajes
7. COMPRAS EN LINEA / Compras en linea / Compras en Línea
8. HOGAR / Hogar
9. TECNOLOGIA / Tecnología
10. ABASTECIMIENTO / Abastecimiento

### Información por Registro
- **cliente_id**: Identificador único del cliente (ej: C122794)
- **fecha**: Timestamp de la transacción
- **monto**: Cantidad en Quetzales (Q)
- **categoria**: Categoría de gasto

---

## 📈 VOLUMEN DE DATOS

### Por Año
| Año | CSV | JSON | XML | Total |
|-----|-----|------|-----|-------|
| 2022 | ~1.4M | 1.46M | 1.46M | ~4.3M |
| 2023 | ~1.4M | 1.46M | 1.46M | ~4.3M |
| 2024 | ~1.4M | 1.47M | 1.46M | ~4.3M |
| 2025 | ~726K | 1.09M | 1.09M | ~2.9M |
| **TOTAL** | **~5.5M** | **~5.5M** | **~5.5M** | **~16.5M** |

---

## 🔧 FORMATOS Y ESTRUCTURAS

### CSV
```
cliente_id,fecha,monto,categoria
C122794,2025-01-01T00:00:25.047473,6373.4,TRANSPORTE
```
- Fecha: ISO 8601
- Monto: Punto decimal
- Categoría: MAYÚSCULAS

### JSON
```json
{
  "cliente_id": "C146868",
  "fecha": "01/01/2022 00:01:22.616378",
  "monto": 340.66,
  "categoria": "Cuidado personal"
}
```
- Fecha: DD/MM/YYYY HH:MM:SS.ffffff
- Monto: Punto decimal
- Categoría: Título (con espacios)

### XML
```xml
<row>
  <cliente_id>C137338</cliente_id>
  <fecha>2022-01-01T00:03:21.795867</fecha>
  <monto>353,89</monto>
  <categoria>Entretenimiento</categoria>
</row>
```
- Fecha: ISO 8601
- Monto: Coma decimal
- Categoría: Título

---

## 🚨 PROBLEMAS ENCONTRADOS

### 1. Inconsistencia de Categorías
**Problema**: Diferentes formatos en cada archivo
```
CSV:  "ALIMENTACION"
JSON: "Alimentacion"
XML:  "Alimentación"
```
**Solución**: Normalizar a mayúsculas sin acentos

### 2. Inconsistencia de Fechas
**Problema**: Dos formatos diferentes
```
CSV/XML: 2025-01-01T00:00:25.047473
JSON:    01/01/2022 00:01:22.616378
```
**Solución**: Convertir todo a ISO 8601

### 3. Inconsistencia de Montos
**Problema**: Separadores decimales diferentes
```
CSV/JSON: 6373.4
XML:      353,89
```
**Solución**: Convertir todo a punto decimal

### 4. Espacios en Categorías
**Problema**: Algunas categorías tienen espacios
```
"Compras en linea"
"Compras en Línea"
```
**Solución**: Usar guiones o sin espacios

---

## 💡 OPORTUNIDADES

### 1. Análisis Temporal
- Datos de 4 años completos
- Permite análisis de tendencias anuales
- Ideal para ARIMA y pronósticos

### 2. Análisis por Categoría
- 10 categorías diferentes
- Permite segmentación
- Ideal para comparación de patrones

### 3. Análisis de Clientes
- Múltiples clientes (C000000 - C199999)
- Permite análisis de comportamiento
- Ideal para clustering

### 4. Análisis de Montos
- Rango amplio de transacciones
- Permite análisis de distribución
- Ideal para detección de anomalías

---

## 🎯 CASOS DE USO

### 1. Pronóstico de Gastos
✅ **Posible**: Usar ARIMA con datos históricos
- Datos: 4 años de transacciones
- Granularidad: Diaria/Semanal/Mensual
- Precisión: Alta (múltiples años)

### 2. Análisis de Tendencias
✅ **Posible**: Identificar patrones estacionales
- Datos: Suficientes para 4 años
- Patrón: Anual, mensual, semanal

### 3. Segmentación de Clientes
✅ **Posible**: Agrupar por comportamiento
- Datos: Múltiples clientes
- Atributos: Categoría, monto, frecuencia

### 4. Detección de Anomalías
✅ **Posible**: Identificar transacciones inusuales
- Datos: Distribución de montos
- Método: Desviación estándar, IQR

---

## 📋 CHECKLIST DE VALIDACIÓN

- [x] Archivos CSV válidos
- [x] Archivos JSON válidos
- [x] Archivos XML válidos
- [x] Estructura consistente
- [x] Datos completos (sin nulos)
- [x] Fechas válidas
- [x] Montos positivos
- [x] Categorías reconocibles
- [ ] Normalización de categorías
- [ ] Conversión de formatos
- [ ] Validación de integridad

---

## 🔄 PRÓXIMOS PASOS

1. **Crear función de parseo** que maneje los 3 formatos
2. **Normalizar datos** (categorías, fechas, montos)
3. **Validar integridad** de datos
4. **Cargar en base de datos** o memoria
5. **Ejecutar análisis** con ARIMA
6. **Generar pronósticos** por categoría

---

**Análisis completado**: 2025-10-16
**Archivos evaluados**: 12/12 ✅
**Estado**: Listo para procesamiento

