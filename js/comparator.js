// ETF Comparator

// Comparator State
let selectedETFs = [];
let comparisonChart = null;
const MAX_ETFS = 5;

// Initialize Comparator
document.addEventListener('DOMContentLoaded', function() {
    initializeComparator();
});

function initializeComparator() {
    setupComparatorControls();
    loadFeaturedETFs();
    setupDragAndDrop();
}

// Setup Comparator Controls
function setupComparatorControls() {
    const searchInput = document.getElementById('comparatorSearch');
    const addETFBtn = document.getElementById('addETFBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const compareBtn = document.getElementById('compareBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchETFsForComparison, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addFirstSearchResult();
            }
        });
    }
    
    if (addETFBtn) {
        addETFBtn.addEventListener('click', addFirstSearchResult);
    }
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllETFs);
    }
    
    if (compareBtn) {
        compareBtn.addEventListener('click', generateComparison);
    }
}

// Search ETFs for Comparison
function searchETFsForComparison() {
    const query = document.getElementById('comparatorSearch')?.value;
    if (!query || query.length < 2) {
        hideSearchResults();
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        const results = mockETFDatabase.filter(etf => 
            etf.name.toLowerCase().includes(query.toLowerCase()) ||
            etf.isin.toLowerCase().includes(query.toLowerCase()) ||
            etf.ticker.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
        
        displaySearchResults(results);
    }, 100);
}

