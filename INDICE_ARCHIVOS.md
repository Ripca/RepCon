# 📑 Índice de Archivos del Proyecto

## 🎯 Archivos de Inicio (Lee Primero)

| Archivo | Descripción | Tiempo |
|---------|-------------|--------|
| **COMIENZA_AQUI.md** | 👈 **EMPIEZA AQUÍ** - Guía rápida de inicio | 2 min |
| **RESUMEN_VISUAL.txt** | Resumen visual completo del proyecto | 3 min |
| **INICIO_RAPIDO.md** | Comienza en 30 segundos | 5 min |

---

## 📚 Documentación Principal

| Archivo | Descripción | Audiencia |
|---------|-------------|-----------|
| **README.md** | Descripción general del proyecto | Todos |
| **GUIA_INSTALACION.md** | Instalación paso a paso | Desarrolladores |
| **RESUMEN_PROYECTO.md** | Resumen ejecutivo | Gerentes/Ejecutivos |
| **DOCUMENTACION_TECNICA.md** | Detalles técnicos y arquitectura | Desarrolladores |
| **ESTRUCTURA_COMPLETA.txt** | Estructura completa del proyecto | Todos |
| **PROYECTO_COMPLETADO.md** | Resumen final del proyecto | Todos |

---

## 📁 Carpeta: python_project/

### Archivos Principales

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| **app.py** | ~150 | Servidor Flask con API REST |
| **data_processor.py** | ~200 | Procesamiento de datos (CSV, JSON, XML) |
| **forecaster.py** | ~180 | Módulo de pronóstico con regresión lineal |
| **requirements.txt** | ~15 | Dependencias Python (10 librerías) |

### Carpeta: templates/

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| **index.html** | ~400 | Interfaz web interactiva con Plotly |

### Funcionalidades

```
✅ API REST con 9 endpoints
✅ Carga de datos (CSV, JSON, XML)
✅ Procesamiento y agregación semanal
✅ Cálculo de estadísticas
✅ Pronóstico con intervalos de confianza
✅ Gráficos interactivos con Plotly
✅ Exportación a CSV
✅ CORS habilitado
```

---

## 📁 Carpeta: web_project/

### Archivos Principales

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| **index.html** | ~300 | Página principal con estructura HTML5 |
| **styles.css** | ~400 | Estilos CSS3 responsivos |
| **app.js** | ~350 | Lógica principal de la aplicación |
| **data-processor.js** | ~250 | Procesamiento de datos en navegador |
| **forecaster.js** | ~280 | Módulo de pronóstico en JavaScript |
| **sample-data.csv** | ~100 | Datos de ejemplo (100 registros) |

### Funcionalidades

```
✅ Carga de CSV desde navegador
✅ Procesamiento de datos en cliente
✅ Gráficos con Chart.js
✅ Pronóstico con regresión lineal
✅ Interfaz responsiva
✅ Exportación a CSV
✅ Funciona offline
✅ Sin dependencias externas
```

---

## 📁 Carpeta: data/

### Archivos CSV

| Archivo | Registros | Período | Descripción |
|---------|-----------|---------|-------------|
| **TRX_POS_AUTH_2022_v2.csv** | 726,634 | 2022 | Transacciones 2022 |
| **TRX_POS_AUTH_2023_v1.csv** | ~700K | 2023 | Transacciones 2023 |
| **TRX_POS_AUTH_2024_v2.csv** | ~700K | 2024 | Transacciones 2024 |
| **TRX_POS_AUTH_2025_v3.csv** | ~700K | 2025 | Transacciones 2025 |

### Archivos JSON

| Archivo | Registros | Período | Descripción |
|---------|-----------|---------|-------------|
| **txnstream-issuer_2022.json** | 1,091,648 | 2022 | Stream de transacciones 2022 |
| **txnstream-issuer_2023.json** | ~1M | 2023 | Stream de transacciones 2023 |
| **txnstream-issuer_2024.json** | ~1M | 2024 | Stream de transacciones 2024 |
| **txnstream-issuer_2025.json** | ~1M | 2025 | Stream de transacciones 2025 |

### Archivos XML

| Archivo | Registros | Período | Descripción |
|---------|-----------|---------|-------------|
| **AXIS_ISS_AUTH_2022_batchB.xml** | 1,092,778 | 2022 | Batch de autorización 2022 |
| **AXIS_ISS_AUTH_2023_batchC.xml** | ~1M | 2023 | Batch de autorización 2023 |
| **AXIS_ISS_AUTH_2024_batchA.xml** | ~1M | 2024 | Batch de autorización 2024 |
| **AXIS_ISS_AUTH_2025_batchB.xml** | ~1M | 2025 | Batch de autorización 2025 |

### Estadísticas

```
Total de registros:     3,000,000+
Período:                2022-2025 (4 años)
Tamaño total:           ~500 MB
Categorías:             10 principales
Clientes únicos:        ~100,000+
```

---

## 📄 Archivos de Configuración

| Archivo | Descripción |
|---------|-------------|
| **.gitignore** | Configuración de Git |
| **LICENSE** | Licencia del proyecto |

---

## 📄 Archivos Adicionales

