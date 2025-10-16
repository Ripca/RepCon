"""
Módulo de Pronóstico - Genera predicciones de series temporales usando ARIMA
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import warnings
from data_processor import DataProcessor

# Suprimir advertencias de convergencia
warnings.filterwarnings('ignore')

class Forecaster:
    """Genera pronósticos para categorías de consumo usando ARIMA"""

    def __init__(self, data_path='../data'):
        self.processor = DataProcessor(data_path)
        self.models = {}
        self.arima_params = {}  # Almacenar parámetros ARIMA óptimos
    
    def forecast(self, category, weeks=14):
        """Genera pronóstico para una categoría usando ARIMA"""
        data = self.processor.get_weekly_data(category)

        if 'error' in data:
            return data

        dates = pd.to_datetime(data['dates'])
        values = np.array(data['values'])

        try:
            # Intentar usar ARIMA
            forecast_values, confidence = self._forecast_arima(values, weeks, category)
        except Exception as e:
            # Si ARIMA falla, usar fallback a regresión lineal
            print(f"ARIMA falló para {category}: {str(e)}. Usando regresión lineal.")
            forecast_values, confidence = self._forecast_linear(values, weeks)

        # Generar fechas futuras
        last_date = dates[-1]
        forecast_dates = [
            (last_date + timedelta(weeks=i+1)).strftime('%Y-%m-%d')
            for i in range(weeks)
        ]

        return {
            'category': category,
            'forecast_dates': forecast_dates,
            'forecast_values': forecast_values.tolist(),
            'historical_dates': data['dates'],
            'historical_values': data['values'],
            'confidence_interval': confidence
        }
    
    def forecast_all(self, weeks=14):
        """Genera pronósticos para todas las categorías"""
        categories = self.processor.get_categories()
        forecasts = {}
        
        for category in categories:
            forecasts[category] = self.forecast(category, weeks)
        
        return forecasts
    
    def _forecast_arima(self, values, weeks, category):
        """Genera pronóstico usando ARIMA"""
        # Determinar parámetros ARIMA óptimos
        p, d, q = self._find_arima_params(values, category)

        # Ajustar modelo ARIMA
        model = ARIMA(values, order=(p, d, q))
        results = model.fit()

        # Generar pronóstico
        forecast_result = results.get_forecast(steps=weeks)
        forecast_values = forecast_result.predicted_mean.values

        # Asegurar que no hay valores negativos
        forecast_values = np.maximum(forecast_values, 0)

        # Calcular intervalos de confianza
        confidence_intervals = forecast_result.conf_int(alpha=0.05)
        upper = np.maximum(confidence_intervals.iloc[:, 1].values, 0)
        lower = np.maximum(confidence_intervals.iloc[:, 0].values, 0)

        confidence = {
            'upper': upper.tolist(),
            'lower': lower.tolist()
        }

        return forecast_values, confidence

    def _forecast_linear(self, values, weeks):
        """Fallback: Genera pronóstico usando regresión lineal"""
        X = np.arange(len(values)).reshape(-1, 1)
        model = LinearRegression()
        model.fit(X, values)

        future_X = np.arange(len(values), len(values) + weeks).reshape(-1, 1)
        forecast_values = model.predict(future_X).flatten()
        forecast_values = np.maximum(forecast_values, 0)

        # Calcular intervalos de confianza
        residuals = values - model.predict(X).flatten()
        std = np.std(residuals)

        upper = forecast_values + 1.96 * std
        lower = np.maximum(forecast_values - 1.96 * std, 0)

        confidence = {
            'upper': upper.tolist(),
            'lower': lower.tolist()
        }

        return forecast_values, confidence

    def _find_arima_params(self, values, category):
        """Encuentra parámetros ARIMA óptimos usando AIC"""
        # Parámetros por defecto
        best_aic = np.inf
        best_params = (1, 1, 1)

        # Buscar parámetros óptimos (búsqueda limitada para velocidad)
        for p in range(0, 3):
            for d in range(0, 2):
                for q in range(0, 3):
                    try:
                        model = ARIMA(values, order=(p, d, q))
                        results = model.fit()

                        if results.aic < best_aic:
                            best_aic = results.aic
                            best_params = (p, d, q)
                    except:
                        continue

        # Almacenar parámetros encontrados
        self.arima_params[category] = best_params

        return best_params
    
    def export_forecast_csv(self, forecasts, filename='forecast.csv'):
        """Exporta pronósticos a CSV"""
        # Preparar datos
        forecast_dates = forecasts[list(forecasts.keys())[0]]['forecast_dates']
        
        data = {'fecha': forecast_dates}
        for category, forecast in forecasts.items():
            data[category] = forecast['forecast_values']
        
        df = pd.DataFrame(data)
        df.to_csv(filename, index=False)
        
        return filename

