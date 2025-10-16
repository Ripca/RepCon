/**
 * Módulo de Pronóstico - Genera predicciones de series temporales usando ARIMA
 */

class Forecaster {
    constructor() {
        this.forecasts = {};
        this.arimaModels = {};
    }

    /**
     * Genera pronóstico para una categoría usando ARIMA
     */
    forecast(category, weeks = 14) {
        const data = dataProcessor.getWeeklyData(category);
        if (!data) return null;

        const values = data.values;
        const dates = data.dates;

        try {
            // Intentar usar ARIMA
            return this._forecastARIMA(category, values, dates, weeks);
        } catch (e) {
            console.warn(`ARIMA falló para ${category}: ${e.message}. Usando regresión lineal.`);
            // Fallback a regresión lineal
            return this._forecastLinear(category, values, dates, weeks);
        }
    }

    /**
     * Genera pronóstico usando ARIMA
     */
    _forecastARIMA(category, values, dates, weeks) {
        // Encontrar parámetros ARIMA óptimos
        const params = findOptimalARIMAParams(values, 2, 1, 2);

        // Crear y entrenar modelo ARIMA
        const model = new ARIMAModel(values, params);
        model.fit();

        // Generar pronóstico
        const forecastValues = model.forecast(weeks);

        // Calcular intervalos de confianza
        const confidence = model.getConfidenceIntervals(forecastValues);

        // Generar fechas futuras
        const forecastDates = [];
        const lastDate = new Date(dates[dates.length - 1]);

        for (let i = 1; i <= weeks; i++) {
            const futureDate = new Date(lastDate);
            futureDate.setDate(futureDate.getDate() + (i * 7));
            forecastDates.push(futureDate.toISOString().split('T')[0]);
        }

        // Almacenar modelo
        this.arimaModels[category] = { model, params };

        return {
            category: category,
            historicalDates: dates,
            historicalValues: values,
            forecastDates: forecastDates,
            forecastValues: forecastValues,
            confidence: confidence,
            method: 'ARIMA',
            arimaParams: params
        };
    }

    /**
     * Fallback: Genera pronóstico usando regresión lineal
     */
    _forecastLinear(category, values, dates, weeks) {
        const trend = this._calculateTrend(values);
        const seasonal = this._calculateSeasonal(values);

        // Generar pronóstico
        const forecastValues = [];
        const forecastDates = [];

        const lastDate = new Date(dates[dates.length - 1]);

        for (let i = 1; i <= weeks; i++) {
            const futureDate = new Date(lastDate);
            futureDate.setDate(futureDate.getDate() + (i * 7));

            const trendValue = trend.slope * (values.length + i) + trend.intercept;
            const seasonalValue = seasonal[i % seasonal.length];
            const forecastValue = Math.max(0, trendValue * (1 + seasonalValue));

            forecastValues.push(forecastValue);
            forecastDates.push(futureDate.toISOString().split('T')[0]);
        }

        // Calcular intervalos de confianza
        const confidence = this._calculateConfidence(values, forecastValues);

        return {
            category: category,
            historicalDates: dates,
            historicalValues: values,
            forecastDates: forecastDates,
            forecastValues: forecastValues,
            confidence: confidence,
            method: 'Linear Regression'
        };
    }
    
    /**
     * Genera pronósticos para todas las categorías
     */
    forecastAll(weeks = 14) {
        this.forecasts = {};
        
        dataProcessor.categories.forEach(category => {
            this.forecasts[category] = this.forecast(category, weeks);
        });
        
        return this.forecasts;
    }
    
    /**
     * Calcula tendencia usando regresión lineal
     */
    _calculateTrend(values) {
        const n = values.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = values;
        
        const xMean = x.reduce((a, b) => a + b) / n;
        const yMean = y.reduce((a, b) => a + b) / n;
        
        const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0);
        const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);
        
        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = yMean - slope * xMean;
        
        return { slope, intercept };
    }
    
    /**
     * Calcula componente estacional
     */
    _calculateSeasonal(values) {
        if (values.length < 4) {
            return [0, 0, 0, 0];
        }
        
        const seasonal = [];
        const period = Math.min(4, Math.floor(values.length / 4));
        
        for (let i = 0; i < period; i++) {
            let sum = 0;
            let count = 0;
            
            for (let j = i; j < values.length; j += period) {
                sum += values[j];
                count++;
            }
            
            const avg = sum / count;
            const mean = values.reduce((a, b) => a + b) / values.length;
            seasonal.push((avg - mean) / mean);
        }
        
        return seasonal;
    }
    
    /**
     * Calcula intervalos de confianza
     */
    _calculateConfidence(historical, forecast) {
        const residuals = this._calculateResiduals(historical);
        const std = Math.sqrt(residuals.reduce((sum, r) => sum + r * r, 0) / residuals.length);
        
        const upper = forecast.map(f => f + 1.96 * std);
        const lower = forecast.map(f => Math.max(0, f - 1.96 * std));
        
        return { upper, lower };
    }
    
    /**
     * Calcula residuales
     */
    _calculateResiduals(values) {
        const trend = this._calculateTrend(values);
        return values.map((v, i) => v - (trend.slope * i + trend.intercept));
    }
    
    /**
     * Exporta pronósticos a CSV
     */
    exportToCSV() {
        if (Object.keys(this.forecasts).length === 0) {
            return null;
        }
        
        const firstForecast = Object.values(this.forecasts)[0];
        const dates = firstForecast.forecastDates;
        
        let csv = 'fecha,' + Object.keys(this.forecasts).join(',') + '\n';
        
        dates.forEach((date, idx) => {
            let row = date;
            Object.values(this.forecasts).forEach(forecast => {
                row += ',' + forecast.forecastValues[idx].toFixed(2);
            });
            csv += row + '\n';
        });
        
        return csv;
    }
    
    /**
     * Descarga CSV
     */
    downloadCSV() {
        const csv = this.exportToCSV();
        if (!csv) return;
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'forecast_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Crear instancia global
const forecaster = new Forecaster();

