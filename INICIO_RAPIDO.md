# ⚡ Inicio Rápido

## 🎯 Opción 1: Versión Web (Más Rápido - 30 segundos)

### Paso 1: Abrir Terminal
```bash
cd web_project
```

### Paso 2: Iniciar Servidor
```bash
python -m http.server 8000
```

### Paso 3: Abrir Navegador
```
http://localhost:8000
```

### ¡Listo! 🎉
- Los datos de ejemplo se cargan automáticamente
- Puedes cargar tu propio CSV
- Genera pronósticos al instante

---

## 🐍 Opción 2: Versión Python (Más Potente - 2 minutos)

### Paso 1: Instalar Dependencias
```bash
cd python_project
pip install -r requirements.txt
```

### Paso 2: Ejecutar Aplicación
```bash
python app.py
```

### Paso 3: Abrir Navegador
```
http://localhost:5000
```

### ¡Listo! 🎉
- Interfaz web completa
- API REST disponible
- Análisis avanzado

---

## 📊 Primeros Pasos

### 1. Explorar Datos
- Mira el resumen en la parte superior
- Selecciona una categoría del sidebar
- Observa la serie temporal

### 2. Comparar Categorías
- Desplázate a "Comparación de Categorías"
- Visualiza todas las categorías juntas
- Identifica patrones

### 3. Generar Pronóstico
- Selecciona una categoría
- Ajusta semanas (default: 14)
- Haz clic en "Generar Pronóstico"
- Visualiza el resultado

### 4. Exportar Resultados
- Haz clic en "Exportar CSV"
- Se descargará el archivo
- Úsalo en Excel o tu herramienta favorita

---

## 📁 Cargar Tus Datos

### Formato CSV
```csv
cliente_id,fecha,monto,categoria
C122794,2024-01-01,6373.4,ALIMENTACION
C050819,2024-01-01,3426.1,TRANSPORTE
```

### Pasos
1. Prepara tu CSV con las columnas: cliente_id, fecha, monto, categoria
2. En la web, haz clic en "Seleccionar CSV"
3. Elige tu archivo
4. ¡Los datos se cargan automáticamente!

---

## 🔮 Generar Pronósticos

### Configuración
- **Semanas**: 1 a 52 (default: 14)
- **Método**: Regresión lineal + estacionalidad
- **Confianza**: 95%

### Resultado
- Gráfico con histórico y pronóstico
- Intervalos de confianza
- Tabla de valores
- Exportable a CSV

---

## 💡 Tips Útiles

### Web
- 📱 Funciona en móvil
- 🔄 Recarga para resetear
- 💾 Datos se guardan en memoria
- 📊 Gráficos interactivos

### Python
- 🚀 Más rápido con datos grandes
- 🔌 API REST disponible
- 📈 Análisis avanzado
- 🔧 Configurable

---

## ❓ Preguntas Frecuentes

### ¿Qué formato de datos necesito?
CSV con columnas: cliente_id, fecha, monto, categoria

### ¿Cuántas semanas puedo pronosticar?
De 1 a 52 semanas (recomendado: 14)

### ¿Puedo usar mis propios datos?
Sí, carga un CSV con el formato correcto

### ¿Funciona sin internet?
Web: Sí (después de cargar)
Python: Sí

### ¿Qué navegadores soporta?
Chrome, Firefox, Safari, Edge (versiones recientes)

---

## 🚨 Solución Rápida de Problemas

### "Puerto ya en uso"
```bash
# Usa otro puerto
python -m http.server 8001
```

### "No se cargan los datos"
- Verifica el formato CSV
- Revisa que las columnas sean correctas
- Intenta con datos de ejemplo

### "Los gráficos no se muestran"
- Abre la consola (F12)
- Recarga la página
- Intenta otro navegador

---

## 📞 Contacto

¿Problemas? Revisa:
1. La consola del navegador (F12)
2. Los logs de la terminal
3. El formato de tus datos

---

## 🎓 Próximos Pasos

1. ✅ Ejecuta la aplicación
2. ✅ Carga datos de ejemplo
3. ✅ Explora los gráficos
4. ✅ Genera pronósticos
5. ✅ Exporta resultados
6. ✅ Carga tus propios datos
7. ✅ Analiza patrones
8. ✅ Toma decisiones

---

## 🎉 ¡Listo para Empezar!

Elige tu opción favorita y comienza a analizar datos:

**Web:** `cd web_project && python -m http.server 8000`

**Python:** `cd python_project && pip install -r requirements.txt && python app.py`

¡Que disfrutes! 🚀

