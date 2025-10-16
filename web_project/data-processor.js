/**
 * Procesador de Datos - Carga y procesamiento de datos
 */

class DataProcessor {
    constructor() {
        this.rawData = [];
        this.weeklyData = {};
        this.categories = [];
        this.dateRange = { start: null, end: null };
    }
    
    /**
     * Carga datos desde CSV
     */
    loadFromCSV(csvContent) {
        try {
            const lines = csvContent.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            
            this.rawData = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const record = {};
                
                headers.forEach((header, idx) => {
                    record[header] = values[idx];
                });
                
                // Normalizar datos
                if (record.fecha && record.monto && record.categoria) {
                    record.fecha = new Date(record.fecha);
                    record.monto = parseFloat(record.monto.replace(',', '.'));
                    record.categoria = record.categoria.toUpperCase();
                    
                    if (!isNaN(record.monto) && record.fecha instanceof Date && !isNaN(record.fecha)) {
                        this.rawData.push(record);
                    }
                }
            }
            
            this._processData();
            return true;
        } catch (e) {
            console.error('Error cargando CSV:', e);
            return false;
        }
    }
    
    /**
     * Procesa datos y agrega semanalmente
     */
    _processData() {
        if (this.rawData.length === 0) return;
        
        // Obtener categorías únicas
        this.categories = [...new Set(this.rawData.map(r => r.categoria))].sort();
        
        // Obtener rango de fechas
        const dates = this.rawData.map(r => r.fecha);
        this.dateRange.start = new Date(Math.min(...dates));
        this.dateRange.end = new Date(Math.max(...dates));
        
        // Agregar por semana
        this.weeklyData = {};
        
        this.categories.forEach(category => {
            this.weeklyData[category] = {};
            
            this.rawData
                .filter(r => r.categoria === category)
                .forEach(record => {
                    const weekStart = this._getWeekStart(record.fecha);
                    const weekKey = weekStart.toISOString().split('T')[0];
                    
                    if (!this.weeklyData[category][weekKey]) {
                        this.weeklyData[category][weekKey] = 0;
                    }
                    
                    this.weeklyData[category][weekKey] += record.monto;
                });
        });
    }
    
    /**
     * Obtiene el inicio de la semana (domingo)
     */
    _getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }
    
    /**
     * Obtiene resumen de datos
     */
    getSummary() {
        const totalAmount = this.rawData.reduce((sum, r) => sum + r.monto, 0);
        
        return {
            totalTransactions: this.rawData.length,
            totalAmount: totalAmount,
            categoriesCount: this.categories.length,
            dateRange: {
                start: this.dateRange.start,
                end: this.dateRange.end
            }
        };
    }
    
    /**
     * Obtiene datos semanales de una categoría
     */
    getWeeklyData(category) {
        if (!this.weeklyData[category]) return null;
        
        const data = this.weeklyData[category];
        const dates = Object.keys(data).sort();
        
        return {
            dates: dates,
            values: dates.map(d => data[d]),
            category: category
        };
    }
    
    /**
     * Obtiene todos los datos semanales
     */
    getAllWeeklyData() {
        const allDates = new Set();
        
        Object.values(this.weeklyData).forEach(categoryData => {
            Object.keys(categoryData).forEach(date => allDates.add(date));
        });
        
        const sortedDates = Array.from(allDates).sort();
        const result = { dates: sortedDates };
        
        this.categories.forEach(category => {
            result[category] = sortedDates.map(date => 
                this.weeklyData[category][date] || 0
            );
        });
        
        return result;
    }
    
    /**
     * Obtiene estadísticas de una categoría
     */
    getStatistics(category) {
        const data = this.getWeeklyData(category);
        if (!data) return null;
        
        const values = data.values;
        const sorted = [...values].sort((a, b) => a - b);
        
        return {
            count: values.length,
            mean: values.reduce((a, b) => a + b, 0) / values.length,
            median: sorted[Math.floor(sorted.length / 2)],
            min: Math.min(...values),
            max: Math.max(...values),
            std: this._calculateStd(values),
            total: values.reduce((a, b) => a + b, 0)
        };
    }
    
    /**
     * Calcula desviación estándar
     */
    _calculateStd(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }
}

// Crear instancia global
const dataProcessor = new DataProcessor();

