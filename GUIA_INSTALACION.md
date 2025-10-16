# 🚀 Guía de Instalación y Uso

## Versión Python (Recomendada)

### Paso 1: Preparar el Entorno

```bash
# Navegar a la carpeta del proyecto Python
cd python_project

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate
```

### Paso 2: Instalar Dependencias

```bash
pip install -r requirements.txt
```

### Paso 3: Ejecutar la Aplicación

```bash
python app.py
```

Verás un mensaje como:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Paso 4: Acceder a la Aplicación

Abre tu navegador y ve a: **http://localhost:5000**

### Paso 5: Cargar Datos

1. La aplicación cargará automáticamente datos de la carpeta `../data`
2. Soporta CSV, JSON y XML
3. Los datos se normalizan y agregan semanalmente

### Paso 6: Generar Pronósticos

1. Selecciona una categoría del sidebar
2. Ajusta el número de semanas (1-52)
3. Haz clic en "Generar Pronóstico"
4. Visualiza los resultados en los gráficos

### Paso 7: Exportar Resultados

1. Haz clic en "Exportar CSV"
2. Se descargará un archivo con los pronósticos

---

## Versión HTML/CSS/JavaScript (Standalone)

### Opción A: Abrir Directamente

```bash
# Navegar a la carpeta
cd web_project

# Abrir en el navegador (Windows)
start index.html

# O en macOS
open index.html

# O en Linux
xdg-open index.html
```

### Opción B: Con Servidor Local (Recomendado)

```bash
cd web_project

# Usar Python 3
python -m http.server 8000

# O usar Python 2
python -m SimpleHTTPServer 8000

# O usar Node.js (si está instalado)
npx http-server
```

Luego accede a: **http://localhost:8000**

### Características de la Versión Web

- ✅ No requiere instalación
- ✅ Funciona offline (después de cargar)
- ✅ Datos de ejemplo incluidos
- ✅ Carga de archivos CSV
- ✅ Gráficos interactivos
- ✅ Exportación de resultados

---

## Estructura de Carpetas

```
python_project/
├── app.py                 # Aplicación Flask
├── data_processor.py      # Procesamiento de datos
├── forecaster.py          # Módulo de pronóstico
├── requirements.txt       # Dependencias Python
└── templates/
    └── index.html         # Interfaz web

web_project/
├── index.html             # Página principal
├── styles.css             # Estilos CSS
├── app.js                 # Lógica principal
├── data-processor.js      # Procesamiento de datos
└── forecaster.js          # Módulo de pronóstico

data/
├── csv/                   # Archivos CSV
│   ├── TRX_POS_AUTH_2022_v2.csv
│   ├── TRX_POS_AUTH_2023_v1.csv
│   ├── TRX_POS_AUTH_2024_v2.csv
│   └── TRX_POS_AUTH_2025_v3.csv
├── json/                  # Archivos JSON
│   ├── txnstream-issuer_2022.json
│   ├── txnstream-issuer_2023.json
│   ├── txnstream-issuer_2024.json
│   └── txnstream-issuer_2025.json
└── xml/                   # Archivos XML
    ├── AXIS_ISS_AUTH_2022_batchB.xml
    ├── AXIS_ISS_AUTH_2023_batchC.xml
    ├── AXIS_ISS_AUTH_2024_batchA.xml
    └── AXIS_ISS_AUTH_2025_batchB.xml
```

---

## Requisitos del Sistema

### Para Python
- Python 3.8 o superior
- pip (gestor de paquetes)
- 500 MB de espacio en disco
- 2 GB de RAM mínimo

### Para Web
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para CDN de librerías)
- 100 MB de espacio en disco

---

## Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'flask'"

**Solución:**
```bash
pip install flask
# O reinstalar todas las dependencias
pip install -r requirements.txt
```

### Error: "Port 5000 already in use"

**Solución:**
```bash
# Usar otro puerto
python app.py --port 5001

# O matar el proceso en el puerto 5000
# En Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# En macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### Los datos no se cargan

**Solución:**
1. Verifica que la carpeta `data` existe
2. Verifica que los archivos tienen el formato correcto
3. Revisa la consola para mensajes de error
4. Intenta cargar datos de ejemplo

### Los gráficos no se muestran

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores de JavaScript
3. Verifica que Chart.js se cargó correctamente
4. Intenta recargar la página

---

## Uso Básico

### 1. Cargar Datos

**Python:**
- Los datos se cargan automáticamente de `../data`
- Soporta CSV, JSON, XML

**Web:**
- Haz clic en "Seleccionar CSV"
- O usa "Datos de Ejemplo"

### 2. Explorar Datos

- Visualiza estadísticas en el panel superior
- Selecciona una categoría para ver su serie temporal
- Compara múltiples categorías

### 3. Generar Pronósticos

- Selecciona una categoría
- Ajusta el número de semanas
- Haz clic en "Generar Pronóstico"

### 4. Exportar Resultados

- Haz clic en "Exportar CSV"
- Se descargará un archivo con los pronósticos

---

## Configuración Avanzada

### Python

Edita `app.py` para cambiar:
- Puerto: `app.run(port=5000)`
- Debug: `app.run(debug=True)`
- Host: `app.run(host='0.0.0.0')`

### Web

Edita `app.js` para cambiar:
- Número de categorías de ejemplo
- Rango de fechas
- Algoritmo de pronóstico

---

## Rendimiento

### Optimizaciones

- **Python**: Usa pandas para procesamiento eficiente
- **Web**: Carga datos bajo demanda
- **Gráficos**: Limita a últimas 100 semanas

### Escalabilidad

- **Python**: Soporta millones de transacciones
- **Web**: Óptimo para 10,000+ registros

---

## Próximos Pasos

1. ✅ Instala la aplicación
2. ✅ Carga tus datos
3. ✅ Explora los patrones
4. ✅ Genera pronósticos
5. ✅ Exporta resultados
6. ✅ Toma decisiones basadas en datos

---

## Contacto y Soporte

Para problemas o preguntas:
- Revisa los logs de la consola
- Verifica el formato de datos
- Consulta la documentación

**¡Éxito con tu análisis!** 🎉

