// ETF Details and Fact Sheets

// ETF Details State
let currentETF = null;
let performanceChart = null;
let compositionChart = null;
let etfDetailsModal = null;

// Initialize ETF Details
document.addEventListener('DOMContentLoaded', function() {
    initializeETFDetails();
});

function initializeETFDetails() {
    setupETFDetailsModal();
    setupETFDetailsControls();
    loadFeaturedETFDetails();
}

// Setup ETF Details Modal
function setupETFDetailsModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('etfDetailsModal')) {
        const modal = document.createElement('div');
        modal.id = 'etfDetailsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content etf-details-content">
                <div class="modal-header">
                    <h2 id="etfDetailsTitle">Dettagli ETF</h2>
                    <button class="modal-close" onclick="closeETFDetails()">&times;</button>
                </div>
                <div class="modal-body" id="etfDetailsBody">
                    <!-- ETF details content will be loaded here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    etfDetailsModal = document.getElementById('etfDetailsModal');
    
    // Close modal when clicking outside
    etfDetailsModal.addEventListener('click', function(e) {
        if (e.target === etfDetailsModal) {
            closeETFDetails();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && etfDetailsModal.style.display === 'block') {
            closeETFDetails();
        }
    });
}

// Setup ETF Details Controls
function setupETFDetailsControls() {
    // Add click handlers to ETF cards throughout the site
    document.addEventListener('click', function(e) {
        const etfCard = e.target.closest('[data-etf-id]');
        if (etfCard && e.target.closest('.view-details-btn')) {
            e.preventDefault();
            const etfId = etfCard.dataset.etfId;
            showETFDetails(etfId);
        }
    });
}

// Show ETF Details
function showETFDetails(etfId) {
    const etf = mockETFDatabase.find(e => e.id === etfId);
    if (!etf) {
        showToast('ETF non trovato', 'error');
        return;
    }
    
    currentETF = etf;
    
    // Show modal
    etfDetailsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Update title
    document.getElementById('etfDetailsTitle').textContent = etf.name;
    
    // Show loading state
    const modalBody = document.getElementById('etfDetailsBody');
    showLoading(modalBody);
    
    // Simulate API call to load detailed data
    setTimeout(() => {
        loadETFDetailedData(etf);
        hideLoading(modalBody);
    }, 800);
}

// Close ETF Details
function closeETFDetails() {
    etfDetailsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Destroy charts
    if (performanceChart) {
        performanceChart.destroy();
        performanceChart = null;
    }
    if (compositionChart) {
        compositionChart.destroy();
        compositionChart = null;
    }
    
    currentETF = null;
}

