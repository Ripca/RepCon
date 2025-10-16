/**
 * Aplicación Principal - Forecasting de Categorías de Consumo
 */

let charts = {};
let currentCategory = null;
let selectedCategories = new Set();
let dataTable = null;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación iniciada');
    loadSampleData();

    // Esperar a que se carguen los datos y luego generar pronósticos por defecto
    setTimeout(() => {
        generateAllForecasts();
    }, 500);
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
    const startDate = new Date('2022-01-01');

    for (let i = 0; i < 1000; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + Math.floor(Math.random() * 1095)); // 3 años
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
    updateYearFilter();
    updateCategoryCheckboxes();
    updateCategorySelect();
    updateTimeseriesChart();
    updateComparisonChart();
    updateDataTable();

    // Generar pronóstico por defecto
    const weeks = parseInt(document.getElementById('forecastWeeks').value) || 14;
    forecaster.forecastAll(weeks);

    const firstForecast = Object.values(forecaster.forecasts)[0];
    if (firstForecast) {
        updateForecastChart(firstForecast.category);
    }
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

    const startYear = summary.dateRange.start.getFullYear();
    const endYear = summary.dateRange.end.getFullYear();
    document.getElementById('statPeriod').textContent =
        startYear === endYear ? startYear : `${startYear}-${endYear}`;
}

/**
 * Actualiza filtro de años
 */
function updateYearFilter() {
    const summary = dataProcessor.getSummary();
    const startYear = summary.dateRange.start.getFullYear();
    const endYear = summary.dateRange.end.getFullYear();

    const yearSelect = document.getElementById('yearFilter');
    yearSelect.innerHTML = '<option value="">Todos los años</option>';

    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

/**
 * Actualiza checkboxes de categorías con colores dinámicos
 */
function updateCategoryCheckboxes() {
    const container = document.getElementById('categoryCheckboxes');
    container.innerHTML = '';

    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30b0fe',
        '#a8edea', '#fed6e3'
    ];

    // Limpiar categorías seleccionadas previas
    selectedCategories.clear();

    dataProcessor.categories.forEach((cat, idx) => {
        const div = document.createElement('div');
        div.className = 'category-checkbox';

        const color = colors[idx % colors.length];
        div.style.borderColor = color;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `cat-${idx}`;
        checkbox.value = cat;
        checkbox.checked = true; // TODAS MARCADAS POR DEFECTO
        checkbox.style.accentColor = color;
        checkbox.onchange = function() {
            if (this.checked) {
                selectedCategories.add(cat);
            } else {
                selectedCategories.delete(cat);
            }
            updateComparisonChart();
        };

        const label = document.createElement('label');
        label.htmlFor = `cat-${idx}`;
        label.textContent = cat;
        label.style.color = color;

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);

        // AGREGAR TODAS LAS CATEGORÍAS AL CONJUNTO
        selectedCategories.add(cat);
    });
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
 * Actualiza todos los gráficos (usado por filtro de año)
 */
function updateAllCharts() {
    updateComparisonChart();
    updateTimeseriesChart();
    updateDataTable();
}

/**
 * Selecciona una categoría
 */
function selectCategory(category) {
    currentCategory = category;
    document.getElementById('categorySelect').value = category;
    updateTimeseriesChart();
}

/**
 * Actualiza gráfico de serie temporal
 */
