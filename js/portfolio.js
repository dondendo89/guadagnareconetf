// Portfolio Builder

// Portfolio State
let portfolioETFs = [];
let portfolioChart = null;
let portfolioAnalysis = null;
const MAX_PORTFOLIO_ETFS = 10;

// Initialize Portfolio Builder
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioBuilder();
});

function initializePortfolioBuilder() {
    setupPortfolioControls();
    loadPortfolioTemplates();
    setupPortfolioValidation();
    initializeEmptyPortfolio();
}

// Setup Portfolio Controls
function setupPortfolioControls() {
    const searchInput = document.getElementById('portfolioSearch');
    const addToPortfolioBtn = document.getElementById('addToPortfolioBtn');
    const rebalanceBtn = document.getElementById('rebalanceBtn');
    const clearPortfolioBtn = document.getElementById('clearPortfolioBtn');
    const savePortfolioBtn = document.getElementById('savePortfolioBtn');
    const analyzeBtn = document.getElementById('analyzePortfolioBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchETFsForPortfolio, 300));
    }
    
    if (addToPortfolioBtn) {
        addToPortfolioBtn.addEventListener('click', addFirstSearchResultToPortfolio);
    }
    
    if (rebalanceBtn) {
        rebalanceBtn.addEventListener('click', rebalancePortfolio);
    }
    
    if (clearPortfolioBtn) {
        clearPortfolioBtn.addEventListener('click', clearPortfolio);
    }
    
    if (savePortfolioBtn) {
        savePortfolioBtn.addEventListener('click', savePortfolio);
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzePortfolio);
    }
}

// Search ETFs for Portfolio
function searchETFsForPortfolio() {
    const query = document.getElementById('portfolioSearch')?.value;
    if (!query || query.length < 2) {
        hidePortfolioSearchResults();
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        const results = mockETFDatabase.filter(etf => 
            etf.name.toLowerCase().includes(query.toLowerCase()) ||
            etf.isin.toLowerCase().includes(query.toLowerCase()) ||
            etf.ticker.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
        
        displayPortfolioSearchResults(results);
    }, 100);
}