// Load ETF Detailed Data
function loadETFDetailedData(etf) {
    const modalBody = document.getElementById('etfDetailsBody');
    
    // Generate detailed ETF data
    const detailedData = generateDetailedETFData(etf);
    
    modalBody.innerHTML = `
        <div class="etf-details-container">
            <!-- ETF Header -->
            <div class="etf-header">
                <div class="etf-main-info">
                    <div class="etf-name">${etf.name}</div>
                    <div class="etf-ticker-isin">
                        <span class="etf-ticker">${etf.ticker}</span>
                        <span class="etf-isin">ISIN: ${etf.isin}</span>
                    </div>
                    <div class="etf-description">${detailedData.description}</div>
                </div>
                <div class="etf-key-metrics">
                    <div class="key-metric">
                        <div class="metric-value ${etf.performance1Y >= 0 ? 'positive' : 'negative'}">
                            ${formatPercentage(etf.performance1Y)}
                        </div>
                        <div class="metric-label">Performance 1Y</div>
                    </div>
                    <div class="key-metric">
                        <div class="metric-value">${etf.ter}%</div>
                        <div class="metric-label">TER</div>
                    </div>
                    <div class="key-metric">
                        <div class="metric-value">${formatCurrency(etf.aum)}</div>
                        <div class="metric-label">Patrimonio</div>
                    </div>
                </div>
            </div>
            
            <!-- ETF Navigation Tabs -->
            <div class="etf-tabs">
                <button class="tab-button active" onclick="showETFTab('overview')">Panoramica</button>
                <button class="tab-button" onclick="showETFTab('performance')">Performance</button>
                <button class="tab-button" onclick="showETFTab('composition')">Composizione</button>
                <button class="tab-button" onclick="showETFTab('details')">Dettagli</button>
                <button class="tab-button" onclick="showETFTab('documents')">Documenti</button>
            </div>
            
            <!-- Tab Content -->
            <div class="etf-tab-content">
                <div id="overview-tab" class="tab-panel active">
                    ${generateOverviewTab(etf, detailedData)}
                </div>
                <div id="performance-tab" class="tab-panel">
                    ${generatePerformanceTab(etf, detailedData)}
                </div>
                <div id="composition-tab" class="tab-panel">
                    ${generateCompositionTab(etf, detailedData)}
                </div>
                <div id="details-tab" class="tab-panel">
                    ${generateDetailsTab(etf, detailedData)}
                </div>
                <div id="documents-tab" class="tab-panel">
                    ${generateDocumentsTab(etf, detailedData)}
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="etf-actions">
                <button class="btn btn-primary" onclick="addToWatchlist('${etf.id}')">
                    ⭐ Aggiungi a Watchlist
                </button>
                <button class="btn btn-secondary" onclick="addETFToComparison('${etf.id}')">
                    📊 Confronta
                </button>
                <button class="btn btn-secondary" onclick="addETFToPortfolio('${etf.id}')">
                    💼 Aggiungi a Portafoglio
                </button>
                <button class="btn btn-secondary" onclick="shareETF('${etf.id}')">
                    🔗 Condividi
                </button>
            </div>
        </div>
    `;
    
    // Initialize charts after content is loaded
    setTimeout(() => {
        initializeETFCharts(etf, detailedData);
    }, 100);
}

// Generate Detailed ETF Data
function generateDetailedETFData(etf) {
    return {
        description: `${etf.name} è un ETF che replica l'indice ${etf.benchmark || 'di riferimento'} attraverso ${etf.replicationMethod}. L'ETF offre esposizione diversificata al mercato ${etf.region} con focus sul settore ${etf.sector}.`,
        benchmark: etf.benchmark || `${etf.sector} Index`,
        inception: generateInceptionDate(),
        domicile: 'Irlanda',
        currency: 'EUR',
        tradingCurrency: 'EUR',
        nav: generateNAV(etf),
        premium: (Math.random() - 0.5) * 0.4, // Premium/discount to NAV
        volume: Math.floor(Math.random() * 1000000) + 100000,
        holdings: generateHoldings(etf),
        topCountries: generateTopCountries(etf),
        topSectors: generateTopSectors(etf),
        performanceHistory: generatePerformanceHistory(etf),
        riskMetrics: generateRiskMetrics(etf),
        distributions: generateDistributions(etf),
        costs: generateCostBreakdown(etf),
        documents: generateDocuments(etf)
    };
}

