"""
Procesador de Datos - Carga y procesamiento de múltiples formatos
"""

import os
import pandas as pd
import numpy as np
import json
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path

class DataProcessor:
    """Procesa datos de múltiples formatos (CSV, JSON, XML)"""
    
    def __init__(self, data_path):
        self.data_path = data_path
        self.df = None
        self.weekly_data = None
        self.categories = None
        self._load_all_data()
    
    def _load_all_data(self):
        """Carga datos de todos los formatos disponibles"""
        dfs = []
        
        # Cargar CSV
        csv_path = os.path.join(self.data_path, 'csv')
        if os.path.exists(csv_path):
            for file in os.listdir(csv_path):
                if file.endswith('.csv'):
                    df = pd.read_csv(os.path.join(csv_path, file))
                    dfs.append(df)
        
        # Cargar JSON
        json_path = os.path.join(self.data_path, 'json')
        if os.path.exists(json_path):
            for file in os.listdir(json_path):
                if file.endswith('.json'):
                    with open(os.path.join(json_path, file), 'r') as f:
                        data = json.load(f)
                        df = pd.DataFrame(data)
                        dfs.append(df)
        
        # Cargar XML
        xml_path = os.path.join(self.data_path, 'xml')
        if os.path.exists(xml_path):
            for file in os.listdir(xml_path):
                if file.endswith('.xml'):
                    df = self._load_xml(os.path.join(xml_path, file))
                    if df is not None:
                        dfs.append(df)
        
        # Combinar todos los datos
        if dfs:
            self.df = pd.concat(dfs, ignore_index=True)
            self._normalize_data()
            self._aggregate_weekly()
    
    def _load_xml(self, filepath):
        """Carga datos desde archivo XML"""
        try:
            tree = ET.parse(filepath)
            root = tree.getroot()
            
            data = []
            for row in root.findall('row'):
                record = {}
                for child in row:
                    record[child.tag] = child.text
                data.append(record)
            
            return pd.DataFrame(data)
        except Exception as e:
            print(f"Error cargando XML {filepath}: {e}")
            return None
    
    def _normalize_data(self):
        """Normaliza los datos de diferentes fuentes"""
        # Normalizar nombres de columnas
        self.df.columns = self.df.columns.str.lower()
        
        # Convertir fecha a datetime
        if 'fecha' in self.df.columns:
            self.df['fecha'] = pd.to_datetime(self.df['fecha'], errors='coerce')
        
        # Convertir monto a float (manejar comas como separador decimal)
        if 'monto' in self.df.columns:
            self.df['monto'] = self.df['monto'].astype(str).str.replace(',', '.')
            self.df['monto'] = pd.to_numeric(self.df['monto'], errors='coerce')
        
        # Normalizar categorías
        if 'categoria' in self.df.columns:
            self.df['categoria'] = self.df['categoria'].str.strip().str.upper()
        
        # Eliminar filas con valores nulos
        self.df = self.df.dropna(subset=['fecha', 'monto', 'categoria'])
        
        # Obtener categorías únicas
        self.categories = sorted(self.df['categoria'].unique().tolist())
    
    def _aggregate_weekly(self):
        """Agrega datos a nivel semanal"""
        self.df['semana'] = self.df['fecha'].dt.to_period('W')
        
        self.weekly_data = self.df.groupby(['semana', 'categoria'])['monto'].sum().reset_index()
        self.weekly_data['fecha'] = self.weekly_data['semana'].dt.start_time
        self.weekly_data = self.weekly_data.sort_values('fecha')
    
    def get_summary(self):
        """Obtiene resumen de los datos"""
        if self.df is None:
            return {'error': 'No data loaded'}
        
        return {
            'total_transactions': len(self.df),
            'total_amount': float(self.df['monto'].sum()),
            'date_range': {
                'start': self.df['fecha'].min().isoformat(),
                'end': self.df['fecha'].max().isoformat()
            },
            'categories_count': len(self.categories),
            'categories': self.categories
        }
    
    def get_categories(self):
        """Obtiene lista de categorías"""
        return self.categories or []
    
    def get_weekly_data(self, category):
        """Obtiene datos semanales de una categoría"""
        if self.weekly_data is None:
            return {'error': 'No data available'}
        
        data = self.weekly_data[self.weekly_data['categoria'] == category.upper()]
        
        return {
            'category': category,
            'dates': data['fecha'].dt.strftime('%Y-%m-%d').tolist(),
            'values': data['monto'].tolist(),
            'statistics': {
                'mean': float(data['monto'].mean()),
                'std': float(data['monto'].std()),
                'min': float(data['monto'].min()),
                'max': float(data['monto'].max()),
                'total': float(data['monto'].sum())
            }
        }
    
    def get_all_weekly_data(self):
        """Obtiene todos los datos semanales"""
        if self.weekly_data is None:
            return {'error': 'No data available'}
        
        result = {'dates': []}
        dates = sorted(self.weekly_data['fecha'].unique())
        result['dates'] = [d.strftime('%Y-%m-%d') for d in dates]
        
        for category in self.categories:
            data = self.weekly_data[self.weekly_data['categoria'] == category]
            values = []
            for date in dates:
                val = data[data['fecha'] == date]['monto'].sum()
                values.append(float(val) if val > 0 else 0)
            result[category] = values
        
        return result
    
    def get_statistics(self, category):
        """Obtiene estadísticas de una categoría"""
        data = self.weekly_data[self.weekly_data['categoria'] == category.upper()]
        
        if len(data) == 0:
            return {'error': 'Category not found'}
        
        values = data['monto'].values
        
        return {
            'category': category,
            'count': len(data),
            'mean': float(np.mean(values)),
            'median': float(np.median(values)),
            'std': float(np.std(values)),
            'min': float(np.min(values)),
            'max': float(np.max(values)),
            'q25': float(np.percentile(values, 25)),
            'q75': float(np.percentile(values, 75)),
            'total': float(np.sum(values))
        }