// Display Portfolio Search Results
function displayPortfolioSearchResults(results) {
    const searchResults = document.getElementById('portfolioSearchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">Nessun ETF trovato</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    searchResults.innerHTML = results.map(etf => `
        <div class="portfolio-search-result" data-etf-id="${etf.id}" onclick="addETFToPortfolio('${etf.id}')">
            <div class="etf-info">
                <div class="etf-name">${etf.name}</div>
                <div class="etf-details">
                    <span class="etf-ticker">${etf.ticker}</span>
                    <span class="etf-sector">${etf.sector}</span>
                </div>
            </div>
            <div class="etf-metrics">
                <span class="etf-ter">TER: ${etf.ter}%</span>
                <span class="etf-performance ${etf.performance1Y >= 0 ? 'positive' : 'negative'}">
                    ${formatPercentage(etf.performance1Y)}
                </span>
            </div>
        </div>
    `).join('');
    
    searchResults.style.display = 'block';
}

// Hide Portfolio Search Results
function hidePortfolioSearchResults() {
    const searchResults = document.getElementById('portfolioSearchResults');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Add First Search Result to Portfolio
function addFirstSearchResultToPortfolio() {
    const firstResult = document.querySelector('.portfolio-search-result');
    if (firstResult) {
        const etfId = firstResult.dataset.etfId;
        addETFToPortfolio(etfId);
    }
}

// Add ETF to Portfolio
function addETFToPortfolio(etfId) {
    if (portfolioETFs.length >= MAX_PORTFOLIO_ETFS) {
        showToast(`Puoi aggiungere massimo ${MAX_PORTFOLIO_ETFS} ETF al portafoglio`, 'warning');
        return;
    }
    
    if (portfolioETFs.find(item => item.etf.id === etfId)) {
        showToast('ETF già presente nel portafoglio', 'warning');
        return;
    }
    
    const etf = mockETFDatabase.find(e => e.id === etfId);
    if (!etf) {
        showToast('ETF non trovato', 'error');
        return;
    }
    
    // Calculate suggested allocation
    const suggestedAllocation = calculateSuggestedAllocation();
    
    portfolioETFs.push({
        etf: etf,
        allocation: suggestedAllocation,
        amount: 0
    });
    
    updatePortfolioDisplay();
    hidePortfolioSearchResults();
    clearPortfolioSearchInput();
    
    showToast(`${etf.name} aggiunto al portafoglio`, 'success');
}

// Calculate Suggested Allocation
function calculateSuggestedAllocation() {
    if (portfolioETFs.length === 0) return 100;
    
    const currentTotal = portfolioETFs.reduce((sum, item) => sum + item.allocation, 0);
    const remaining = 100 - currentTotal;
    
    if (remaining <= 0) {
        // Rebalance existing allocations
        const equalAllocation = 100 / (portfolioETFs.length + 1);
        portfolioETFs.forEach(item => {
            item.allocation = equalAllocation;
        });
        return equalAllocation;
    }
    
    return Math.min(remaining, 20); // Suggest max 20% for new ETF
}

// Remove ETF from Portfolio
function removeETFFromPortfolio(etfId) {
    const index = portfolioETFs.findIndex(item => item.etf.id === etfId);
    if (index === -1) return;
    
    const removedItem = portfolioETFs.splice(index, 1)[0];
    
    // Redistribute allocation proportionally
    if (portfolioETFs.length > 0) {
        const redistributeAmount = removedItem.allocation / portfolioETFs.length;
        portfolioETFs.forEach(item => {
            item.allocation += redistributeAmount;
        });
    }
    
    updatePortfolioDisplay();
    showToast('ETF rimosso dal portafoglio', 'info');
}

// Update Allocation
function updateAllocation(etfId, newAllocation) {
    const item = portfolioETFs.find(item => item.etf.id === etfId);
    if (!item) return;
    
    const oldAllocation = item.allocation;
    const maxAllocation = 100 - (getTotalAllocation() - oldAllocation);
    
    newAllocation = Math.max(0, Math.min(newAllocation, maxAllocation));
    item.allocation = newAllocation;
    
    updatePortfolioDisplay();
    validatePortfolio();
}

// Get Total Allocation
function getTotalAllocation() {
    return portfolioETFs.reduce((sum, item) => sum + item.allocation, 0);
}

// Update Portfolio Display
function updatePortfolioDisplay() {
    updatePortfolioList();
    updatePortfolioChart();
    updatePortfolioSummary();
    updatePortfolioButtons();
}

// Update Portfolio List
function updatePortfolioList() {
    const portfolioList = document.getElementById('portfolioList');
    if (!portfolioList) return;
    
    if (portfolioETFs.length === 0) {
        portfolioList.innerHTML = `
            <div class="empty-portfolio">
                <div class="empty-icon">📊</div>
                <div class="empty-title">Portafoglio Vuoto</div>
                <div class="empty-description">Aggiungi ETF per iniziare a costruire il tuo portafoglio</div>
            </div>
        `;
        return;
    }
    
    const totalAllocation = getTotalAllocation();
    
    portfolioList.innerHTML = portfolioETFs.map(item => `
        <div class="portfolio-item" data-etf-id="${item.etf.id}">
            <div class="portfolio-etf-info">
                <div class="etf-name">${item.etf.name}</div>
                <div class="etf-details">
                    <span class="etf-ticker">${item.etf.ticker}</span>
                    <span class="etf-sector">${item.etf.sector}</span>
                </div>
            </div>
            
            <div class="portfolio-allocation">
                <div class="allocation-input-group">
                    <input 
                        type="number" 
                        class="allocation-input" 
                        value="${item.allocation.toFixed(1)}" 
                        min="0" 
                        max="100" 
                        step="0.1"
                        onchange="updateAllocation('${item.etf.id}', parseFloat(this.value))"
                    >
                    <span class="allocation-unit">%</span>
                </div>
                <div class="allocation-bar">
                    <div class="allocation-fill" style="width: ${(item.allocation / 100) * 100}%"></div>
                </div>
            </div>
            
            <div class="portfolio-metrics">
                <div class="metric">
                    <span class="metric-label">TER:</span>
                    <span class="metric-value">${item.etf.ter}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">1Y:</span>
                    <span class="metric-value ${item.etf.performance1Y >= 0 ? 'positive' : 'negative'}">
                        ${formatPercentage(item.etf.performance1Y)}
                    </span>
                </div>
            </div>
            
            <div class="portfolio-actions">
                <button class="btn-icon" onclick="removeETFFromPortfolio('${item.etf.id}')" title="Rimuovi">
                    ✕
                </button>
            </div>
        </div>
    `).join('');
    
    // Add total allocation indicator
    const totalIndicator = document.createElement('div');
    totalIndicator.className = `portfolio-total ${totalAllocation === 100 ? 'complete' : 'incomplete'}`;
    totalIndicator.innerHTML = `
        <div class="total-label">Allocazione Totale:</div>
        <div class="total-value">${totalAllocation.toFixed(1)}%</div>
        <div class="total-status">${totalAllocation === 100 ? '✓ Completa' : '⚠ Incompleta'}</div>
    `;
    portfolioList.appendChild(totalIndicator);
}

// Update Portfolio Chart
function updatePortfolioChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx || portfolioETFs.length === 0) {
        if (portfolioChart) {
            portfolioChart.destroy();
            portfolioChart = null;
        }
        return;
    }
    
    // Destroy existing chart
    if (portfolioChart) {
        portfolioChart.destroy();
    }
    
    const data = portfolioETFs.map(item => item.allocation);
    const labels = portfolioETFs.map(item => item.etf.ticker);
    const colors = generateChartColors(portfolioETFs.length);
    
    portfolioChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Allocazione Portafoglio'
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Generate Chart Colors
function generateChartColors(count) {
    const baseColors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
}

// Update Portfolio Summary
function updatePortfolioSummary() {
    const summaryContainer = document.getElementById('portfolioSummary');
    if (!summaryContainer || portfolioETFs.length === 0) {
        if (summaryContainer) {
            summaryContainer.style.display = 'none';
        }
        return;
    }
    
    const summary = calculatePortfolioSummary();
    
    summaryContainer.innerHTML = `
        <div class="summary-metrics">
            <div class="summary-metric">
                <div class="metric-label">TER Medio Ponderato</div>
                <div class="metric-value">${summary.weightedTER.toFixed(3)}%</div>
            </div>
            <div class="summary-metric">
                <div class="metric-label">Performance 1Y Attesa</div>
                <div class="metric-value ${summary.expectedReturn1Y >= 0 ? 'positive' : 'negative'}">
                    ${formatPercentage(summary.expectedReturn1Y)}
                </div>
            </div>
            <div class="summary-metric">
                <div class="metric-label">Volatilità Stimata</div>
                <div class="metric-value">${summary.estimatedVolatility.toFixed(2)}%</div>
            </div>
            <div class="summary-metric">
                <div class="metric-label">Diversificazione</div>
                <div class="metric-value">${summary.diversificationScore}/10</div>
            </div>
        </div>
        
        <div class="sector-breakdown">
            <h4>Ripartizione per Settore</h4>
            <div class="sector-list">
                ${Object.entries(summary.sectorBreakdown).map(([sector, percentage]) => `
                    <div class="sector-item">
                        <span class="sector-name">${sector}</span>
                        <span class="sector-percentage">${percentage.toFixed(1)}%</span>
                        <div class="sector-bar">
                            <div class="sector-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    summaryContainer.style.display = 'block';
}

// Calculate Portfolio Summary
function calculatePortfolioSummary() {
    const totalAllocation = getTotalAllocation();
    
    // Weighted TER
    const weightedTER = portfolioETFs.reduce((sum, item) => {
        return sum + (item.etf.ter * item.allocation / 100);
    }, 0);
    
    // Expected Return (weighted average)
    const expectedReturn1Y = portfolioETFs.reduce((sum, item) => {
        return sum + (item.etf.performance1Y * item.allocation / 100);
    }, 0);
    
    // Estimated Volatility (simplified calculation)
    const weightedVolatility = portfolioETFs.reduce((sum, item) => {
        return sum + (item.etf.volatility * item.allocation / 100);
    }, 0);
    
    // Diversification Score (based on number of ETFs and sector distribution)
    const uniqueSectors = new Set(portfolioETFs.map(item => item.etf.sector)).size;
    const diversificationScore = Math.min(10, Math.round(
        (portfolioETFs.length * 2) + (uniqueSectors * 1.5)
    ));
    
    // Sector Breakdown
    const sectorBreakdown = {};
    portfolioETFs.forEach(item => {
        const sector = item.etf.sector;
        if (!sectorBreakdown[sector]) {
            sectorBreakdown[sector] = 0;
        }
        sectorBreakdown[sector] += item.allocation;
    });
    
    return {
        weightedTER,
        expectedReturn1Y,
        estimatedVolatility: weightedVolatility,
        diversificationScore,
        sectorBreakdown
    };
}

// Update Portfolio Buttons
function updatePortfolioButtons() {
    const rebalanceBtn = document.getElementById('rebalanceBtn');
    const clearBtn = document.getElementById('clearPortfolioBtn');
    const saveBtn = document.getElementById('savePortfolioBtn');
    const analyzeBtn = document.getElementById('analyzePortfolioBtn');
    
    const hasETFs = portfolioETFs.length > 0;
    const isComplete = getTotalAllocation() === 100;
    
    if (rebalanceBtn) rebalanceBtn.disabled = !hasETFs;
    if (clearBtn) clearBtn.disabled = !hasETFs;
    if (saveBtn) saveBtn.disabled = !hasETFs || !isComplete;
    if (analyzeBtn) analyzeBtn.disabled = !hasETFs;
}

// Rebalance Portfolio
function rebalancePortfolio() {
    if (portfolioETFs.length === 0) return;
    
    const equalAllocation = 100 / portfolioETFs.length;
    portfolioETFs.forEach(item => {
        item.allocation = equalAllocation;
    });
    
    updatePortfolioDisplay();
    showToast('Portafoglio ribilanciato equamente', 'success');
}

// Clear Portfolio
function clearPortfolio() {
    if (portfolioETFs.length === 0) return;
    
    if (confirm('Sei sicuro di voler cancellare tutto il portafoglio?')) {
        portfolioETFs = [];
        updatePortfolioDisplay();
        showToast('Portafoglio cancellato', 'info');
    }
}

// Save Portfolio
function savePortfolio() {
    if (portfolioETFs.length === 0 || getTotalAllocation() !== 100) {
        showToast('Completa il portafoglio prima di salvarlo', 'warning');
        return;
    }
    
    const portfolioName = prompt('Nome del portafoglio:');
    if (!portfolioName) return;
    
    const portfolio = {
        name: portfolioName,
        etfs: portfolioETFs.map(item => ({
            etfId: item.etf.id,
            allocation: item.allocation
        })),
        createdAt: new Date().toISOString(),
        summary: calculatePortfolioSummary()
    };
    
    // Save to localStorage
    const savedPortfolios = JSON.parse(localStorage.getItem('savedPortfolios') || '[]');
    savedPortfolios.push(portfolio);
    localStorage.setItem('savedPortfolios', JSON.stringify(savedPortfolios));
    
    showToast(`Portafoglio "${portfolioName}" salvato con successo`, 'success');
    loadSavedPortfolios();
}

// Analyze Portfolio
function analyzePortfolio() {
    if (portfolioETFs.length === 0) return;
    
    const analysisContainer = document.getElementById('portfolioAnalysis');
    if (!analysisContainer) return;
    
    showLoading(analysisContainer);
    
    // Simulate analysis
    setTimeout(() => {
        portfolioAnalysis = performPortfolioAnalysis();
        displayPortfolioAnalysis(portfolioAnalysis);
        hideLoading(analysisContainer);
        analysisContainer.style.display = 'block';
    }, 1000);
}

// Perform Portfolio Analysis
function performPortfolioAnalysis() {
    const summary = calculatePortfolioSummary();
    
    // Risk Assessment
    const riskLevel = assessRiskLevel(summary.estimatedVolatility);
    
    // Recommendations
    const recommendations = generateRecommendations();
    
    // Efficient Frontier Analysis (simplified)
    const efficientFrontier = calculateEfficientFrontier();
    
    // Monte Carlo Simulation
    const monteCarloResults = runPortfolioMonteCarlo();
    
    return {
        summary,
        riskLevel,
        recommendations,
        efficientFrontier,
        monteCarloResults
    };
}

// Assess Risk Level
function assessRiskLevel(volatility) {
    if (volatility < 10) return { level: 'Basso', color: '#10b981', description: 'Portafoglio conservativo con bassa volatilità' };
    if (volatility < 20) return { level: 'Moderato', color: '#f59e0b', description: 'Portafoglio bilanciato con volatilità media' };
    return { level: 'Alto', color: '#ef4444', description: 'Portafoglio aggressivo con alta volatilità' };
}

// Generate Recommendations
function generateRecommendations() {
    const recommendations = [];
    const summary = calculatePortfolioSummary();
    
    // TER recommendation
    if (summary.weightedTER > 0.5) {
        recommendations.push({
            type: 'warning',
            title: 'Costi Elevati',
            description: 'Il TER medio del portafoglio è superiore allo 0.5%. Considera ETF con costi più bassi.'
        });
    }
    
    // Diversification recommendation
    if (summary.diversificationScore < 6) {
        recommendations.push({
            type: 'info',
            title: 'Diversificazione',
            description: 'Considera di aggiungere ETF di settori diversi per migliorare la diversificazione.'
        });
    }
    
    // Sector concentration
    const maxSectorAllocation = Math.max(...Object.values(summary.sectorBreakdown));
    if (maxSectorAllocation > 50) {
        recommendations.push({
            type: 'warning',
            title: 'Concentrazione Settoriale',
            description: 'Un settore rappresenta più del 50% del portafoglio. Considera di diversificare.'
        });
    }
    
    // Performance recommendation
    if (summary.expectedReturn1Y < 5) {
        recommendations.push({
            type: 'info',
            title: 'Rendimento Atteso',
            description: 'Il rendimento atteso è relativamente basso. Valuta ETF con maggiore potenziale di crescita.'
        });
    }
    
    return recommendations;
}

// Calculate Efficient Frontier (simplified)
function calculateEfficientFrontier() {
    const points = [];
    
    // Generate points along efficient frontier
    for (let risk = 5; risk <= 25; risk += 2) {
        const expectedReturn = 3 + (risk - 5) * 0.4 + Math.random() * 2;
        points.push({ risk, return: expectedReturn });
    }
    
    return points;
}

// Run Portfolio Monte Carlo
function runPortfolioMonteCarlo(iterations = 1000) {
    const results = [];
    const summary = calculatePortfolioSummary();
    
    for (let i = 0; i < iterations; i++) {
        // Simulate 1-year return with normal distribution
        const randomReturn = summary.expectedReturn1Y + 
            (Math.random() - 0.5) * summary.estimatedVolatility * 2;
        results.push(randomReturn);
    }
    
    results.sort((a, b) => a - b);
    
    return {
        p5: results[Math.floor(iterations * 0.05)],
        p25: results[Math.floor(iterations * 0.25)],
        p50: results[Math.floor(iterations * 0.5)],
        p75: results[Math.floor(iterations * 0.75)],
        p95: results[Math.floor(iterations * 0.95)]
    };
}

// Display Portfolio Analysis
function displayPortfolioAnalysis(analysis) {
    const analysisContainer = document.getElementById('portfolioAnalysis');
    if (!analysisContainer) return;
    
    analysisContainer.innerHTML = `
        <div class="analysis-header">
            <h3>📊 Analisi del Portafoglio</h3>
        </div>
        
        <div class="risk-assessment">
            <h4>Valutazione del Rischio</h4>
            <div class="risk-indicator">
                <div class="risk-level" style="color: ${analysis.riskLevel.color}">
                    ${analysis.riskLevel.level}
                </div>
                <div class="risk-description">${analysis.riskLevel.description}</div>
            </div>
        </div>
        
        <div class="recommendations-section">
            <h4>💡 Raccomandazioni</h4>
            <div class="recommendations-list">
                ${analysis.recommendations.map(rec => `
                    <div class="recommendation-item ${rec.type}">
                        <div class="recommendation-title">${rec.title}</div>
                        <div class="recommendation-description">${rec.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="monte-carlo-section">
            <h4>🎲 Simulazione Monte Carlo (1 Anno)</h4>
            <div class="monte-carlo-results">
                <div class="percentile-item">
                    <span class="percentile-label">5° Percentile:</span>
                    <span class="percentile-value negative">${formatPercentage(analysis.monteCarloResults.p5)}</span>
                </div>
                <div class="percentile-item">
                    <span class="percentile-label">25° Percentile:</span>
                    <span class="percentile-value">${formatPercentage(analysis.monteCarloResults.p25)}</span>
                </div>
                <div class="percentile-item">
                    <span class="percentile-label">Mediana:</span>
                    <span class="percentile-value">${formatPercentage(analysis.monteCarloResults.p50)}</span>
                </div>
                <div class="percentile-item">
                    <span class="percentile-label">75° Percentile:</span>
                    <span class="percentile-value positive">${formatPercentage(analysis.monteCarloResults.p75)}</span>
                </div>
                <div class="percentile-item">
                    <span class="percentile-label">95° Percentile:</span>
                    <span class="percentile-value positive">${formatPercentage(analysis.monteCarloResults.p95)}</span>
                </div>
            </div>
        </div>
    `;
}

// Load Portfolio Templates
function loadPortfolioTemplates() {
    const templatesContainer = document.getElementById('portfolioTemplates');
    if (!templatesContainer) return;
    
    const templates = [
        {
            name: 'Conservativo',
            description: 'Portafoglio a basso rischio con focus su obbligazioni',
            allocation: [
                { ticker: 'VGEA', allocation: 40 },
                { ticker: 'AGGH', allocation: 35 },
                { ticker: 'VWCE', allocation: 25 }
            ]
        },
        {
            name: 'Bilanciato',
            description: 'Mix equilibrato tra azioni e obbligazioni',
            allocation: [
                { ticker: 'VWCE', allocation: 60 },
                { ticker: 'AGGH', allocation: 30 },
                { ticker: 'VGEA', allocation: 10 }
            ]
        },
        {
            name: 'Aggressivo',
            description: 'Portafoglio azionario ad alto potenziale',
            allocation: [
                { ticker: 'VWCE', allocation: 70 },
                { ticker: 'VGEA', allocation: 20 },
                { ticker: 'VFEM', allocation: 10 }
            ]
        }
    ];
    
    templatesContainer.innerHTML = `
        <h3>📋 Template Portafoglio</h3>
        <div class="templates-grid">
            ${templates.map((template, index) => `
                <div class="template-card" onclick="loadTemplate(${index})">
                    <div class="template-name">${template.name}</div>
                    <div class="template-description">${template.description}</div>
                    <div class="template-allocation">
                        ${template.allocation.map(item => `
                            <div class="allocation-item">
                                <span>${item.ticker}</span>
                                <span>${item.allocation}%</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-sm btn-primary">Carica Template</button>
                </div>
            `).join('')}
        </div>
    `;
}

// Load Template
function loadTemplate(templateIndex) {
    const templates = [
        {
            allocation: [
                { ticker: 'VGEA', allocation: 40 },
                { ticker: 'AGGH', allocation: 35 },
                { ticker: 'VWCE', allocation: 25 }
            ]
        },
        {
            allocation: [
                { ticker: 'VWCE', allocation: 60 },
                { ticker: 'AGGH', allocation: 30 },
                { ticker: 'VGEA', allocation: 10 }
            ]
        },
        {
            allocation: [
                { ticker: 'VWCE', allocation: 70 },
                { ticker: 'VGEA', allocation: 20 },
                { ticker: 'VFEM', allocation: 10 }
            ]
        }
    ];
    
    const template = templates[templateIndex];
    if (!template) return;
    
    // Clear current portfolio
    portfolioETFs = [];
    
    // Add ETFs from template
    template.allocation.forEach(item => {
        const etf = mockETFDatabase.find(e => e.ticker === item.ticker);
        if (etf) {
            portfolioETFs.push({
                etf: etf,
                allocation: item.allocation,
                amount: 0
            });
        }
    });
    
    updatePortfolioDisplay();
    showToast('Template caricato con successo', 'success');
}

// Load Saved Portfolios
function loadSavedPortfolios() {
    const savedContainer = document.getElementById('savedPortfolios');
    if (!savedContainer) return;
    
    const savedPortfolios = JSON.parse(localStorage.getItem('savedPortfolios') || '[]');
    
    if (savedPortfolios.length === 0) {
        savedContainer.innerHTML = '<div class="no-saved">Nessun portafoglio salvato</div>';
        return;
    }
    
    savedContainer.innerHTML = `
        <h3>💾 Portafogli Salvati</h3>
        <div class="saved-portfolios-list">
            ${savedPortfolios.map((portfolio, index) => `
                <div class="saved-portfolio-item">
                    <div class="portfolio-info">
                        <div class="portfolio-name">${portfolio.name}</div>
                        <div class="portfolio-date">${new Date(portfolio.createdAt).toLocaleDateString('it-IT')}</div>
                        <div class="portfolio-summary">
                            ${portfolio.etfs.length} ETF • TER: ${portfolio.summary.weightedTER.toFixed(3)}%
                        </div>
                    </div>
                    <div class="portfolio-actions">
                        <button class="btn btn-sm btn-primary" onclick="loadSavedPortfolio(${index})">
                            Carica
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="deleteSavedPortfolio(${index})">
                            Elimina
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Load Saved Portfolio
function loadSavedPortfolio(index) {
    const savedPortfolios = JSON.parse(localStorage.getItem('savedPortfolios') || '[]');
    const portfolio = savedPortfolios[index];
    if (!portfolio) return;
    
    // Clear current portfolio
    portfolioETFs = [];
    
    // Load ETFs from saved portfolio
    portfolio.etfs.forEach(item => {
        const etf = mockETFDatabase.find(e => e.id === item.etfId);
        if (etf) {
            portfolioETFs.push({
                etf: etf,
                allocation: item.allocation,
                amount: 0
            });
        }
    });
    
    updatePortfolioDisplay();
    showToast(`Portafoglio "${portfolio.name}" caricato`, 'success');
}

// Delete Saved Portfolio
function deleteSavedPortfolio(index) {
    const savedPortfolios = JSON.parse(localStorage.getItem('savedPortfolios') || '[]');
    const portfolio = savedPortfolios[index];
    
    if (confirm(`Eliminare il portafoglio "${portfolio.name}"?`)) {
        savedPortfolios.splice(index, 1);
        localStorage.setItem('savedPortfolios', JSON.stringify(savedPortfolios));
        loadSavedPortfolios();
        showToast('Portafoglio eliminato', 'info');
    }
}

// Setup Portfolio Validation
function setupPortfolioValidation() {
    // Real-time validation as user types
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('allocation-input')) {
            validatePortfolio();
        }
    });
}

// Validate Portfolio
function validatePortfolio() {
    const totalAllocation = getTotalAllocation();
    const validationContainer = document.getElementById('portfolioValidation');
    
    if (!validationContainer) return;
    
    if (totalAllocation === 100) {
        validationContainer.innerHTML = `
            <div class="validation-message success">
                ✓ Portafoglio completo (100%)
            </div>
        `;
    } else if (totalAllocation > 100) {
        validationContainer.innerHTML = `
            <div class="validation-message error">
                ⚠ Allocazione eccessiva (${totalAllocation.toFixed(1)}%)
            </div>
        `;
    } else {
        validationContainer.innerHTML = `
            <div class="validation-message warning">
                ⚠ Allocazione incompleta (${totalAllocation.toFixed(1)}%)
            </div>
        `;
    }
}

// Initialize Empty Portfolio
function initializeEmptyPortfolio() {
    updatePortfolioDisplay();
    loadSavedPortfolios();
}

// Clear Portfolio Search Input
function clearPortfolioSearchInput() {
    const searchInput = document.getElementById('portfolioSearch');
    if (searchInput) {
        searchInput.value = '';
    }
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

// Add custom styles for portfolio builder
const portfolioStyles = document.createElement('style');
portfolioStyles.textContent = `
    .empty-portfolio {
        text-align: center;
        padding: 3rem 1rem;
        color: #6b7280;
    }
    
    .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .empty-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .portfolio-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .allocation-input-group {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .allocation-input {
        width: 80px;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        text-align: right;
    }
    
    .allocation-bar {
        width: 100%;
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        margin-top: 0.5rem;
        overflow: hidden;
    }
    
    .allocation-fill {
        height: 100%;
        background: #3b82f6;
        transition: width 0.3s ease;
    }
    
    .portfolio-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f9fafb;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-top: 1rem;
        font-weight: 600;
    }
    
    .portfolio-total.complete {
        background: #f0f9ff;
        border-color: #3b82f6;
        color: #1e40af;
    }
    
    .portfolio-total.incomplete {
        background: #fef3c7;
        border-color: #f59e0b;
        color: #92400e;
    }
    
    .summary-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .summary-metric {
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    
    .sector-breakdown {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .sector-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    .sector-bar {
        width: 100px;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .sector-fill {
        height: 100%;
        background: #10b981;
    }
    
    .templates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .template-card {
        padding: 1.5rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .template-card:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }
    
    .allocation-item {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.25rem;
    }
    
    .risk-indicator {
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .risk-level {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .recommendations-list {
        space-y: 0.5rem;
    }
    
    .recommendation-item {
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .recommendation-item.warning {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
    }
    
    .recommendation-item.info {
        background: #f0f9ff;
        border-left: 4px solid #3b82f6;
    }
    
    .monte-carlo-results {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .percentile-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background: white;
        border-radius: 0.25rem;
    }
    
    .validation-message {
        padding: 0.75rem;
        border-radius: 0.5rem;
        font-weight: 500;
        text-align: center;
    }
    
    .validation-message.success {
        background: #d1fae5;
        color: #065f46;
    }
    
    .validation-message.warning {
        background: #fef3c7;
        color: #92400e;
    }
    
    .validation-message.error {
        background: #fee2e2;
        color: #991b1b;
    }
    
    @media (max-width: 768px) {
        .portfolio-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }
        
        .summary-metrics {
            grid-template-columns: 1fr;
        }
        
        .templates-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(portfolioStyles);