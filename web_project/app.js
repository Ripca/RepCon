/**
 * Aplicación Principal - Forecasting de Categorías de Consumo
 */

let charts = {};
let currentCategory = null;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación iniciada');
    loadSampleData();
});

/**
 * Carga datos de ejemplo
 */
function loadSampleData() {
    // Generar datos de ejemplo
    const categories = [
        'ALIMENTACION', 'TRANSPORTE', 'ENTRETENIMIENTO', 'EDUCACION',
        'CUIDADO PERSONAL', 'VIAJES', 'COMPRAS EN LINEA', 'HOGAR',
        'TECNOLOGIA', 'ABASTECIMIENTO'
    ];
    
    let csv = 'cliente_id,fecha,monto,categoria\n';
    const startDate = new Date('2023-01-01');
    
    for (let i = 0; i < 1000; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + Math.floor(Math.random() * 365));
        const category = categories[Math.floor(Math.random() * categories.length)];
        const amount = (Math.random() * 15000 + 100).toFixed(2);
        const clientId = 'C' + String(Math.floor(Math.random() * 200000)).padStart(6, '0');
        
        csv += `${clientId},${date.toISOString().split('T')[0]},${amount},${category}\n`;
    }
    
    dataProcessor.loadFromCSV(csv);
    updateUI();
}

/**
 * Maneja carga de archivo
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        if (dataProcessor.loadFromCSV(csv)) {
            showMessage('Datos cargados exitosamente', 'success');
            updateUI();
        } else {
            showMessage('Error al cargar los datos', 'error');
        }
    };
    reader.readAsText(file);
}

/**
 * Actualiza la interfaz
 */
function updateUI() {
    updateStats();
    updateCategoryList();
    updateCategorySelect();
    updateComparisonChart();
    updateDataTable();
}

/**
 * Actualiza estadísticas
 */
function updateStats() {
    const summary = dataProcessor.getSummary();
    
    document.getElementById('statTransactions').textContent = 
        summary.totalTransactions.toLocaleString();
    document.getElementById('statAmount').textContent = 
        'Q ' + summary.totalAmount.toLocaleString('es-GT', {maximumFractionDigits: 0});
    document.getElementById('statCategories').textContent = 
        summary.categoriesCount;
    document.getElementById('statPeriod').textContent = 
        summary.dateRange.start.getFullYear();
}

/**
 * Actualiza lista de categorías
 */
function updateCategoryList() {
    const list = document.getElementById('categoryList');
    list.innerHTML = dataProcessor.categories.map((cat, idx) => 
        `<li onclick="selectCategory('${cat}')" class="${idx === 0 ? 'active' : ''}">${cat}</li>`
    ).join('');
    
    if (dataProcessor.categories.length > 0 && !currentCategory) {
        currentCategory = dataProcessor.categories[0];
    }
}

/**
 * Actualiza selector de categorías
 */
function updateCategorySelect() {
    const select = document.getElementById('categorySelect');
    select.innerHTML = '<option value="">Todas las categorías</option>' +
        dataProcessor.categories.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('');
}

/**
 * Selecciona una categoría
 */
function selectCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('categorySelect').value = category;
    updateTimeseriesChart();
}

/**
 * Actualiza gráfico de serie temporal
 */
function updateTimeseriesChart() {
    const category = document.getElementById('categorySelect').value || currentCategory;
    if (!category) return;
    
    const data = dataProcessor.getWeeklyData(category);
    if (!data) return;
    
    const ctx = document.getElementById('timeseriesChart').getContext('2d');
    
    if (charts.timeseries) {
        charts.timeseries.destroy();
    }
    
    charts.timeseries = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: category,
                data: data.values,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: { size: 12 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Monto (Q)' }
                }
            }
        }
    });
}

/**
 * Actualiza gráfico de comparación
 */
function updateComparisonChart() {
    const allData = dataProcessor.getAllWeeklyData();
    if (!allData.dates || allData.dates.length === 0) return;
    
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    
    if (charts.comparison) {
        charts.comparison.destroy();
    }
    
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30b0fe',
        '#a8edea', '#fed6e3'
    ];
    
    const datasets = dataProcessor.categories.map((cat, idx) => ({
        label: cat,
        data: allData[cat],
        borderColor: colors[idx % colors.length],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3
    }));
    
    charts.comparison = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allData.dates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { font: { size: 11 }, padding: 15 }
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
 * Genera pronósticos
 */
function generateAllForecasts() {
    const weeks = parseInt(document.getElementById('forecastWeeks').value) || 14;
    forecaster.forecastAll(weeks);
    
    const firstForecast = Object.values(forecaster.forecasts)[0];
    if (!firstForecast) return;
    
    const category = firstForecast.category;
    updateForecastChart(category);
    showMessage(`Pronósticos generados para ${weeks} semanas`, 'success');
}

/**
 * Actualiza gráfico de pronóstico
 */
function updateForecastChart(category) {
    const forecast = forecaster.forecasts[category];
    if (!forecast) return;
    
    const ctx = document.getElementById('forecastChart').getContext('2d');
    
    if (charts.forecast) {
        charts.forecast.destroy();
    }
    
    charts.forecast = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...forecast.historicalDates, ...forecast.forecastDates],
            datasets: [
                {
                    label: 'Histórico',
                    data: [...forecast.historicalValues, ...Array(forecast.forecastDates.length).fill(null)],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Pronóstico',
                    data: [...Array(forecast.historicalDates.length).fill(null), ...forecast.forecastValues],
                    borderColor: '#764ba2',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#764ba2'
                },
                {
                    label: 'Intervalo Superior',
                    data: [...Array(forecast.historicalDates.length).fill(null), ...forecast.confidence.upper],
                    borderColor: 'rgba(118, 75, 162, 0.3)',
                    borderDash: [2, 2],
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Intervalo Inferior',
                    data: [...Array(forecast.historicalDates.length).fill(null), ...forecast.confidence.lower],
                    borderColor: 'rgba(118, 75, 162, 0.3)',
                    borderDash: [2, 2],
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * Actualiza tabla de datos
 */
function updateDataTable() {
    const allData = dataProcessor.getAllWeeklyData();
    if (!allData.dates || allData.dates.length === 0) return;
    
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    allData.dates.slice(-20).reverse().forEach(date => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${date}</td>`;
        
        dataProcessor.categories.forEach(cat => {
            const idx = allData.dates.indexOf(date);
            const value = allData[cat][idx] || 0;
            row.innerHTML += `<td>Q ${value.toLocaleString('es-GT', {maximumFractionDigits: 2})}</td>`;
        });
        
        tbody.appendChild(row);
    });
    
    // Actualizar encabezado de tabla
    const header = document.getElementById('tableHeader');
    header.textContent = dataProcessor.categories.join(' / ');
}

/**
 * Exporta resultados
 */
function exportResults() {
    if (Object.keys(forecaster.forecasts).length === 0) {
        showMessage('Genera pronósticos primero', 'error');
        return;
    }
    
    forecaster.downloadCSV();
    showMessage('Archivo descargado exitosamente', 'success');
}

/**
 * Muestra mensaje
 */
function showMessage(msg, type = 'info') {
    const container = document.getElementById('errorContainer');
    const div = document.createElement('div');
    div.className = type === 'error' ? 'error' : 'success';
    div.textContent = msg;
    container.appendChild(div);
    
    setTimeout(() => div.remove(), 4000);
}

