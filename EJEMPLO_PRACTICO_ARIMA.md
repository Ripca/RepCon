# 📚 EJEMPLO PRÁCTICO: CÓMO FUNCIONA ARIMA

## 🎯 ESCENARIO

Tenemos datos históricos de gasto en **ALIMENTACION** durante 20 semanas:

```
Semana 1:  5000
Semana 2:  5100
Semana 3:  5050
Semana 4:  5200
Semana 5:  5150
Semana 6:  5300
Semana 7:  5250
Semana 8:  5400
Semana 9:  5350
Semana 10: 5500
Semana 11: 5450
Semana 12: 5600
Semana 13: 5550
Semana 14: 5700
Semana 15: 5650
Semana 16: 5800
Semana 17: 5750
Semana 18: 5900
Semana 19: 5850
Semana 20: 6000
```

**Patrón observado:** Tendencia creciente con pequeñas fluctuaciones

---

## 🔍 PASO 1: ENCONTRAR PARÁMETROS ARIMA ÓPTIMOS

### Búsqueda en grid:
```
Probar todas las combinaciones:
p ∈ [0, 1, 2]
d ∈ [0, 1]
q ∈ [0, 1, 2]

Total: 3 × 2 × 3 = 18 combinaciones
```

### Calcular AIC para cada combinación:

```
ARIMA(0,0,0): AIC = 450.23
ARIMA(0,0,1): AIC = 445.12
ARIMA(0,0,2): AIC = 448.56
ARIMA(0,1,0): AIC = 440.89
ARIMA(0,1,1): AIC = 438.45  ← Mejor hasta ahora
ARIMA(0,1,2): AIC = 441.23
ARIMA(1,0,0): AIC = 442.34
ARIMA(1,0,1): AIC = 444.56
ARIMA(1,0,2): AIC = 447.89
ARIMA(1,1,0): AIC = 439.12
ARIMA(1,1,1): AIC = 436.78  ← ¡MEJOR!
ARIMA(1,1,2): AIC = 439.45
ARIMA(2,0,0): AIC = 443.67
ARIMA(2,0,1): AIC = 445.89
ARIMA(2,0,2): AIC = 449.12
ARIMA(2,1,0): AIC = 437.56
ARIMA(2,1,1): AIC = 438.90
ARIMA(2,1,2): AIC = 442.34
```

**Resultado:** `ARIMA(1,1,1)` con AIC = 436.78

---

## 🔄 PASO 2: DIFERENCIAR LOS DATOS (d=1)

### Datos originales:
```
5000, 5100, 5050, 5200, 5150, 5300, 5250, 5400, ...
```

### Primera diferencia (d=1):
```
Δy(t) = y(t) - y(t-1)

5100 - 5000 = 100
5050 - 5100 = -50
5200 - 5050 = 150
5150 - 5200 = -50
5300 - 5150 = 150
5250 - 5300 = -50
5400 - 5250 = 150
...

Resultado: [100, -50, 150, -50, 150, -50, 150, ...]
```

**Efecto:** Elimina la tendencia, hace los datos estacionarios

---

## 📊 PASO 3: AJUSTAR COMPONENTES AR Y MA

### Componente AR (p=1):
```
Usar Yule-Walker para calcular coeficiente φ₁

φ₁ = 0.45

Esto significa: El valor diferenciado de hoy depende 45% 
del valor diferenciado de ayer
```

### Componente MA (q=1):
```
Calcular coeficiente θ₁

θ₁ = 0.32

Esto significa: El error de hoy depende 32% del error de ayer
```

---

## 🔮 PASO 4: GENERAR PRONÓSTICO

### Fórmula ARIMA(1,1,1):
```
Δŷ(t) = φ₁ × Δy(t-1) + θ₁ × ε(t-1) + ε(t)

Donde:
- Δŷ(t) = valor diferenciado predicho
- φ₁ = 0.45 (coeficiente AR)
- Δy(t-1) = valor diferenciado anterior
- θ₁ = 0.32 (coeficiente MA)
- ε(t-1) = error anterior
- ε(t) = error actual (ruido)
```

### Predicción para Semana 21:

**Paso 1: Calcular diferencia predicha**
```
Δŷ(21) = 0.45 × Δy(20) + 0.32 × ε(20) + ε(21)
Δŷ(21) = 0.45 × 150 + 0.32 × 5 + 2
Δŷ(21) = 67.5 + 1.6 + 2
Δŷ(21) = 71.1
```

**Paso 2: Invertir la diferencia**
```
ŷ(21) = y(20) + Δŷ(21)
ŷ(21) = 6000 + 71.1
ŷ(21) = 6071.1
```

