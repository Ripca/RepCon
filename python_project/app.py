"""
Forecasting de Categorías de Consumo - Aplicación Principal
Procesa TODOS los datos reales (~11.5M registros) de CSV, JSON y XML
Genera pronósticos con ARIMA y Regresión Lineal
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import plotly.graph_objects as go
import plotly.express as px
from data_processor import DataProcessor
from forecaster import Forecaster

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

print("\n" + "="*60)
print("🚀 INICIANDO APLICACIÓN DE PRONÓSTICO")
print("="*60)

# Inicializar procesador de datos
processor = DataProcessor('../data')
forecaster = Forecaster('../data')

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/api/data/summary')
def get_data_summary():
    """Obtener resumen de datos"""
    try:
        summary = processor.get_summary()
        return jsonify(summary)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/categories')
def get_categories():
    """Obtener categorías disponibles"""
    try:
        categories = processor.get_categories()
        return jsonify({'categories': categories})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/weekly/<category>')
def get_weekly_data(category):
    """Obtener datos semanales de una categoría"""
    try:
        data = processor.get_weekly_data(category)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/all-weekly')
def get_all_weekly():
    """Obtener todos los datos semanales"""
    try:
        data = processor.get_all_weekly_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/forecast', methods=['POST'])
def generate_forecast():
    """Generar pronóstico"""
    try:
        params = request.json
        category = params.get('category')
        weeks = params.get('weeks', 14)
        
        forecast_data = forecaster.forecast(category, weeks)
        return jsonify(forecast_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/forecast/all', methods=['POST'])
def generate_all_forecasts():
    """Generar pronósticos para todas las categorías"""
    try:
        params = request.json
        weeks = params.get('weeks', 14)
        
        all_forecasts = forecaster.forecast_all(weeks)
        return jsonify(all_forecasts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics/<category>')
def get_statistics(category):
    """Obtener estadísticas de una categoría"""
    try:
        stats = processor.get_statistics(category)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chart/timeseries/<category>')
def get_timeseries_chart(category):
    """Obtener gráfico de serie temporal"""
    try:
        data = processor.get_weekly_data(category)
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=data['dates'],
            y=data['values'],
            mode='lines+markers',
            name=category,
            line=dict(color='#1f77b4', width=2),
            marker=dict(size=6)
        ))
        
        fig.update_layout(
            title=f'Serie Temporal: {category}',
            xaxis_title='Fecha',
            yaxis_title='Monto (Q)',
            hovermode='x unified',
            template='plotly_white'
        )
        
        return jsonify(json.loads(fig.to_json()))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chart/comparison')
def get_comparison_chart():
    """Obtener gráfico comparativo de categorías"""
    try:
        data = processor.get_all_weekly_data()
        
        fig = go.Figure()
        for category, values in data.items():
            if category != 'dates':
                fig.add_trace(go.Scatter(
                    x=data['dates'],
                    y=values,
                    mode='lines',
                    name=category,
                    line=dict(width=2)
                ))
        
        fig.update_layout(
            title='Comparación de Categorías de Consumo',
            xaxis_title='Fecha',
            yaxis_title='Monto (Q)',
            hovermode='x unified',
            template='plotly_white',
            height=500
        )
        
        return jsonify(json.loads(fig.to_json()))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