// Display Search Results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">Nessun ETF trovato</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    searchResults.innerHTML = results.map(etf => {
        // Safe value extraction with defaults
        const performance1Y = etf.performance1Y || 0;
        const performanceClass = performance1Y >= 0 ? 'positive' : 'negative';
        
        return `
            <div class="search-result-item" data-etf-id="${etf.id || etf.isin}" onclick="addETFToComparison('${etf.id || etf.isin}')">
                <div class="etf-info">
                    <div class="etf-name">${etf.name || 'N/A'}</div>
                    <div class="etf-details">
                        <span class="etf-ticker">${etf.ticker || 'N/A'}</span>
                        <span class="etf-ter">TER: ${etf.ter || 0}%</span>
                    </div>
                </div>
                <div class="etf-performance">
                    <span class="performance-1y ${performanceClass}">
                        ${formatPercentage(performance1Y)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    searchResults.style.display = 'block';
}

// Hide Search Results
function hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Add First Search Result
function addFirstSearchResult() {
    const firstResult = document.querySelector('.search-result-item');
    if (firstResult) {
        const etfId = firstResult.dataset.etfId;
        addETFToComparison(etfId);
    }
}

// Add ETF to Comparison
function addETFToComparison(etfId) {
    if (selectedETFs.length >= MAX_ETFS) {
        showToast(`Puoi confrontare massimo ${MAX_ETFS} ETF`, 'warning');
        return;
    }
    
    if (selectedETFs.find(etf => etf.id === etfId)) {
        showToast('ETF già aggiunto al confronto', 'warning');
        return;
    }
    
    const etf = mockETFDatabase.find(e => e.id === etfId);
    if (!etf) {
        showToast('ETF non trovato', 'error');
        return;
    }
    
    selectedETFs.push(etf);
    updateSelectedETFsList();
    hideSearchResults();
    clearSearchInput();
    
    showToast(`${etf.name} aggiunto al confronto`, 'success');
    
    // Auto-generate comparison if we have 2+ ETFs
    if (selectedETFs.length >= 2) {
        generateComparison();
    }
}

// Remove ETF from Comparison
function removeETFFromComparison(etfId) {
    selectedETFs = selectedETFs.filter(etf => etf.id !== etfId);
    updateSelectedETFsList();
    
    if (selectedETFs.length >= 2) {
        generateComparison();
    } else {
        clearComparison();
    }
    
    showToast('ETF rimosso dal confronto', 'info');
}

// Update Selected ETFs List
function updateSelectedETFsList() {
    const selectedList = document.getElementById('selectedETFs');
    if (!selectedList) return;
    
    if (selectedETFs.length === 0) {
        selectedList.innerHTML = '<div class="empty-state">Nessun ETF selezionato per il confronto</div>';
        return;
    }
    
    selectedList.innerHTML = selectedETFs.map(etf => `
        <div class="selected-etf-item" data-etf-id="${etf.id}" draggable="true">
            <div class="etf-info">
                <div class="etf-name">${etf.name}</div>
                <div class="etf-details">
                    <span class="etf-ticker">${etf.ticker}</span>
                    <span class="etf-isin">${etf.isin}</span>
                </div>
            </div>
            <div class="etf-actions">
                <button class="btn-icon" onclick="removeETFFromComparison('${etf.id}')" title="Rimuovi">
                    ✕
                </button>
            </div>
        </div>
    `).join('');
    
    // Update comparison button state
    updateComparisonButton();
}

// Update Comparison Button
function updateComparisonButton() {
    const compareBtn = document.getElementById('compareBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    if (compareBtn) {
        compareBtn.disabled = selectedETFs.length < 2;
        compareBtn.textContent = `Confronta ${selectedETFs.length} ETF`;
    }
    
    if (clearAllBtn) {
        clearAllBtn.disabled = selectedETFs.length === 0;
    }
}

// Clear All ETFs
function clearAllETFs() {
    selectedETFs = [];
    updateSelectedETFsList();
    clearComparison();
    showToast('Tutti gli ETF rimossi dal confronto', 'info');
}

// Clear Search Input
function clearSearchInput() {
    const searchInput = document.getElementById('comparatorSearch');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Generate Comparison
function generateComparison() {
    if (selectedETFs.length < 2) {
        showToast('Seleziona almeno 2 ETF per il confronto', 'warning');
        return;
    }
    
    const comparisonResults = document.getElementById('comparisonResults');
    if (comparisonResults) {
        showLoading(comparisonResults);
    }
    
    // Simulate API call for detailed comparison data
    setTimeout(() => {
        displayComparisonTable();
        displayComparisonChart();
        displayComparisonSummary();
        
        if (comparisonResults) {
            hideLoading(comparisonResults);
            comparisonResults.style.display = 'block';
        }
    }, 800);
}

// Display Comparison Table
function displayComparisonTable() {
    const tableContainer = document.getElementById('comparisonTable');
    if (!tableContainer) return;
    
    const metrics = [
        { key: 'name', label: 'Nome', type: 'text' },
        { key: 'ticker', label: 'Ticker', type: 'text' },
        { key: 'isin', label: 'ISIN', type: 'text' },
        { key: 'ter', label: 'TER (%)', type: 'percentage' },
        { key: 'aum', label: 'Patrimonio', type: 'currency' },
        { key: 'performance1Y', label: '1 Anno (%)', type: 'performance' },
        { key: 'performance3Y', label: '3 Anni (%)', type: 'performance' },
        { key: 'performance5Y', label: '5 Anni (%)', type: 'performance' },
        { key: 'volatility', label: 'Volatilità (%)', type: 'percentage' },
        { key: 'dividendYield', label: 'Dividend Yield (%)', type: 'percentage' },
        { key: 'replicationMethod', label: 'Replica', type: 'text' },
        { key: 'distributionPolicy', label: 'Distribuzione', type: 'text' }
    ];
    
    let tableHTML = `
        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th class="metric-header">Metrica</th>
                        ${selectedETFs.map(etf => `
                            <th class="etf-header">
                                <div class="etf-header-content">
                                    <div class="etf-name">${etf.name}</div>
                                    <div class="etf-ticker">${etf.ticker}</div>
                                </div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
    `;
    
    metrics.forEach(metric => {
        tableHTML += `
            <tr class="metric-row">
                <td class="metric-label">${metric.label}</td>
                ${selectedETFs.map(etf => {
                    const value = etf[metric.key];
                    const formattedValue = formatMetricValue(value, metric.type);
                    const cellClass = getCellClass(value, metric.type);
                    return `<td class="metric-value ${cellClass}">${formattedValue}</td>`;
                }).join('')}
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

// Format Metric Value
function formatMetricValue(value, type) {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
        case 'currency':
            return formatCurrency(value);
        case 'percentage':
            return `${value.toFixed(2)}%`;
        case 'performance':
            return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
        default:
            return value.toString();
    }
}

// Get Cell Class
function getCellClass(value, type) {
    if (type === 'performance') {
        return value >= 0 ? 'positive' : 'negative';
    }
    return '';
}

// Display Comparison Chart
function displayComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    // Generate historical performance data
    const performanceData = generatePerformanceData();
    
    comparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: selectedETFs.map((etf, index) => ({
                label: etf.ticker,
                data: performanceData.datasets[index],
                borderColor: getChartColor(index),
                backgroundColor: getChartColor(index, 0.1),
                fill: false,
                tension: 0.4
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Storica (5 Anni)'
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Periodo'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Performance (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `${value >= 0 ? '+' : ''}${value}%`;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Generate Performance Data
function generatePerformanceData() {
    const months = 60; // 5 years
    const labels = [];
    const datasets = [];
    
    // Generate month labels
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(date.toLocaleDateString('it-IT', { year: 'numeric', month: 'short' }));
    }
    
    // Generate performance data for each ETF
    selectedETFs.forEach(etf => {
        const data = [];
        let cumulativeReturn = 0;
        
        for (let i = 0; i < months; i++) {
            // Simulate monthly returns based on annual performance
            const monthlyReturn = (etf.performance5Y / 100) / 12 + (Math.random() - 0.5) * 0.02;
            cumulativeReturn += monthlyReturn;
            data.push(cumulativeReturn * 100);
        }
        
        datasets.push(data);
    });
    
    return { labels, datasets };
}

// Get Chart Color
function getChartColor(index, alpha = 1) {
    const colors = [
        `rgba(37, 99, 235, ${alpha})`,   // Blue
        `rgba(16, 185, 129, ${alpha})`,  // Green
        `rgba(245, 101, 101, ${alpha})`, // Red
        `rgba(251, 191, 36, ${alpha})`,  // Yellow
        `rgba(139, 92, 246, ${alpha})`   // Purple
    ];
    return colors[index % colors.length];
}

// Display Comparison Summary
function displayComparisonSummary() {
    const summaryContainer = document.getElementById('comparisonSummary');
    if (!summaryContainer) return;
    
    const analysis = analyzeETFs();
    
    summaryContainer.innerHTML = `
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-icon">🏆</div>
                <div class="summary-content">
                    <div class="summary-title">Migliore Performance</div>
                    <div class="summary-value">${analysis.bestPerformance.name}</div>
                    <div class="summary-detail">${formatPercentage(analysis.bestPerformance.performance1Y)} (1 anno)</div>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-icon">💰</div>
                <div class="summary-content">
                    <div class="summary-title">Costi Più Bassi</div>
                    <div class="summary-value">${analysis.lowestCost.name}</div>
                    <div class="summary-detail">TER: ${analysis.lowestCost.ter}%</div>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-icon">📊</div>
                <div class="summary-content">
                    <div class="summary-title">Maggiore Patrimonio</div>
                    <div class="summary-value">${analysis.largestAUM.name}</div>
                    <div class="summary-detail">${formatCurrency(analysis.largestAUM.aum)}</div>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-icon">⚖️</div>
                <div class="summary-content">
                    <div class="summary-title">Minore Volatilità</div>
                    <div class="summary-value">${analysis.lowestVolatility.name}</div>
                    <div class="summary-detail">${analysis.lowestVolatility.volatility}%</div>
                </div>
            </div>
        </div>
        
        <div class="recommendation-section">
            <h3>💡 Raccomandazione</h3>
            <div class="recommendation-content">
                ${generateRecommendation(analysis)}
            </div>
        </div>
    `;
}

// Analyze ETFs
function analyzeETFs() {
    return {
        bestPerformance: selectedETFs.reduce((best, etf) => 
            etf.performance1Y > best.performance1Y ? etf : best
        ),
        lowestCost: selectedETFs.reduce((lowest, etf) => 
            etf.ter < lowest.ter ? etf : lowest
        ),
        largestAUM: selectedETFs.reduce((largest, etf) => 
            etf.aum > largest.aum ? etf : largest
        ),
        lowestVolatility: selectedETFs.reduce((lowest, etf) => 
            etf.volatility < lowest.volatility ? etf : lowest
        )
    };
}

// Generate Recommendation
function generateRecommendation(analysis) {
    const recommendations = [];
    
    if (analysis.bestPerformance.performance1Y > 10) {
        recommendations.push(`<strong>${analysis.bestPerformance.ticker}</strong> ha mostrato la migliore performance nell'ultimo anno.`);
    }
    
    if (analysis.lowestCost.ter < 0.2) {
        recommendations.push(`<strong>${analysis.lowestCost.ticker}</strong> offre i costi più competitivi con un TER del ${analysis.lowestCost.ter}%.`);
    }
    
    if (analysis.largestAUM.aum > 1000000000) {
        recommendations.push(`<strong>${analysis.largestAUM.ticker}</strong> ha il patrimonio più elevato, indicando maggiore liquidità.`);
    }
    
    if (analysis.lowestVolatility.volatility < 15) {
        recommendations.push(`<strong>${analysis.lowestVolatility.ticker}</strong> presenta la volatilità più bassa, ideale per investitori conservativi.`);
    }
    
    if (recommendations.length === 0) {
        return 'Tutti gli ETF selezionati presentano caratteristiche interessanti. Considera i tuoi obiettivi di investimento per la scelta finale.';
    }
    
    return recommendations.join(' ');
}

// Clear Comparison
function clearComparison() {
    const comparisonResults = document.getElementById('comparisonResults');
    if (comparisonResults) {
        comparisonResults.style.display = 'none';
    }
    
    if (comparisonChart) {
        comparisonChart.destroy();
        comparisonChart = null;
    }
}

// Setup Drag and Drop
function setupDragAndDrop() {
    const selectedList = document.getElementById('selectedETFs');
    if (!selectedList) return;
    
    selectedList.addEventListener('dragstart', handleDragStart);
    selectedList.addEventListener('dragover', handleDragOver);
    selectedList.addEventListener('drop', handleDrop);
}

// Drag and Drop Handlers
let draggedElement = null;

function handleDragStart(e) {
    if (e.target.classList.contains('selected-etf-item')) {
        draggedElement = e.target;
        e.target.style.opacity = '0.5';
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    if (draggedElement && e.target.classList.contains('selected-etf-item')) {
        const draggedId = draggedElement.dataset.etfId;
        const targetId = e.target.dataset.etfId;
        
        if (draggedId !== targetId) {
            reorderETFs(draggedId, targetId);
        }
    }
    
    if (draggedElement) {
        draggedElement.style.opacity = '1';
        draggedElement = null;
    }
}

// Reorder ETFs
function reorderETFs(draggedId, targetId) {
    const draggedIndex = selectedETFs.findIndex(etf => etf.id === draggedId);
    const targetIndex = selectedETFs.findIndex(etf => etf.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedETF] = selectedETFs.splice(draggedIndex, 1);
        selectedETFs.splice(targetIndex, 0, draggedETF);
        updateSelectedETFsList();
        
        if (selectedETFs.length >= 2) {
            generateComparison();
        }
    }
}

// Load Featured ETFs
function loadFeaturedETFs() {
    const featuredContainer = document.getElementById('featuredETFs');
    if (!featuredContainer) return;
    
    const featuredETFs = mockETFDatabase.slice(0, 6);
    
    featuredContainer.innerHTML = `
        <h3>ETF Popolari</h3>
        <div class="featured-etfs-grid">
            ${featuredETFs.map(etf => `
                <div class="featured-etf-card" onclick="addETFToComparison('${etf.id}')">
                    <div class="etf-info">
                        <div class="etf-name">${etf.name}</div>
                        <div class="etf-ticker">${etf.ticker}</div>
                    </div>
                    <div class="etf-metrics">
                        <div class="metric">
                            <span class="metric-label">TER:</span>
                            <span class="metric-value">${etf.ter}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">1Y:</span>
                            <span class="metric-value ${etf.performance1Y >= 0 ? 'positive' : 'negative'}">
                                ${formatPercentage(etf.performance1Y)}
                            </span>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-primary">Aggiungi</button>
                </div>
            `).join('')}
        </div>
    `;
}

// Export Comparison
function exportComparison() {
    if (selectedETFs.length < 2) {
        showToast('Seleziona almeno 2 ETF per esportare il confronto', 'warning');
        return;
    }
    
    const csvData = generateComparisonCSV();
    downloadCSV(csvData, 'confronto-etf.csv');
    showToast('Confronto esportato con successo', 'success');
}

// Generate Comparison CSV
function generateComparisonCSV() {
    const headers = ['Metrica', ...selectedETFs.map(etf => etf.ticker)];
    const metrics = [
        ['Nome', ...selectedETFs.map(etf => etf.name)],
        ['ISIN', ...selectedETFs.map(etf => etf.isin)],
        ['TER (%)', ...selectedETFs.map(etf => etf.ter)],
        ['Patrimonio (€)', ...selectedETFs.map(etf => etf.aum)],
        ['Performance 1Y (%)', ...selectedETFs.map(etf => etf.performance1Y)],
        ['Performance 3Y (%)', ...selectedETFs.map(etf => etf.performance3Y)],
        ['Performance 5Y (%)', ...selectedETFs.map(etf => etf.performance5Y)],
        ['Volatilità (%)', ...selectedETFs.map(etf => etf.volatility)],
        ['Dividend Yield (%)', ...selectedETFs.map(etf => etf.dividendYield)]
    ];
    
    return [headers, ...metrics]
        .map(row => row.join(','))
        .join('\n');
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add export button to comparison results
document.addEventListener('DOMContentLoaded', function() {
    const comparisonResults = document.getElementById('comparisonResults');
    if (comparisonResults) {
        const exportButton = document.createElement('button');
        exportButton.className = 'btn btn-secondary export-btn';
        exportButton.textContent = '📥 Esporta Confronto';
        exportButton.onclick = exportComparison;
        exportButton.style.marginTop = '1rem';
        comparisonResults.appendChild(exportButton);
    }
});

// Add custom styles for comparator
const comparatorStyles = document.createElement('style');
comparatorStyles.textContent = `
    .search-result-item {
        padding: 0.75rem;
        border-bottom: 1px solid #e5e7eb;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .search-result-item:hover {
        background-color: #f3f4f6;
    }
    
    .selected-etf-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
        cursor: move;
    }
    
    .selected-etf-item:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .comparison-table-wrapper {
        overflow-x: auto;
        margin: 1rem 0;
    }
    
    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .comparison-table th {
        background-color: #f9fafb;
        font-weight: 600;
        color: #374151;
    }
    
    .etf-header-content {
        min-width: 120px;
    }
    
    .metric-value.positive {
        color: #059669;
    }
    
    .metric-value.negative {
        color: #dc2626;
    }
    
    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .summary-card {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .summary-icon {
        font-size: 2rem;
        margin-right: 1rem;
    }
    
    .summary-title {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.25rem;
    }
    
    .summary-value {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .summary-detail {
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .recommendation-section {
        background: #f0f9ff;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #2563eb;
    }
    
    .recommendation-content {
        color: #1e40af;
        line-height: 1.6;
    }
    
    .featured-etfs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .featured-etf-card {
        padding: 1rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .featured-etf-card:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }
    
    .export-btn {
        position: sticky;
        bottom: 1rem;
        z-index: 10;
    }
    
    @media (max-width: 768px) {
        .comparison-table {
            font-size: 0.875rem;
        }
        
        .summary-grid {
            grid-template-columns: 1fr;
        }
        
        .featured-etfs-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(comparatorStyles);