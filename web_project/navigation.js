/**
 * Sistema de Navegación - Gestiona las páginas del dashboard
 */

// Configuración de páginas
const pages = {
    dashboard: {
        title: 'Dashboard',
        subtitle: 'Análisis de predicción de consumo',
        icon: 'fa-home'
    },
    analysis: {
        title: 'Análisis',
        subtitle: 'Análisis detallado de series temporales',
        icon: 'fa-chart-bar'
    },
    forecast: {
        title: 'Pronósticos',
        subtitle: 'Predicciones ARIMA para 14 semanas',
        icon: 'fa-crystal-ball'
    },
    data: {
        title: 'Datos',
        subtitle: 'Tabla de datos históricos',
        icon: 'fa-table'
    },
    settings: {
        title: 'Configuración',
        subtitle: 'Configuración del sistema y modelo',
        icon: 'fa-cog'
    }
};

/**
 * Cambia a una página específica
 */
function switchPage(pageName, event) {
    if (event) {
        event.preventDefault();
    }

    // Ocultar todas las páginas
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar página seleccionada
    const pageElement = document.getElementById(`page-${pageName}`);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Actualizar título y subtítulo
    const pageConfig = pages[pageName];
    if (pageConfig) {
        document.getElementById('pageTitle').textContent = pageConfig.title;
        document.getElementById('pageSubtitle').textContent = pageConfig.subtitle;
    }

    // Actualizar gráficos si es necesario
    setTimeout(() => {
        if (pageName === 'dashboard') {
            updateDashboardCharts();
        } else if (pageName === 'analysis') {
            updateAnalysisCharts();
        } else if (pageName === 'forecast') {
            updateForecastCharts();
        }
    }, 100);
}

/**
 * Actualiza los gráficos del dashboard
 */
function updateDashboardCharts() {
    if (Object.keys(dataProcessor.weeklyData).length === 0) {
        return;
    }

    // Actualizar KPIs
    updateKPIs();

    // Actualizar gráficos
    updateTrendChart();
    updateTopCategoriesChart();
}

/**
 * Actualiza los KPIs
 */
function updateKPIs() {
    const categories = dataProcessor.categories;
    
    // Crecimiento promedio
    let totalGrowth = 0;
    categories.forEach(category => {
        const data = dataProcessor.getWeeklyData(category);
        if (data && data.values.length > 1) {
            const firstValue = data.values[0];
            const lastValue = data.values[data.values.length - 1];
            const growth = ((lastValue - firstValue) / firstValue) * 100;
            totalGrowth += growth;
        }
    });
    const avgGrowth = (totalGrowth / categories.length).toFixed(1);
    document.getElementById('kpiGrowth').textContent = avgGrowth + '%';

    // Categoría principal
    let topCategory = '-';
    let maxAmount = 0;
    categories.forEach(category => {
        const data = dataProcessor.getWeeklyData(category);
        if (data) {
            const total = data.values.reduce((a, b) => a + b, 0);
            if (total > maxAmount) {
                maxAmount = total;
                topCategory = category;
            }
        }
    });
    document.getElementById('kpiTopCategory').textContent = topCategory;

    // Período
    const allDates = [];
    categories.forEach(category => {
        const data = dataProcessor.getWeeklyData(category);
        if (data && data.dates.length > 0) {
            allDates.push(...data.dates);
        }
    });
    if (allDates.length > 0) {
        const minDate = new Date(Math.min(...allDates.map(d => new Date(d))));
        const maxDate = new Date(Math.max(...allDates.map(d => new Date(d))));
        const period = `${minDate.toLocaleDateString('es-ES')} - ${maxDate.toLocaleDateString('es-ES')}`;
        document.getElementById('kpiPeriod').textContent = period;
    }

    // Precisión ARIMA
    document.getElementById('kpiAccuracy').textContent = '8-12%';
}

/**
 * Actualiza el gráfico de tendencia
 */
function updateTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const categories = dataProcessor.categories.slice(0, 3);
    const datasets = [];
    const colors = ['#0066cc', '#2c5aa0', '#1e3a5f'];

    categories.forEach((category, idx) => {
        const data = dataProcessor.getWeeklyData(category);
        if (data) {
            datasets.push({
                label: category,
                data: data.values,
                borderColor: colors[idx],
                backgroundColor: colors[idx] + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            });
        }
    });

    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
    }

    window.trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataProcessor.getWeeklyData(categories[0])?.dates || [],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Actualiza el gráfico de top categorías
 */
