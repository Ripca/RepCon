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
from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
import plotly.graph_objects as go
import plotly.express as px
from data_processor import DataProcessor
from forecaster import Forecaster
from io import BytesIO

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
        categories_data = processor.get_categories()
        # Si ya es un diccionario con 'categories', devolverlo directamente
        if isinstance(categories_data, dict) and 'categories' in categories_data:
            return jsonify(categories_data)
        # Si es una lista, envolverla
        return jsonify({'categories': categories_data})
    except Exception as e:
        print(f"Error en get_categories: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/debug/categories')
def debug_categories():
    """Debug: Ver categorías reales"""
    try:
        cats = processor.categories
        return jsonify({'categories': cats, 'count': len(cats) if cats else 0})
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

@app.route('/api/download/forecast/<category>')
def download_forecast(category):
    """Descargar pronóstico como CSV"""
    try:
        forecast_data = forecaster.forecast(category, weeks=14)

        # Crear DataFrame con los datos
        df = pd.DataFrame({
            'Fecha': forecast_data['forecast_dates'],
            'Pronóstico': forecast_data['forecast_values'],
            'Límite Inferior': forecast_data.get('lower_bound', [None]*len(forecast_data['forecast_dates'])),
            'Límite Superior': forecast_data.get('upper_bound', [None]*len(forecast_data['forecast_dates']))
        })

        # Convertir a CSV
        csv_buffer = BytesIO()
        df.to_csv(csv_buffer, index=False, encoding='utf-8-sig')
        csv_buffer.seek(0)

        return send_file(
            csv_buffer,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'pronostico_{category}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/analysis/<category>')
def download_analysis(category):
    """Descargar análisis como CSV"""
    try:
        weekly_data = processor.get_weekly_data(category)

        df = pd.DataFrame({
            'Fecha': weekly_data['dates'],
            'Monto': weekly_data['values']
        })

        csv_buffer = BytesIO()
        df.to_csv(csv_buffer, index=False, encoding='utf-8-sig')
        csv_buffer.seek(0)

        return send_file(
            csv_buffer,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'analisis_{category}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/data')
def download_data():
    """Descargar todos los datos como CSV"""
    try:
        all_weekly = processor.get_all_weekly_data()

        # Convertir a formato de tabla
        dates = all_weekly['dates']
        categories = [k for k in all_weekly.keys() if k != 'dates']

        data = {'Fecha': dates}
        for cat in categories:
            data[cat] = all_weekly[cat]

        df = pd.DataFrame(data)

        csv_buffer = BytesIO()
        df.to_csv(csv_buffer, index=False, encoding='utf-8-sig')
        csv_buffer.seek(0)

        return send_file(
            csv_buffer,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'datos_completos_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

