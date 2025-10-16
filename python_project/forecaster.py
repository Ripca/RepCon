"""
Módulo de Pronóstico - Genera predicciones de series temporales
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from data_processor import DataProcessor

class Forecaster:
    """Genera pronósticos para categorías de consumo"""
    
    def __init__(self, data_path='../data'):
        self.processor = DataProcessor(data_path)
        self.models = {}
    
    def forecast(self, category, weeks=14):
        """Genera pronóstico para una categoría"""
        data = self.processor.get_weekly_data(category)
        
        if 'error' in data:
            return data
        
        dates = pd.to_datetime(data['dates'])
        values = np.array(data['values']).reshape(-1, 1)
        
        # Crear características (índice temporal)
        X = np.arange(len(values)).reshape(-1, 1)
        
        # Entrenar modelo simple (regresión lineal + tendencia)
        model = LinearRegression()
        model.fit(X, values)
        
        # Generar pronóstico
        future_X = np.arange(len(values), len(values) + weeks).reshape(-1, 1)
        forecast_values = model.predict(future_X)
        
        # Agregar componente estacional
        forecast_values = self._add_seasonality(forecast_values, values)
        
        # Generar fechas futuras
        last_date = dates[-1]
        forecast_dates = [
            (last_date + timedelta(weeks=i+1)).strftime('%Y-%m-%d')
            for i in range(weeks)
        ]
        
        return {
            'category': category,
            'forecast_dates': forecast_dates,
            'forecast_values': forecast_values.flatten().tolist(),
            'historical_dates': data['dates'],
            'historical_values': data['values'],
            'confidence_interval': self._calculate_confidence(forecast_values, values)
        }
    
    def forecast_all(self, weeks=14):
        """Genera pronósticos para todas las categorías"""
        categories = self.processor.get_categories()
        forecasts = {}
        
        for category in categories:
            forecasts[category] = self.forecast(category, weeks)
        
        return forecasts
    
    def _add_seasonality(self, forecast, historical):
        """Agrega componente estacional al pronóstico"""
        if len(historical) < 4:
            return forecast
        
        # Calcular promedio móvil para detectar tendencia
        trend = np.convolve(historical.flatten(), np.ones(4)/4, mode='valid')
        
        # Calcular desviación estacional
        seasonal_factor = 1.0 + (np.std(historical) / np.mean(historical)) * 0.1
        
        return forecast * seasonal_factor
    
    def _calculate_confidence(self, forecast, historical):
        """Calcula intervalos de confianza"""
        residuals = np.std(historical)
        
        upper = (forecast + 1.96 * residuals).flatten().tolist()
        lower = (forecast - 1.96 * residuals).flatten().tolist()
        lower = [max(0, x) for x in lower]  # No valores negativos
        
        return {
            'upper': upper,
            'lower': lower
        }
    
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

