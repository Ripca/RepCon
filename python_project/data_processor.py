"""
Procesador de Datos - Carga y procesamiento de múltiples formatos
Procesa TODOS los datos reales (~11.5M registros) de CSV, JSON y XML
"""

import os
import pandas as pd
import numpy as np
import json
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
import pickle
import time
import unicodedata

class DataProcessor:
    """Procesa datos de múltiples formatos (CSV, JSON, XML)"""

    @staticmethod
    def _remove_accents(text):
        """Remueve tildes y acentos de un texto"""
        if pd.isna(text):
            return text
        text = str(text)
        nfkd_form = unicodedata.normalize('NFKD', text)
        return ''.join([c for c in nfkd_form if not unicodedata.combining(c)])

    def __init__(self, data_path):
        self.data_path = data_path
        self.df = None
        self.weekly_data = None
        self.categories = None
        self.cache_file = os.path.join(data_path, '.cache_data.pkl')

        # Intentar cargar desde caché
        if os.path.exists(self.cache_file):
            print("📦 Cargando datos desde caché...")
            self._load_from_cache()
        else:
            print("📂 Cargando datos de archivos (primera vez, puede tardar ~1-2 minutos)...")
            self._load_all_data()
            self._save_to_cache()

    def _load_all_data(self):
        """Carga datos de todos los formatos disponibles"""
        dfs = []

        # Cargar CSV
        csv_path = os.path.join(self.data_path, 'csv')
        if os.path.exists(csv_path):
            print("  📄 Cargando CSV...")
            for file in sorted(os.listdir(csv_path)):
                if file.endswith('.csv'):
                    print(f"    - {file}")
                    df = pd.read_csv(os.path.join(csv_path, file))
                    dfs.append(df)

        # Cargar JSON
        json_path = os.path.join(self.data_path, 'json')
        if os.path.exists(json_path):
            print("  📋 Cargando JSON...")
            for file in sorted(os.listdir(json_path)):
                if file.endswith('.json'):
                    print(f"    - {file}")
                    with open(os.path.join(json_path, file), 'r') as f:
                        data = json.load(f)
                        df = pd.DataFrame(data)
                        dfs.append(df)

        # Cargar XML
        xml_path = os.path.join(self.data_path, 'xml')
        if os.path.exists(xml_path):
            print("  🔗 Cargando XML...")
            for file in sorted(os.listdir(xml_path)):
                if file.endswith('.xml'):
                    print(f"    - {file}")
                    df = self._load_xml(os.path.join(xml_path, file))
                    if df is not None:
                        dfs.append(df)

        # Combinar todos los datos
        if dfs:
            print(f"  ✓ Combinando {len(dfs)} archivos...")
            self.df = pd.concat(dfs, ignore_index=True)
            print(f"  ✓ Total de registros: {len(self.df):,}")
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
            print(f"    ⚠️ Error cargando XML {filepath}: {e}")
            return None
    
    def _normalize_data(self):
        """Normaliza los datos de diferentes fuentes"""
        print("  🔄 Normalizando datos...")

        # Normalizar nombres de columnas
        self.df.columns = self.df.columns.str.lower()

        # Convertir fecha a datetime
        if 'fecha' in self.df.columns:
            self.df['fecha'] = pd.to_datetime(self.df['fecha'], errors='coerce')

        # Convertir monto a float (manejar comas como separador decimal)
        if 'monto' in self.df.columns:
            self.df['monto'] = self.df['monto'].astype(str).str.replace(',', '.')
            self.df['monto'] = pd.to_numeric(self.df['monto'], errors='coerce')

        # Normalizar categorías: remover tildes, espacios múltiples y convertir a mayúsculas
        if 'categoria' in self.df.columns:
            self.df['categoria'] = self.df['categoria'].apply(
                lambda x: ' '.join(self._remove_accents(x).strip().upper().split())
            )

        # Eliminar filas con valores nulos
        initial_count = len(self.df)
        self.df = self.df.dropna(subset=['fecha', 'monto', 'categoria'])
        removed = initial_count - len(self.df)
        print(f"  ✓ Registros válidos: {len(self.df):,} (removidos: {removed:,})")

        # Obtener categorías únicas
        self.categories = sorted(self.df['categoria'].unique().tolist())
        print(f"  ✓ Categorías encontradas: {len(self.categories)}")
        print(f"  ✓ Categorías: {', '.join(self.categories)}")

    def _aggregate_weekly(self):
        """Agrega datos a nivel semanal"""
        print("  📊 Agregando datos por semana...")

        self.df['semana'] = self.df['fecha'].dt.to_period('W')

        self.weekly_data = self.df.groupby(['semana', 'categoria'])['monto'].sum().reset_index()
        self.weekly_data['fecha'] = self.weekly_data['semana'].dt.start_time
        self.weekly_data = self.weekly_data.sort_values('fecha')

        print(f"  ✓ Semanas procesadas: {self.weekly_data['semana'].nunique()}")

    def _save_to_cache(self):
        """Guarda datos procesados en caché"""
        try:
            with open(self.cache_file, 'wb') as f:
                pickle.dump({
                    'df': self.df,
                    'weekly_data': self.weekly_data,
                    'categories': self.categories
                }, f)
            print("  💾 Datos guardados en caché")
        except Exception as e:
            print(f"  ⚠️ Error guardando caché: {e}")

    def _load_from_cache(self):
        """Carga datos desde caché"""
        try:
            with open(self.cache_file, 'rb') as f:
                cache = pickle.load(f)
                self.df = cache['df']
                self.weekly_data = cache['weekly_data']
                self.categories = cache['categories']
            print(f"  ✓ Datos cargados: {len(self.df):,} registros")
        except Exception as e:
            print(f"  ⚠️ Error cargando caché: {e}")
            self._load_all_data()
            self._save_to_cache()
    
    def get_summary(self):
        """Obtiene resumen de los datos"""
        if self.df is None:
            return {'error': 'No data loaded'}

        return {
            'total_transactions': len(self.df),
            'total_amount': float(self.df['monto'].sum()),
            'num_categories': len(self.categories),
            'date_range': {
                'start': self.df['fecha'].min().isoformat(),
                'end': self.df['fecha'].max().isoformat()
            },
            'categories': self.categories
        }
    
    def get_categories(self):
        """Obtiene lista de categorías"""
        return {'categories': self.categories or []}
    
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