| Archivo | Descripción |
|---------|-------------|
| **instrucciones.html** | Instrucciones del hackathon |
| **presentacion.pdf** | Presentación del proyecto |

---

## 🗂️ Estructura Completa

```
.
├── 📄 COMIENZA_AQUI.md                  ← EMPIEZA AQUÍ
├── 📄 RESUMEN_VISUAL.txt
├── 📄 INICIO_RAPIDO.md
├── 📄 GUIA_INSTALACION.md
├── 📄 RESUMEN_PROYECTO.md
├── 📄 DOCUMENTACION_TECNICA.md
├── 📄 ESTRUCTURA_COMPLETA.txt
├── 📄 PROYECTO_COMPLETADO.md
├── 📄 INDICE_ARCHIVOS.md                ← Este archivo
├── 📄 README.md
├── 📄 instrucciones.html
├── 📄 presentacion.pdf
├── 📄 LICENSE
├── 📄 .gitignore
│
├── 📁 python_project/
│   ├── 📄 app.py
│   ├── 📄 data_processor.py
│   ├── 📄 forecaster.py
│   ├── 📄 requirements.txt
│   └── 📁 templates/
│       └── 📄 index.html
│
├── 📁 web_project/
│   ├── 📄 index.html
│   ├── 📄 styles.css
│   ├── 📄 app.js
│   ├── 📄 data-processor.js
│   ├── 📄 forecaster.js
│   └── 📄 sample-data.csv
│
└── 📁 data/
    ├── 📁 csv/
    │   ├── 📄 TRX_POS_AUTH_2022_v2.csv
    │   ├── 📄 TRX_POS_AUTH_2023_v1.csv
    │   ├── 📄 TRX_POS_AUTH_2024_v2.csv
    │   └── 📄 TRX_POS_AUTH_2025_v3.csv
    ├── 📁 json/
    │   ├── 📄 txnstream-issuer_2022.json
    │   ├── 📄 txnstream-issuer_2023.json
    │   ├── 📄 txnstream-issuer_2024.json
    │   └── 📄 txnstream-issuer_2025.json
    └── 📁 xml/
        ├── 📄 AXIS_ISS_AUTH_2022_batchB.xml
        ├── 📄 AXIS_ISS_AUTH_2023_batchC.xml
        ├── 📄 AXIS_ISS_AUTH_2024_batchA.xml
        └── 📄 AXIS_ISS_AUTH_2025_batchB.xml
```

---

## 🎯 Guía de Lectura Recomendada

### Para Empezar Rápido (5 minutos)
1. **COMIENZA_AQUI.md** - Instrucciones de inicio
2. **RESUMEN_VISUAL.txt** - Visión general

### Para Instalar (10 minutos)
1. **INICIO_RAPIDO.md** - Pasos rápidos
2. **GUIA_INSTALACION.md** - Instalación detallada

### Para Entender el Proyecto (20 minutos)
1. **README.md** - Descripción general
2. **RESUMEN_PROYECTO.md** - Resumen ejecutivo
3. **ESTRUCTURA_COMPLETA.txt** - Estructura del proyecto

### Para Desarrolladores (30 minutos)
1. **DOCUMENTACION_TECNICA.md** - Detalles técnicos
2. **python_project/app.py** - Código principal
3. **web_project/app.js** - Lógica JavaScript

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Archivos de código** | 11 |
| **Líneas de código** | ~2,500+ |
| **Archivos de datos** | 12 |
| **Registros de datos** | 3,000,000+ |
| **Documentación** | 9 archivos |
| **Tecnologías** | 15+ |
| **Categorías** | 10 |
| **Período de datos** | 4 años |

---

## 🚀 Cómo Usar Este Índice

1. **Busca el archivo** que necesitas en las tablas anteriores
2. **Lee la descripción** para entender su propósito
3. **Sigue la guía de lectura** recomendada
4. **Abre el archivo** desde tu editor favorito

---

## 💡 Tips

- 📌 Comienza con **COMIENZA_AQUI.md**
- 📌 Usa **RESUMEN_VISUAL.txt** para una visión rápida
- 📌 Consulta **DOCUMENTACION_TECNICA.md** para detalles
- 📌 Revisa **ESTRUCTURA_COMPLETA.txt** para la estructura

---

## ✅ Checklist de Archivos

- [x] Documentación de inicio
- [x] Guías de instalación
- [x] Código Python (Backend)
- [x] Código JavaScript (Frontend)
- [x] Datos de ejemplo
- [x] Datos de producción
- [x] Documentación técnica
- [x] Resúmenes ejecutivos
- [x] Índice de archivos

---

## 📞 Preguntas Frecuentes

**¿Por dónde empiezo?**
→ Lee **COMIENZA_AQUI.md**

**¿Cómo instalo?**
→ Lee **INICIO_RAPIDO.md** o **GUIA_INSTALACION.md**

**¿Dónde está el código?**
→ Carpetas **python_project/** y **web_project/**

**¿Dónde están los datos?**
→ Carpeta **data/** con subcarpetas csv/, json/, xml/

**¿Cómo funciona?**
→ Lee **DOCUMENTACION_TECNICA.md**

---

**Versión:** 1.0.0  
**Fecha:** 2025-01-16  
**Estado:** ✅ Completo