**Resultado:** Pronóstico para Semana 21 = **6071.1**

---

## 📈 PREDICCIONES PARA 14 SEMANAS

```
Semana 21: 6071.1
Semana 22: 6142.3
Semana 23: 6213.5
Semana 24: 6284.7
Semana 25: 6355.9
Semana 26: 6427.1
Semana 27: 6498.3
Semana 28: 6569.5
Semana 29: 6640.7
Semana 30: 6711.9
Semana 31: 6783.1
Semana 32: 6854.3
Semana 33: 6925.5
Semana 34: 6996.7
```

---

## 📊 INTERVALOS DE CONFIANZA (95%)

### Desviación estándar de residuales:
```
σ = 25.5
```

### Intervalo de confianza:
```
IC = Pronóstico ± 1.96 × σ
IC = Pronóstico ± 1.96 × 25.5
IC = Pronóstico ± 49.98
```

### Ejemplo para Semana 21:
```
Pronóstico: 6071.1
Límite superior: 6071.1 + 49.98 = 6121.08
Límite inferior: 6071.1 - 49.98 = 6021.12

Intervalo: [6021.12, 6121.08]
```

---

## 🎯 COMPARACIÓN: ARIMA vs REGRESIÓN LINEAL

### Regresión Lineal:
```
y = mx + b
y = 50x + 5000

Semana 21: 50 × 21 + 5000 = 6050
Semana 22: 50 × 22 + 5000 = 6100
Semana 23: 50 × 23 + 5000 = 6150
```

### ARIMA(1,1,1):
```
Semana 21: 6071.1  (captura mejor el patrón)
Semana 22: 6142.3  (más preciso)
Semana 23: 6213.5  (sigue la tendencia)
```

**Diferencia:** ARIMA captura mejor las fluctuaciones y patrones

---

## 📊 VISUALIZACIÓN

```
Datos históricos (línea azul):
6000 |                                    ●
5900 |                              ●
5800 |                        ●
5700 |                  ●
5600 |            ●
5500 |      ●
5400 |●
     └─────────────────────────────────────────
     1    5    10   15   20   25   30   35

Pronóstico ARIMA (línea roja):
6000 |                                    ●
5900 |                              ●
5800 |                        ●
5700 |                  ●
5600 |            ●
5500 |      ●
5400 |●
5300 |
5200 |
5100 |
5000 |
     └─────────────────────────────────────────
     1    5    10   15   20   25   30   35
                        ↑
                    Aquí comienza
                    el pronóstico
```

---

## ✅ VENTAJAS DE ARIMA EN ESTE EJEMPLO

1. ✅ **Captura la tendencia** - Detecta el crecimiento consistente
2. ✅ **Captura fluctuaciones** - Nota los patrones de ±50
3. ✅ **Más preciso** - Mejor que regresión lineal simple
4. ✅ **Intervalos realistas** - Refleja la incertidumbre
5. ✅ **Adaptable** - Se ajusta automáticamente a los datos

---

## 🔧 IMPLEMENTACIÓN EN CÓDIGO

### Python:
```python
from forecaster import Forecaster

forecaster = Forecaster()
forecast = forecaster.forecast('ALIMENTACION', weeks=14)

print(f"Parámetros ARIMA: {forecaster.arima_params['ALIMENTACION']}")
print(f"Pronóstico Semana 21: {forecast['forecast_values'][0]:.2f}")
print(f"Intervalo: [{forecast['confidence_interval']['lower'][0]:.2f}, "
      f"{forecast['confidence_interval']['upper'][0]:.2f}]")
```

### JavaScript:
```javascript
const data = [5000, 5100, 5050, 5200, ...]; // 20 valores
const model = new ARIMAModel(data, [1, 1, 1]);
model.fit();

const forecast = model.forecast(14);
const confidence = model.getConfidenceIntervals(forecast);

console.log(`Pronóstico Semana 21: ${forecast[0].toFixed(2)}`);
console.log(`Intervalo: [${confidence.lower[0].toFixed(2)}, ${confidence.upper[0].toFixed(2)}]`);
```

---

## 🎓 CONCLUSIÓN

Este ejemplo muestra cómo ARIMA:
1. ✅ Encuentra parámetros óptimos automáticamente
2. ✅ Diferencia los datos para hacerlos estacionarios
3. ✅ Captura dependencias temporales (AR)
4. ✅ Captura errores pasados (MA)
5. ✅ Genera pronósticos precisos
6. ✅ Calcula intervalos de confianza

**¡ARIMA es mucho más preciso que regresión lineal simple! 🚀**

