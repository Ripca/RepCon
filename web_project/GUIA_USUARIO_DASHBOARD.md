# 📖 Guía de Usuario - Dashboard Forecasting

## 🎯 Descripción General

El dashboard es una herramienta profesional para análisis y predicción de consumo de categorías de tarjeta de crédito usando el algoritmo ARIMA.

## 🗂️ Secciones del Dashboard

### 1. **Dashboard** (Inicio)
**Propósito**: Vista general de métricas clave

**Componentes**:
- **KPI Cards**: Muestra 4 métricas principales
  - Crecimiento Promedio: Variación porcentual promedio
  - Categoría Principal: Categoría con mayor consumo
  - Período Analizado: Rango de fechas
  - Precisión ARIMA: Exactitud del modelo

- **Tendencia General**: Gráfico de línea con top 3 categorías
- **Top Categorías**: Gráfico de barras con 5 categorías principales

**Acciones**:
- Ver métricas en tiempo real
- Identificar tendencias principales

---

### 2. **Análisis**
**Propósito**: Análisis detallado de series temporales

**Componentes**:
- **Serie Temporal Detallada**: 
  - Selector de categoría individual
  - Visualización de datos históricos
  - Identificación de patrones

- **Distribución por Categoría**: 
  - Gráfico Doughnut
  - Proporción de cada categoría

- **Participación de Mercado**: 
  - Gráfico Pie
  - Porcentaje de cada categoría

**Acciones**:
- Seleccionar categoría específica
- Analizar patrones históricos
- Comparar proporciones

---

### 3. **Pronósticos**
**Propósito**: Predicciones futuras con ARIMA

**Componentes**:
- **Pronóstico ARIMA**: 
  - Predicciones para 14 semanas
  - Intervalos de confianza (95%)
  - Línea de tendencia

- **Comparación de Categorías**: 
  - Múltiples series simultáneamente
  - Checkboxes para seleccionar/deseleccionar
  - Colores diferenciados por categoría

**Acciones**:
- Generar pronósticos
- Seleccionar categorías a comparar
- Exportar resultados

---

### 4. **Datos**
**Propósito**: Visualización de datos históricos

**Componentes**:
- **Tabla de Datos Históricos**:
  - Todas las transacciones
  - Columnas: Fecha, Categorías
  - Scroll horizontal para muchas columnas
  - Ordenamiento y búsqueda

**Acciones**:
- Revisar datos crudos
- Verificar integridad de datos
- Exportar tabla

---

### 5. **Configuración**
**Propósito**: Ajustar parámetros del sistema

**Componentes**:
- **Configuración del Modelo**:
  - Horizonte de Pronóstico (1-52 semanas)
  - Nivel de Confianza (90%, 95%, 99%)
  - Selección de Algoritmo (ARIMA, Lineal)

- **Información del Sistema**:
  - Versión: 1.0.0
  - Algoritmo Activo: ARIMA
  - Categorías Soportadas: 10
  - Precisión Esperada: 8-12% sMAPE

**Acciones**:
- Guardar configuración
- Cambiar parámetros del modelo
- Ver información del sistema

---

## 🛠️ Barra de Herramientas

### Controles Principales

| Control | Función |
|---------|---------|
| **Cargar CSV** | Importar datos desde archivo |
| **Datos Ejemplo** | Cargar datos de demostración |
| **Semanas** | Establecer horizonte de pronóstico |
| **Año** | Filtrar por año específico |
| **Generar Pronóstico** | Ejecutar modelo ARIMA |
| **Descargar CSV** | Exportar resultados |

---

## 📊 Cómo Usar

### Paso 1: Cargar Datos
```
1. Haz clic en "Cargar CSV"
2. Selecciona archivo con formato:
   cliente_id, fecha, monto, categoria
3. Los datos se cargan automáticamente
```

### Paso 2: Explorar Dashboard
```
1. Ve a "Dashboard" para ver métricas
2. Observa KPIs y gráficos principales
3. Identifica tendencias
```

### Paso 3: Analizar Datos
```
1. Ve a "Análisis"
2. Selecciona categoría específica
3. Observa patrones históricos
4. Revisa distribución y participación
```

### Paso 4: Generar Pronósticos
```
1. Ajusta "Semanas" en toolbar (1-52)
2. Haz clic en "Generar Pronóstico"
3. Espera a que se calcule ARIMA
4. Observa predicciones en "Pronósticos"
```

### Paso 5: Exportar Resultados
```
1. Haz clic en "Descargar CSV"
2. Se descarga archivo con predicciones
3. Formato: fecha, categoría1, categoría2, ...
```

---

## 🎨 Elementos Visuales

### Colores por Categoría
Cada categoría tiene color único en gráficos:
- ALIMENTACION: Azul
- TRANSPORTE: Verde
- EDUCACION: Naranja
- SALUD: Rojo
- ENTRETENIMIENTO: Púrpura
- VIVIENDA: Marrón
- SERVICIOS: Gris
- TECNOLOGIA: Cian
- ABASTECIMIENTO: Rosa
- COMPRAS EN LINEA: Amarillo

### Iconos Font Awesome
- 📊 Gráficos: `fas fa-chart-*`
- 📁 Datos: `fas fa-table`
- ⚙️ Configuración: `fas fa-cog`
- 💾 Guardar: `fas fa-save`
- 📥 Descargar: `fas fa-download`

---

## ⚙️ Configuración Recomendada

| Parámetro | Recomendación |
|-----------|---------------|
| Horizonte | 14 semanas |
| Confianza | 95% |
| Algoritmo | ARIMA |

---

## 🐛 Solución de Problemas

**Problema**: Gráficos no aparecen
- **Solución**: Carga datos de ejemplo primero

**Problema**: Pronóstico tarda mucho
- **Solución**: Reduce número de semanas

**Problema**: Datos no se cargan
- **Solución**: Verifica formato CSV

---

## 📞 Soporte

Para más información sobre ARIMA y predicciones, consulta la documentación técnica.

---

**Versión**: 1.0.0
**Última actualización**: 2025-10-16