// Generate Overview Tab
function generateOverviewTab(etf, data) {
    return `
        <div class="overview-content">
            <div class="overview-grid">
                <div class="overview-section">
                    <h3>Informazioni Generali</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Benchmark:</span>
                            <span class="info-value">${data.benchmark}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Data di Lancio:</span>
                            <span class="info-value">${data.inception}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Domicilio:</span>
                            <span class="info-value">${data.domicile}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Valuta:</span>
                            <span class="info-value">${data.currency}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Replica:</span>
                            <span class="info-value">${etf.replicationMethod}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Distribuzione:</span>
                            <span class="info-value">${etf.distributionPolicy}</span>
                        </div>
                    </div>
                </div>
                
                <div class="overview-section">
                    <h3>Metriche di Trading</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">NAV:</span>
                            <span class="info-value">${formatCurrency(data.nav)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Premium/Sconto:</span>
                            <span class="info-value ${data.premium >= 0 ? 'positive' : 'negative'}">
                                ${data.premium >= 0 ? '+' : ''}${data.premium.toFixed(3)}%
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Volume Medio:</span>
                            <span class="info-value">${data.volume.toLocaleString('it-IT')}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Dividend Yield:</span>
                            <span class="info-value">${etf.dividendYield}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="quick-stats">
                <h3>Performance Rapida</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-period">1 Mese</div>
                        <div class="stat-value positive">+2.1%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-period">3 Mesi</div>
                        <div class="stat-value positive">+5.8%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-period">6 Mesi</div>
                        <div class="stat-value positive">+8.4%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-period">1 Anno</div>
                        <div class="stat-value ${etf.performance1Y >= 0 ? 'positive' : 'negative'}">
                            ${formatPercentage(etf.performance1Y)}
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-period">3 Anni</div>
                        <div class="stat-value ${etf.performance3Y >= 0 ? 'positive' : 'negative'}">
                            ${formatPercentage(etf.performance3Y)}
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-period">5 Anni</div>
                        <div class="stat-value ${etf.performance5Y >= 0 ? 'positive' : 'negative'}">
                            ${formatPercentage(etf.performance5Y)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate Performance Tab
function generatePerformanceTab(etf, data) {
    return `
        <div class="performance-content">
            <div class="chart-container">
                <canvas id="etfPerformanceChart" width="400" height="200"></canvas>
            </div>
            
            <div class="performance-metrics">
                <div class="metrics-grid">
                    <div class="metric-section">
                        <h4>Metriche di Rischio</h4>
                        <div class="risk-metrics">
                            <div class="risk-item">
                                <span class="risk-label">Volatilità (1Y):</span>
                                <span class="risk-value">${etf.volatility}%</span>
                            </div>
                            <div class="risk-item">
                                <span class="risk-label">Sharpe Ratio:</span>
                                <span class="risk-value">${data.riskMetrics.sharpeRatio}</span>
                            </div>
                            <div class="risk-item">
                                <span class="risk-label">Max Drawdown:</span>
                                <span class="risk-value negative">${data.riskMetrics.maxDrawdown}%</span>
                            </div>
                            <div class="risk-item">
                                <span class="risk-label">Beta:</span>
                                <span class="risk-value">${data.riskMetrics.beta}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-section">
                        <h4>Performance Annualizzata</h4>
                        <div class="annual-performance">
                            <div class="annual-item">
                                <span class="annual-period">1 Anno:</span>
                                <span class="annual-value ${etf.performance1Y >= 0 ? 'positive' : 'negative'}">
                                    ${formatPercentage(etf.performance1Y)}
                                </span>
                            </div>
                            <div class="annual-item">
                                <span class="annual-period">3 Anni:</span>
                                <span class="annual-value ${etf.performance3Y >= 0 ? 'positive' : 'negative'}">
                                    ${formatPercentage(etf.performance3Y / 3)}
                                </span>
                            </div>
                            <div class="annual-item">
                                <span class="annual-period">5 Anni:</span>
                                <span class="annual-value ${etf.performance5Y >= 0 ? 'positive' : 'negative'}">
                                    ${formatPercentage(etf.performance5Y / 5)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate Composition Tab
function generateCompositionTab(etf, data) {
    return `
        <div class="composition-content">
            <div class="composition-charts">
                <div class="chart-section">
                    <h4>Top 10 Holdings</h4>
                    <div class="holdings-list">
                        ${data.holdings.map(holding => `
                            <div class="holding-item">
                                <div class="holding-info">
                                    <div class="holding-name">${holding.name}</div>
                                    <div class="holding-sector">${holding.sector}</div>
                                </div>
                                <div class="holding-weight">${holding.weight}%</div>
                                <div class="holding-bar">
                                    <div class="holding-fill" style="width: ${holding.weight * 2}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="chart-section">
                    <h4>Allocazione Geografica</h4>
                    <canvas id="etfCompositionChart" width="300" height="300"></canvas>
                </div>
            </div>
            
            <div class="sector-allocation">
                <h4>Allocazione Settoriale</h4>
                <div class="sectors-grid">
                    ${data.topSectors.map(sector => `
                        <div class="sector-allocation-item">
                            <div class="sector-info">
                                <span class="sector-name">${sector.name}</span>
                                <span class="sector-weight">${sector.weight}%</span>
                            </div>
                            <div class="sector-bar">
                                <div class="sector-fill" style="width: ${sector.weight}%; background-color: ${getSectorColor(sector.name)}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Generate Details Tab
function generateDetailsTab(etf, data) {
    return `
        <div class="details-content">
            <div class="details-sections">
                <div class="detail-section">
                    <h4>Struttura dei Costi</h4>
                    <div class="costs-breakdown">
                        <div class="cost-item">
                            <span class="cost-label">TER (Total Expense Ratio):</span>
                            <span class="cost-value">${etf.ter}%</span>
                        </div>
                        <div class="cost-item">
                            <span class="cost-label">Commissioni di Gestione:</span>
                            <span class="cost-value">${data.costs.managementFee}%</span>
                        </div>
                        <div class="cost-item">
                            <span class="cost-label">Altri Costi:</span>
                            <span class="cost-value">${data.costs.otherCosts}%</span>
                        </div>
                        <div class="cost-item">
                            <span class="cost-label">Costo Annuo su €10.000:</span>
                            <span class="cost-value">${formatCurrency(10000 * etf.ter / 100)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Informazioni Legali</h4>
                    <div class="legal-info">
                        <div class="legal-item">
                            <span class="legal-label">Società di Gestione:</span>
                            <span class="legal-value">${data.managementCompany || 'Vanguard Asset Management'}</span>
                        </div>
                        <div class="legal-item">
                            <span class="legal-label">Depositario:</span>
                            <span class="legal-value">${data.custodian || 'State Street Custodial Services'}</span>
                        </div>
                        <div class="legal-item">
                            <span class="legal-label">Struttura Legale:</span>
                            <span class="legal-value">UCITS ETF</span>
                        </div>
                        <div class="legal-item">
                            <span class="legal-label">Frequenza NAV:</span>
                            <span class="legal-value">Giornaliera</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Distribuzione Dividendi</h4>
                    <div class="distributions-table">
                        <div class="distribution-header">
                            <span>Data</span>
                            <span>Importo</span>
                            <span>Tipo</span>
                        </div>
                        ${data.distributions.map(dist => `
                            <div class="distribution-row">
                                <span>${dist.date}</span>
                                <span>${formatCurrency(dist.amount)}</span>
                                <span>${dist.type}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate Documents Tab
function generateDocumentsTab(etf, data) {
    return `
        <div class="documents-content">
            <div class="documents-grid">
                ${data.documents.map(doc => `
                    <div class="document-item">
                        <div class="document-icon">${getDocumentIcon(doc.type)}</div>
                        <div class="document-info">
                            <div class="document-name">${doc.name}</div>
                            <div class="document-description">${doc.description}</div>
                            <div class="document-meta">
                                <span class="document-size">${doc.size}</span>
                                <span class="document-date">${doc.date}</span>
                            </div>
                        </div>
                        <div class="document-actions">
                            <button class="btn btn-sm btn-primary" onclick="downloadDocument('${doc.url}')">
                                📥 Download
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Show ETF Tab
function showETFTab(tabName) {
    // Hide all tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(`${tabName}-tab`);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to selected tab button
    event.target.classList.add('active');
    
    // Initialize charts if needed
    if (tabName === 'performance' && currentETF) {
        setTimeout(() => initializePerformanceChart(currentETF), 100);
    } else if (tabName === 'composition' && currentETF) {
        setTimeout(() => initializeCompositionChart(currentETF), 100);
    }
}

// Initialize ETF Charts
function initializeETFCharts(etf, data) {
    // Performance chart will be initialized when tab is shown
    // Composition chart will be initialized when tab is shown
}

// Initialize Performance Chart
function initializePerformanceChart(etf) {
    const ctx = document.getElementById('etfPerformanceChart');
    if (!ctx || performanceChart) return;
    
    const performanceData = generatePerformanceHistory(etf);
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [{
                label: etf.ticker,
                data: performanceData.values,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
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
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Performance: ${context.parsed.y >= 0 ? '+' : ''}${context.parsed.y.toFixed(2)}%`;
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
            }
        }
    });
}

// Initialize Composition Chart
function initializeCompositionChart(etf) {
    const ctx = document.getElementById('etfCompositionChart');
    if (!ctx || compositionChart) return;
    
    const data = generateDetailedETFData(etf);
    
    compositionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.topCountries.map(country => country.name),
            datasets: [{
                data: data.topCountries.map(country => country.weight),
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

// Utility Functions for Data Generation
function generateInceptionDate() {
    const years = Math.floor(Math.random() * 15) + 5; // 5-20 years ago
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date.toLocaleDateString('it-IT');
}

function generateNAV(etf) {
    return 50 + Math.random() * 100; // Random NAV between 50-150
}

function generateHoldings(etf) {
    const holdings = [
        { name: 'Apple Inc', sector: 'Technology', weight: 8.5 },
        { name: 'Microsoft Corp', sector: 'Technology', weight: 7.2 },
        { name: 'Amazon.com Inc', sector: 'Consumer Discretionary', weight: 6.8 },
        { name: 'Alphabet Inc', sector: 'Technology', weight: 5.9 },
        { name: 'Tesla Inc', sector: 'Consumer Discretionary', weight: 4.3 },
        { name: 'Meta Platforms', sector: 'Technology', weight: 3.7 },
        { name: 'NVIDIA Corp', sector: 'Technology', weight: 3.2 },
        { name: 'Berkshire Hathaway', sector: 'Financial Services', weight: 2.8 },
        { name: 'Johnson & Johnson', sector: 'Healthcare', weight: 2.5 },
        { name: 'JPMorgan Chase', sector: 'Financial Services', weight: 2.1 }
    ];
    return holdings;
}

function generateTopCountries(etf) {
    return [
        { name: 'Stati Uniti', weight: 65.2 },
        { name: 'Giappone', weight: 8.7 },
        { name: 'Regno Unito', weight: 4.3 },
        { name: 'Francia', weight: 3.8 },
        { name: 'Germania', weight: 3.2 },
        { name: 'Canada', weight: 2.9 },
        { name: 'Svizzera', weight: 2.1 },
        { name: 'Altri', weight: 9.8 }
    ];
}

function generateTopSectors(etf) {
    return [
        { name: 'Technology', weight: 28.5 },
        { name: 'Financial Services', weight: 15.2 },
        { name: 'Healthcare', weight: 12.8 },
        { name: 'Consumer Discretionary', weight: 11.3 },
        { name: 'Industrials', weight: 8.7 },
        { name: 'Consumer Staples', weight: 6.9 },
        { name: 'Energy', weight: 5.4 },
        { name: 'Utilities', weight: 4.2 },
        { name: 'Real Estate', weight: 3.8 },
        { name: 'Materials', weight: 3.2 }
    ];
}

function generatePerformanceHistory(etf) {
    const months = 60; // 5 years
    const labels = [];
    const values = [];
    
    const now = new Date();
    let cumulativeReturn = 0;
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(date.toLocaleDateString('it-IT', { year: 'numeric', month: 'short' }));
        
        // Simulate monthly returns
        const monthlyReturn = (etf.performance5Y / 100) / 12 + (Math.random() - 0.5) * 0.03;
        cumulativeReturn += monthlyReturn;
        values.push(cumulativeReturn * 100);
    }
    
    return { labels, values };
}

function generateRiskMetrics(etf) {
    return {
        sharpeRatio: (0.5 + Math.random() * 1.5).toFixed(2),
        maxDrawdown: (5 + Math.random() * 20).toFixed(1),
        beta: (0.8 + Math.random() * 0.4).toFixed(2)
    };
}

function generateDistributions(etf) {
    return [
        { date: '2024-12-15', amount: 0.45, type: 'Dividendo' },
        { date: '2024-09-15', amount: 0.42, type: 'Dividendo' },
        { date: '2024-06-15', amount: 0.38, type: 'Dividendo' },
        { date: '2024-03-15', amount: 0.41, type: 'Dividendo' }
    ];
}

function generateCostBreakdown(etf) {
    const managementFee = etf.ter * 0.8;
    const otherCosts = etf.ter * 0.2;
    return {
        managementFee: managementFee.toFixed(3),
        otherCosts: otherCosts.toFixed(3)
    };
}

function generateDocuments(etf) {
    return [
        {
            name: 'Prospetto Informativo',
            description: 'Documento completo con tutte le informazioni sull\'ETF',
            type: 'pdf',
            size: '2.3 MB',
            date: '2024-01-15',
            url: '#'
        },
        {
            name: 'Scheda Prodotto (KIID)',
            description: 'Informazioni chiave per gli investitori',
            type: 'pdf',
            size: '156 KB',
            date: '2024-01-15',
            url: '#'
        },
        {
            name: 'Report Annuale',
            description: 'Relazione annuale e bilancio',
            type: 'pdf',
            size: '4.7 MB',
            date: '2023-12-31',
            url: '#'
        },
        {
            name: 'Holdings Completi',
            description: 'Lista completa delle partecipazioni',
            type: 'excel',
            size: '89 KB',
            date: '2024-01-31',
            url: '#'
        }
    ];
}

function getSectorColor(sectorName) {
    const colors = {
        'Technology': '#3b82f6',
        'Financial Services': '#10b981',
        'Healthcare': '#f59e0b',
        'Consumer Discretionary': '#ef4444',
        'Industrials': '#8b5cf6',
        'Consumer Staples': '#06b6d4',
        'Energy': '#84cc16',
        'Utilities': '#f97316',
        'Real Estate': '#ec4899',
        'Materials': '#6366f1'
    };
    return colors[sectorName] || '#6b7280';
}

function getDocumentIcon(type) {
    const icons = {
        'pdf': '📄',
        'excel': '📊',
        'word': '📝',
        'powerpoint': '📈'
    };
    return icons[type] || '📄';
}

// Action Functions
function addToWatchlist(etfId) {
    const watchlist = JSON.parse(localStorage.getItem('etfWatchlist') || '[]');
    if (!watchlist.includes(etfId)) {
        watchlist.push(etfId);
        localStorage.setItem('etfWatchlist', JSON.stringify(watchlist));
        showToast('ETF aggiunto alla watchlist', 'success');
    } else {
        showToast('ETF già presente nella watchlist', 'info');
    }
}

function shareETF(etfId) {
    const etf = mockETFDatabase.find(e => e.id === etfId);
    if (!etf) return;
    
    const shareData = {
        title: `${etf.name} - ${etf.ticker}`,
        text: `Scopri ${etf.name} su GuadagnareConETF`,
        url: `${window.location.origin}?etf=${etfId}`
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareData.url).then(() => {
            showToast('Link copiato negli appunti', 'success');
        });
    }
}

function downloadDocument(url) {
    // Simulate document download
    showToast('Download del documento avviato', 'info');
}

// Load Featured ETF Details
function loadFeaturedETFDetails() {
    // Add "View Details" buttons to existing ETF cards
    document.addEventListener('DOMContentLoaded', function() {
        const etfCards = document.querySelectorAll('[data-etf-id]');
        etfCards.forEach(card => {
            if (!card.querySelector('.view-details-btn')) {
                const detailsBtn = document.createElement('button');
                detailsBtn.className = 'btn btn-sm btn-secondary view-details-btn';
                detailsBtn.textContent = 'Dettagli';
                detailsBtn.style.marginTop = '0.5rem';
                card.appendChild(detailsBtn);
            }
        });
    });
}

// Add custom styles for ETF details
const etfDetailsStyles = document.createElement('style');
etfDetailsStyles.textContent = `
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        overflow-y: auto;
    }
    
    .etf-details-content {
        max-width: 1200px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .etf-header {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 0.5rem 0.5rem 0 0;
    }
    
    .etf-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .etf-ticker-isin {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        opacity: 0.9;
    }
    
    .etf-description {
        line-height: 1.6;
        opacity: 0.9;
    }
    
    .etf-key-metrics {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    .key-metric {
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 0.5rem;
        backdrop-filter: blur(10px);
    }
    
    .metric-value {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
    }
    
    .metric-label {
        font-size: 0.75rem;
        opacity: 0.8;
    }
    
    .etf-tabs {
        display: flex;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .tab-button {
        padding: 1rem 1.5rem;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 500;
        color: #6b7280;
        transition: all 0.2s;
        border-bottom: 3px solid transparent;
    }
    
    .tab-button:hover {
        background: #f3f4f6;
        color: #374151;
    }
    
    .tab-button.active {
        color: #3b82f6;
        border-bottom-color: #3b82f6;
        background: white;
    }
    
    .tab-panel {
        display: none;
        padding: 2rem;
    }
    
    .tab-panel.active {
        display: block;
    }
    
    .overview-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .overview-section {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .info-grid {
        display: grid;
        gap: 0.75rem;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .info-label {
        color: #6b7280;
        font-weight: 500;
    }
    
    .info-value {
        font-weight: 600;
        color: #1f2937;
    }
    
    .quick-stats {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .stat-item {
        text-align: center;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 0.5rem;
    }
    
    .stat-period {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
    }
    
    .stat-value {
        font-size: 1.125rem;
        font-weight: 700;
    }
    
    .chart-container {
        height: 400px;
        margin-bottom: 2rem;
        background: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .holdings-list {
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .holding-item {
        display: grid;
        grid-template-columns: 2fr 80px 1fr;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .holding-bar {
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .holding-fill {
        height: 100%;
        background: #3b82f6;
    }
    
    .etf-actions {
        display: flex;
        gap: 1rem;
        padding: 2rem;
        background: #f9fafb;
        border-radius: 0 0 0.5rem 0.5rem;
        flex-wrap: wrap;
    }
    
    .etf-actions .btn {
        flex: 1;
        min-width: 150px;
    }
    
    .documents-grid {
        display: grid;
        gap: 1rem;
    }
    
    .document-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
    }
    
    .document-icon {
        font-size: 2rem;
    }
    
    .document-info {
        flex: 1;
    }
    
    .document-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .document-description {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }
    
    .document-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        color: #9ca3af;
    }
    
    @media (max-width: 768px) {
        .etf-header {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .etf-key-metrics {
            justify-content: center;
        }
        
        .overview-grid {
            grid-template-columns: 1fr;
        }
        
        .etf-tabs {
            overflow-x: auto;
        }
        
        .tab-button {
            white-space: nowrap;
            min-width: 120px;
        }
        
        .etf-actions {
            flex-direction: column;
        }
        
        .etf-actions .btn {
            min-width: auto;
        }
    }
`;
document.head.appendChild(etfDetailsStyles);