function updateTopCategoriesChart() {
    const ctx = document.getElementById('topCategoriesChart');
    if (!ctx) return;

    const categories = dataProcessor.categories;
    const totals = [];

    categories.forEach(category => {
        const data = dataProcessor.getWeeklyData(category);
        if (data) {
            const total = data.values.reduce((a, b) => a + b, 0);
            totals.push({ category, total });
        }
    });

    totals.sort((a, b) => b.total - a.total);
    const topCategories = totals.slice(0, 5);

    if (window.topCategoriesChartInstance) {
        window.topCategoriesChartInstance.destroy();
    }

    window.topCategoriesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCategories.map(item => item.category),
            datasets: [{
                label: 'Monto Total (Q)',
                data: topCategories.map(item => item.total),
                backgroundColor: [
                    '#0066cc',
                    '#2c5aa0',
                    '#1e3a5f',
                    '#0052a3',
                    '#1a2f4a'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Actualiza los gráficos de análisis
 */
function updateAnalysisCharts() {
    updateTimeseriesChart();
    updateDistributionChart();
    updateMarketShareChart();
}

/**
 * Actualiza el gráfico de distribución
 */
function updateDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    const categories = dataProcessor.categories;
    const totals = [];

    categories.forEach(category => {
        const data = dataProcessor.getWeeklyData(category);
        if (data) {
            const total = data.values.reduce((a, b) => a + b, 0);
            totals.push(total);
        }
    });

    if (window.distributionChartInstance) {
        window.distributionChartInstance.destroy();
    }

    window.distributionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: totals,
                backgroundColor: [
                    '#0066cc', '#2c5aa0', '#1e3a5f', '#0052a3', '#1a2f4a',
                    '#2d7a3e', '#c41e3a', '#d97706', '#f59e0b', '#10b981'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Actualiza el gráfico de participación de mercado
 */
function updateMarketShareChart() {
    const ctx = document.getElementById('marketShareChart');
    if (!ctx) return;

    const categories = dataProcessor.categories;
    const totals = [];

    categories.forEach(category => {
        const data = dataProcessor.getWeeklyData(category);
        if (data) {
            const total = data.values.reduce((a, b) => a + b, 0);
            totals.push(total);
        }
    });

    const total = totals.reduce((a, b) => a + b, 0);
    const percentages = totals.map(t => ((t / total) * 100).toFixed(1));

    if (window.marketShareChartInstance) {
        window.marketShareChartInstance.destroy();
    }

    window.marketShareChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: percentages,
                backgroundColor: [
                    '#0066cc', '#2c5aa0', '#1e3a5f', '#0052a3', '#1a2f4a',
                    '#2d7a3e', '#c41e3a', '#d97706', '#f59e0b', '#10b981'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Actualiza los gráficos de pronóstico
 */
function updateForecastCharts() {
    updateForecastChart();
    updateComparisonChart();
}

/**
 * Guarda la configuración
 */
function saveSettings() {
    const weeks = document.getElementById('settingsForecastWeeks').value;
    const confidence = document.getElementById('settingsConfidence').value;
    const algorithm = document.getElementById('settingsAlgorithm').value;

    // Guardar en localStorage
    localStorage.setItem('forecastSettings', JSON.stringify({
        weeks: parseInt(weeks),
        confidence: parseFloat(confidence),
        algorithm: algorithm
    }));

    // Actualizar el algoritmo activo en la información del sistema
    const algorithmDisplay = algorithm === 'arima' ? 'ARIMA' : 'Regresión Lineal';
    document.querySelector('.info-value:nth-of-type(2)').textContent = algorithmDisplay;

    alert('Configuración guardada correctamente');
}

/**
 * Carga la configuración guardada
 */
function loadSettings() {
    const settings = localStorage.getItem('forecastSettings');
    if (settings) {
        const config = JSON.parse(settings);
        document.getElementById('settingsForecastWeeks').value = config.weeks;
        document.getElementById('settingsConfidence').value = config.confidence;
        document.getElementById('settingsAlgorithm').value = config.algorithm;

        // Actualizar el algoritmo activo en la información del sistema
        const algorithmDisplay = config.algorithm === 'arima' ? 'ARIMA' : 'Regresión Lineal';
        const infoValues = document.querySelectorAll('.info-value');
        if (infoValues.length > 1) {
            infoValues[1].textContent = algorithmDisplay;
        }
    }
}

// Cargar configuración al iniciar
document.addEventListener('DOMContentLoaded', loadSettings);

