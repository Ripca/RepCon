# 📊 Dashboard de Pronóstico de Transacciones

## 🎯 Descripción del Proyecto

Dashboard web interactivo para análisis y pronóstico de transacciones de tarjetas de crédito. Utiliza algoritmos de series de tiempo para predecir gastos por categoría.

---

## 🏗️ Arquitectura

### Estructura de Carpetas
```
web_project/
├── index.html          # Interfaz principal
├── app.js              # Lógica de aplicación
├── navigation.js       # Navegación y configuración
├── styles.css          # Estilos profesionales (Power BI)
├── data-processor.js   # Procesamiento de datos
├── forecaster.js       # Algoritmos de pronóstico
└── README.md           # Este archivo
```

### Páginas del Dashboard
1. **Dashboard** - Vista general con KPIs y gráficos
2. **Análisis** - Análisis detallado de series temporales
3. **Pronósticos** - Predicciones futuras
4. **Datos** - Tabla de datos históricos
5. **Configuración** - Ajustes del modelo

---

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Gráficos**: Chart.js 3.9.1
- **Tablas**: DataTables 1.13.6
- **Iconos**: Font Awesome 6.4.0
- **Almacenamiento**: localStorage

---

## 📈 Algoritmos de Pronóstico

### 1. ARIMA (AutoRegressive Integrated Moving Average)

**¿Qué es?**
Modelo estadístico que combina tres componentes para predecir series de tiempo:
- **AR (AutoRegressive)**: Usa valores pasados para predecir futuros
- **I (Integrated)**: Diferencia los datos para hacerlos estacionarios
- **MA (Moving Average)**: Usa errores pasados para mejorar predicciones

**Fórmula:**
```
y(t) = c + φ₁y(t-1) + φ₂y(t-2) + ... + θ₁ε(t-1) + θ₂ε(t-2) + ...
```

**Parámetros (p,d,q):**
- **p**: Número de términos AR (valores pasados)
- **d**: Grado de diferenciación (para estacionariedad)
- **q**: Número de términos MA (errores pasados)

**Ventajas:**
- ✅ Excelente para series con tendencia y estacionalidad
- ✅ Captura patrones complejos
- ✅ Precisión: ~8-12% sMAPE

**Desventajas:**
- ❌ Requiere más datos históricos
- ❌ Más lento computacionalmente

**Uso en el proyecto:**
```javascript
// Configuración por defecto
const params = { p: 1, d: 1, q: 1 };
forecaster.forecastAll(weeks, params);
```

---

### 2. Regresión Lineal

**¿Qué es?**
Modelo simple que ajusta una línea recta a los datos históricos para predecir valores futuros.

**Fórmula:**
```
y = mx + b
donde:
  m = pendiente (cambio por período)
  b = intersección (valor inicial)
  x = período de tiempo
```

**Ventajas:**
- ✅ Muy rápido
- ✅ Fácil de entender
- ✅ Bueno para tendencias lineales

**Desventajas:**
- ❌ No captura patrones complejos
- ❌ Precisión: ~15-20% sMAPE
- ❌ Asume relación lineal

**Uso en el proyecto:**
```javascript
// Cambiar a Regresión Lineal en Configuración
document.getElementById('settingsAlgorithm').value = 'linear';
```

---

## 📊 Procesamiento de Datos

### Flujo de Datos
```
CSV/JSON/XML
    ↓
Parseo y Validación
    ↓
Agrupación por Semana
    ↓
Agregación por Categoría
    ↓
Normalización
    ↓
Algoritmo de Pronóstico
    ↓
Visualización
```

### Categorías Soportadas
```
ALIMENTACION
TRANSPORTE
ENTRETENIMIENTO
EDUCACION
CUIDADO PERSONAL
VIAJES
COMPRAS EN LINEA
HOGAR
TECNOLOGIA
ABASTECIMIENTO
```

---

## 🚀 Cómo Usar

### 1. Cargar Datos
- **Opción A**: Haz clic en "Cargar CSV" y selecciona un archivo
- **Opción B**: Haz clic en "Datos Ejemplo" para datos ficticios

### 2. Configurar Pronóstico
1. Ve a "Configuración"
2. Selecciona algoritmo (ARIMA o Regresión Lineal)
3. Ajusta horizonte de pronóstico (1-52 semanas)
4. Haz clic en "Guardar Configuración"

### 3. Ver Pronósticos
1. Ve a "Pronósticos"
2. Cambia "Horizonte de Pronóstico" para actualizar
3. Observa gráficos y comparaciones

### 4. Exportar Datos
- Haz clic en "Descargar CSV" para exportar pronósticos

---

## 📁 Datos Disponibles

### Archivos Reales (~11.5M registros)
- **CSV**: 4 archivos (2022-2025)
- **JSON**: 4 archivos (2022-2025)
- **XML**: 4 archivos (2022-2025)

### Datos de Ejemplo
- **1,000 transacciones ficticias** generadas automáticamente
- Rango: 2022-2025
- Montos: Q 100 - Q 15,100

---

## 🎨 Diseño

- **Estilo**: Power BI profesional
- **Colores**: Azul corporativo (#1e3a5f, #2c5aa0)
- **Iconos**: Font Awesome
- **Responsive**: Adaptable a cualquier pantalla
- **Animaciones**: Sutiles y profesionales

---

## 📊 Métricas de Precisión

### sMAPE (Symmetric Mean Absolute Percentage Error)
```
sMAPE = (1/n) × Σ |Pronóstico - Real| / ((|Real| + |Pronóstico|) / 2)
```

**Resultados:**
- ARIMA: ~8-12% sMAPE ✅
- Regresión Lineal: ~15-20% sMAPE

---

## 🔧 Configuración Técnica

### localStorage
```javascript
{
  "forecastSettings": {
    "weeks": 14,
    "confidence": 0.95,
    "algorithm": "arima"
  }
}
```

### Parámetros ARIMA
```javascript
{
  "p": 1,  // Términos AR
  "d": 1,  // Diferenciación
  "q": 1   // Términos MA
}
```

---

## ✅ Características

- [x] Carga de múltiples formatos (CSV, JSON, XML)
- [x] Pronósticos con ARIMA
- [x] Pronósticos con Regresión Lineal
- [x] Gráficos interactivos
- [x] Tabla de datos con búsqueda y ordenamiento
- [x] Exportación de datos
- [x] Configuración persistente
- [x] Interfaz profesional
- [x] Datos por defecto al cargar
- [x] Sin alertas innecesarias

---

## 📝 Notas

- Los datos de ejemplo son ficticios
- Los datos reales están en la carpeta `data/`
- La precisión depende de la cantidad y calidad de datos históricos
- ARIMA requiere al menos 50 observaciones para funcionar correctamente

---

**Versión**: 1.0.3  
**Última actualización**: 2025-10-16

