/**
 * Implementación simplificada de ARIMA para JavaScript
 * Basada en el modelo AutoRegressive Integrated Moving Average
 */

class ARIMAModel {
    constructor(data, order = [1, 1, 1]) {
        this.data = data;
        this.p = order[0];  // AR (AutoRegressive)
        this.d = order[1];  // I (Integrated)
        this.q = order[2];  // MA (Moving Average)
        this.differenced = [];
        this.mean = 0;
        this.std = 0;
        this.ar_coeffs = [];
        this.ma_coeffs = [];
    }

    /**
     * Diferencia los datos d veces para hacerlos estacionarios
     */
    difference(data, times = 1) {
        let result = [...data];
        
        for (let t = 0; t < times; t++) {
            const diff = [];
            for (let i = 1; i < result.length; i++) {
                diff.push(result[i] - result[i - 1]);
            }
            result = diff;
        }
        
        return result;
    }

    /**
     * Invierte la diferencia para obtener valores originales
     */
    undifference(differenced, original, times = 1) {
        let result = [...differenced];
        
        for (let t = 0; t < times; t++) {
            const undiff = [original[original.length - 1]];
            
            for (let i = 0; i < result.length; i++) {
                undiff.push(undiff[undiff.length - 1] + result[i]);
            }
            
            result = undiff.slice(1);
        }
        
        return result;
    }

    /**
     * Calcula coeficientes AR usando Yule-Walker
     */
    fitAR(data) {
        if (this.p === 0) return [];
        
        const n = data.length;
        const mean = data.reduce((a, b) => a + b) / n;
        const centered = data.map(x => x - mean);
        
        // Calcular autocorrelaciones
        const acf = [];
        for (let k = 0; k <= this.p; k++) {
            let sum = 0;
            for (let i = k; i < n; i++) {
                sum += centered[i] * centered[i - k];
            }
            acf.push(sum / n);
        }
        
        // Resolver sistema Yule-Walker (simplificado)
        const coeffs = [];
        for (let i = 1; i <= this.p; i++) {
            coeffs.push(acf[i] / acf[0]);
        }
        
        return coeffs;
    }

    /**
     * Calcula coeficientes MA
     */
    fitMA(residuals) {
        if (this.q === 0) return [];
        
        const n = residuals.length;
        const mean = residuals.reduce((a, b) => a + b) / n;
        const centered = residuals.map(x => x - mean);
        
        // Calcular autocorrelaciones de residuales
        const acf = [];
        for (let k = 0; k <= this.q; k++) {
            let sum = 0;
            for (let i = k; i < n; i++) {
                sum += centered[i] * centered[i - k];
            }
            acf.push(sum / n);
        }
        
        // Coeficientes MA simplificados
        const coeffs = [];
        for (let i = 1; i <= this.q; i++) {
            coeffs.push(acf[i] / acf[0]);
        }
        
        return coeffs;
    }

    /**
     * Entrena el modelo ARIMA
     */
    fit() {
        // Diferenciar datos
        this.differenced = this.difference(this.data, this.d);
        
        // Calcular media y desviación estándar
        this.mean = this.differenced.reduce((a, b) => a + b) / this.differenced.length;
        const variance = this.differenced.reduce((sum, x) => sum + Math.pow(x - this.mean, 2), 0) / this.differenced.length;
        this.std = Math.sqrt(variance);
        
        // Ajustar componentes AR y MA
        this.ar_coeffs = this.fitAR(this.differenced);
        
        // Calcular residuales para MA
        const residuals = this._calculateResiduals();
        this.ma_coeffs = this.fitMA(residuals);
        
        return this;
    }

    /**
     * Calcula residuales del modelo
     */
    _calculateResiduals() {
        const residuals = [];
        
        for (let i = this.p; i < this.differenced.length; i++) {
            let pred = this.mean;
            
            // Componente AR
            for (let j = 0; j < this.p; j++) {
                if (i - j - 1 >= 0) {
                    pred += this.ar_coeffs[j] * (this.differenced[i - j - 1] - this.mean);
                }
            }
            
            residuals.push(this.differenced[i] - pred);
        }
        
        return residuals;
    }

    /**
     * Genera pronóstico
     */
    forecast(steps = 14) {
        const forecasts = [];
        let lastDifferenced = [...this.differenced];
        
        for (let step = 0; step < steps; step++) {
            let pred = this.mean;
            
            // Componente AR
            for (let j = 0; j < this.p; j++) {
                if (lastDifferenced.length - j - 1 >= 0) {
                    pred += this.ar_coeffs[j] * (lastDifferenced[lastDifferenced.length - j - 1] - this.mean);
                }
            }
            
            // Componente MA (simplificado)
            for (let j = 0; j < this.q; j++) {
                pred += this.ma_coeffs[j] * (Math.random() - 0.5) * this.std;
            }
            
            forecasts.push(pred);
            lastDifferenced.push(pred);
        }
        
        // Invertir diferencias
        const undifferenced = this.undifference(forecasts, this.data, this.d);
        
        // Asegurar valores positivos
        return undifferenced.map(x => Math.max(0, x));
    }

    /**
     * Calcula intervalos de confianza
     */
    getConfidenceIntervals(forecast, confidence = 0.95) {
        const z = 1.96; // Para 95% de confianza
        const residuals = this._calculateResiduals();
        const std = Math.sqrt(residuals.reduce((sum, r) => sum + r * r, 0) / residuals.length);
        
        const upper = forecast.map(f => f + z * std);
        const lower = forecast.map(f => Math.max(0, f - z * std));
        
        return { upper, lower };
    }
}

/**
 * Función auxiliar para encontrar parámetros ARIMA óptimos
 */
function findOptimalARIMAParams(data, maxP = 2, maxD = 1, maxQ = 2) {
    let bestAIC = Infinity;
    let bestParams = [1, 1, 1];
    
    for (let p = 0; p <= maxP; p++) {
        for (let d = 0; d <= maxD; d++) {
            for (let q = 0; q <= maxQ; q++) {
                try {
                    const model = new ARIMAModel(data, [p, d, q]);
                    model.fit();
                    
                    // Calcular AIC simplificado
                    const residuals = model._calculateResiduals();
                    const sse = residuals.reduce((sum, r) => sum + r * r, 0);
                    const k = p + d + q;
                    const aic = 2 * k + data.length * Math.log(sse / data.length);
                    
                    if (aic < bestAIC) {
                        bestAIC = aic;
                        bestParams = [p, d, q];
                    }
                } catch (e) {
                    // Ignorar errores en combinaciones inválidas
                }
            }
        }
    }
    
    return bestParams;
}