function updateTimeseriesChart() {
    const selectedValue = document.getElementById('categorySelect').value;
    const allData = dataProcessor.getAllWeeklyData();

    if (!allData.dates || allData.dates.length === 0) return;

    const ctx = document.getElementById('timeseriesChart').getContext('2d');

    if (charts.timeseries) {
        charts.timeseries.destroy();
    }

    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30b0fe',
        '#a8edea', '#fed6e3'
    ];

    // Si no hay selección, mostrar todas las categorías
    const categoriesToShow = selectedValue ? [selectedValue] : dataProcessor.categories;

    const datasets = categoriesToShow.map((cat, idx) => {
        const catIdx = dataProcessor.categories.indexOf(cat);
        return {
            label: cat,
            data: allData[cat],
            borderColor: colors[catIdx % colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3
        };
    });

    charts.timeseries = new Chart(ctx, {
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
                    labels: { font: { size: 11 } }
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

    // Usar solo categorías seleccionadas
    const categoriesToShow = selectedCategories.size > 0 ?
        Array.from(selectedCategories) :
        dataProcessor.categories;

    const datasets = categoriesToShow.map((cat, idx) => {
        const catIdx = dataProcessor.categories.indexOf(cat);
        return {
            label: cat,
            data: allData[cat],
            borderColor: colors[catIdx % colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3
        };
    });

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

    // Usar SweetAlert en lugar de mensaje en HTML
    Swal.fire({
        icon: 'success',
        title: '¡Pronósticos Generados!',
        text: `Se generaron pronósticos para ${weeks} semanas`,
        timer: 2000,
        showConfirmButton: false
    });
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
 * Actualiza tabla de datos con DataTable
 */
function updateDataTable() {
    const allData = dataProcessor.getAllWeeklyData();
    if (!allData.dates || allData.dates.length === 0) {
        console.warn('No hay datos para mostrar en la tabla');
        return;
    }

    const tbody = document.getElementById('tableBody');
    const headerRow = document.getElementById('tableHeaderRow');

    if (!tbody || !headerRow) {
        console.error('Elementos de tabla no encontrados');
        return;
    }

    // Limpiar tabla anterior
    tbody.innerHTML = '';
    headerRow.innerHTML = '';

    // Actualizar encabezado de tabla con todas las categorías
    const thFecha = document.createElement('th');
    thFecha.textContent = 'Fecha';
    headerRow.appendChild(thFecha);

    dataProcessor.categories.forEach(cat => {
        const th = document.createElement('th');
        th.textContent = cat;
        headerRow.appendChild(th);
    });

    // Agregar todas las filas
    allData.dates.forEach((date, dateIdx) => {
        const row = document.createElement('tr');

        // Celda de fecha
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        row.appendChild(dateCell);

        // Celdas de categorías
        dataProcessor.categories.forEach(cat => {
            const value = allData[cat][dateIdx] || 0;
            const cell = document.createElement('td');
            cell.textContent = 'Q ' + value.toLocaleString('es-GT', {maximumFractionDigits: 0});
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    console.log('Tabla actualizada con ' + allData.dates.length + ' filas');

    // Destruir DataTable anterior si existe
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
    }

    // Inicializar DataTable con pequeño delay
    setTimeout(() => {
        try {
            dataTable = $('#dataTable').DataTable({
                paging: true,
                pageLength: 10,
                searching: true,
                ordering: true,
                info: true,
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
                },
                columnDefs: [
                    { orderable: true, targets: 0 }
                ]
            });
            console.log('DataTable inicializado correctamente');
        } catch(e) {
            console.error('Error al inicializar DataTable:', e);
        }
    }, 100);
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
}

/**
 * Muestra mensaje con SweetAlert
 */
function showMessage(msg, type = 'info') {
    const iconMap = {
        'error': 'error',
        'success': 'success',
        'info': 'info'
    };

    Swal.fire({
        icon: iconMap[type] || 'info',
        title: type === 'error' ? 'Error' : 'Éxito',
        text: msg,
        timer: 2500,
        showConfirmButton: false
    });
}

/**
 * Actualiza el gráfico de pronóstico (versión mejorada para nueva UI)
 */
function updateForecastChart() {
    const allForecasts = forecaster.forecasts;
    if (Object.keys(allForecasts).length === 0) return;

    const firstCategory = Object.keys(allForecasts)[0];
    const forecast = allForecasts[firstCategory];

    const ctx = document.getElementById('forecastChart');
    if (!ctx) return;

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
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Pronóstico ARIMA',
                    data: [...Array(forecast.historicalDates.length).fill(null), ...forecast.forecastValues],
                    borderColor: '#2c5aa0',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#2c5aa0'
                },
                {
                    label: 'Intervalo Superior (95%)',
                    data: [...Array(forecast.historicalDates.length).fill(null), ...forecast.confidence.upper],
                    borderColor: 'rgba(44, 90, 160, 0.3)',
                    borderDash: [2, 2],
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Intervalo Inferior (95%)',
                    data: [...Array(forecast.historicalDates.length).fill(null), ...forecast.confidence.lower],
                    borderColor: 'rgba(44, 90, 160, 0.3)',
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
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * Actualiza el gráfico de comparación (versión mejorada para nueva UI)
 */
function updateComparisonChart() {
    const allData = dataProcessor.getAllWeeklyData();
    if (!allData.dates || allData.dates.length === 0) return;

    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;

    if (charts.comparison) {
        charts.comparison.destroy();
    }

    const colors = [
        '#0066cc', '#2c5aa0', '#1e3a5f', '#0052a3', '#1a2f4a',
        '#2d7a3e', '#c41e3a', '#d97706', '#f59e0b', '#10b981'
    ];

    // Usar solo categorías seleccionadas
    const categoriesToShow = selectedCategories.size > 0 ?
        Array.from(selectedCategories) :
        dataProcessor.categories;

    const datasets = categoriesToShow.map((cat, idx) => {
        const catIdx = dataProcessor.categories.indexOf(cat);
        return {
            label: cat,
            data: allData[cat],
            borderColor: colors[catIdx % colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3
        };
    });

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
 * Actualiza el horizonte de pronóstico
 */
function updateForecastHorizon() {
    const weeks = parseInt(document.getElementById('forecastWeeks').value) || 14;

    // Validar rango
    if (weeks < 1) {
        document.getElementById('forecastWeeks').value = 1;
        return;
    }
    if (weeks > 52) {
        document.getElementById('forecastWeeks').value = 52;
        return;
    }

    // Generar nuevos pronósticos con el nuevo horizonte
    generateAllForecasts();
}

/**
 * Genera todos los pronósticos
 */
function generateAllForecasts() {
    const weeks = parseInt(document.getElementById('forecastWeeks').value) || 14;

    if (Object.keys(dataProcessor.weeklyData).length === 0) {
        showMessage('Por favor carga datos primero', 'error');
        return;
    }

    try {
        forecaster.forecastAll(weeks);
        updateForecastChart();
        updateComparisonChart();
        console.log('✓ Pronósticos generados exitosamente');
    } catch(e) {
        console.error('Error al generar pronósticos:', e);
        showMessage('Error al generar pronósticos: ' + e.message, 'error');
    }
}

/**
 * Muestra mensajes (solo para errores, sin alertas de éxito)
 */
function showMessage(message, type) {
    // Solo mostrar mensajes de error, no de éxito
    if (type === 'success') {
        console.log('✓ ' + message);
        return;
    }

    const container = document.getElementById('errorContainer');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = 'error-message';

    let icon = 'fa-info-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';

    messageEl.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

    container.innerHTML = '';
    container.appendChild(messageEl);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}