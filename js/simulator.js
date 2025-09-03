// ETF Investment Simulator

// Simulator State
let simulatorChart = null;
let simulationData = null;

// Initialize Simulator
document.addEventListener('DOMContentLoaded', function() {
    initializeSimulator();
});

function initializeSimulator() {
    setupSimulatorControls();
    setupRangeSliders();
    runInitialSimulation();
}

// Setup Simulator Controls
function setupSimulatorControls() {
    // Input event listeners
    const initialAmount = document.getElementById('initialAmount');
    const monthlyAmount = document.getElementById('monthlyAmount');
    const investmentPeriod = document.getElementById('investmentPeriod');
    const expectedReturn = document.getElementById('expectedReturn');
    const simulateBtn = document.getElementById('simulateBtn');
    
    if (initialAmount) {
        initialAmount.addEventListener('input', updateSimulation);
    }
    
    if (monthlyAmount) {
        monthlyAmount.addEventListener('input', updateSimulation);
    }
    
    if (investmentPeriod) {
        investmentPeriod.addEventListener('input', handlePeriodChange);
    }
    
    if (expectedReturn) {
        expectedReturn.addEventListener('input', handleReturnChange);
    }
    
    if (simulateBtn) {
        simulateBtn.addEventListener('click', runSimulation);
    }
}

// Setup Range Sliders
function setupRangeSliders() {
    const investmentPeriod = document.getElementById('investmentPeriod');
    const periodValue = document.getElementById('periodValue');
    const expectedReturn = document.getElementById('expectedReturn');
    const returnValue = document.getElementById('returnValue');
    
    if (investmentPeriod && periodValue) {
        periodValue.textContent = `${investmentPeriod.value} anni`;
    }
    
    if (expectedReturn && returnValue) {
        returnValue.textContent = `${expectedReturn.value}%`;
    }
}

// Handle Period Change
function handlePeriodChange(event) {
    const periodValue = document.getElementById('periodValue');
    if (periodValue) {
        periodValue.textContent = `${event.target.value} anni`;
    }
    updateSimulation();
}

// Handle Return Change
function handleReturnChange(event) {
    const returnValue = document.getElementById('returnValue');
    if (returnValue) {
        returnValue.textContent = `${event.target.value}%`;
    }
    updateSimulation();
}

// Update Simulation (debounced)
const updateSimulation = debounce(runSimulation, 500);

// Run Initial Simulation
function runInitialSimulation() {
    setTimeout(runSimulation, 100);
}

// Run Simulation
function runSimulation() {
    const inputs = getSimulatorInputs();
    
    if (!validateInputs(inputs)) {
        return;
    }
    
    // Show loading state
    const simulatorResults = document.getElementById('simulatorResults');
    if (simulatorResults) {
        showLoading(simulatorResults);
    }
    
    // Calculate simulation
    setTimeout(() => {
        simulationData = calculateInvestmentGrowth(inputs);
        displaySimulationResults(simulationData);
        updateChart(simulationData);
        
        if (simulatorResults) {
            hideLoading(simulatorResults);
        }
    }, 300);
}

// Get Simulator Inputs
function getSimulatorInputs() {
    const initialAmount = parseFloat(document.getElementById('initialAmount')?.value || 0);
    const monthlyAmount = parseFloat(document.getElementById('monthlyAmount')?.value || 0);
    const investmentPeriod = parseInt(document.getElementById('investmentPeriod')?.value || 20);
    const expectedReturn = parseFloat(document.getElementById('expectedReturn')?.value || 7) / 100;
    
    return {
        initialAmount,
        monthlyAmount,
        investmentPeriod,
        expectedReturn
    };
}

// Validate Inputs
function validateInputs(inputs) {
    if (inputs.initialAmount < 0) {
        showToast('L\'investimento iniziale deve essere positivo', 'error');
        return false;
    }
    
    if (inputs.monthlyAmount < 0) {
        showToast('Il versamento mensile deve essere positivo', 'error');
        return false;
    }
    
    if (inputs.investmentPeriod < 1 || inputs.investmentPeriod > 50) {
        showToast('Il periodo di investimento deve essere tra 1 e 50 anni', 'error');
        return false;
    }
    
    if (inputs.expectedReturn < 0 || inputs.expectedReturn > 0.3) {
        showToast('Il rendimento atteso deve essere tra 0% e 30%', 'error');
        return false;
    }
    
    return true;
}

// Calculate Investment Growth
function calculateInvestmentGrowth(inputs) {
    const { initialAmount, monthlyAmount, investmentPeriod, expectedReturn } = inputs;
    const monthlyReturn = expectedReturn / 12;
    const totalMonths = investmentPeriod * 12;
    
    let data = {
        years: [],
        values: [],
        invested: [],
        gains: [],
        monthlyData: []
    };
    
    let currentValue = initialAmount;
    let totalInvested = initialAmount;
    
    // Add initial point
    data.years.push(0);
    data.values.push(currentValue);
    data.invested.push(totalInvested);
    data.gains.push(0);
    
    // Calculate month by month
    for (let month = 1; month <= totalMonths; month++) {
        // Add monthly contribution
        currentValue += monthlyAmount;
        totalInvested += monthlyAmount;
        
        // Apply monthly return
        currentValue *= (1 + monthlyReturn);
        
        // Store monthly data
        data.monthlyData.push({
            month,
            value: currentValue,
            invested: totalInvested,
            gain: currentValue - totalInvested
        });
        
        // Store yearly data
        if (month % 12 === 0) {
            const year = month / 12;
            data.years.push(year);
            data.values.push(currentValue);
            data.invested.push(totalInvested);
            data.gains.push(currentValue - totalInvested);
        }
    }
    
    // Calculate summary statistics
    const finalValue = currentValue;
    const totalGain = finalValue - totalInvested;
    const totalReturn = (finalValue / totalInvested - 1) * 100;
    const annualizedReturn = (Math.pow(finalValue / initialAmount, 1 / investmentPeriod) - 1) * 100;
    
    return {
        ...data,
        summary: {
            initialAmount,
            monthlyAmount,
            investmentPeriod,
            expectedReturn: expectedReturn * 100,
            totalInvested,
            finalValue,
            totalGain,
            totalReturn,
            annualizedReturn
        }
    };
}

// Display Simulation Results
function displaySimulationResults(data) {
    const totalInvested = document.getElementById('totalInvested');
    const finalValue = document.getElementById('finalValue');
    const totalGain = document.getElementById('totalGain');
    
    if (totalInvested) {
        totalInvested.textContent = formatCurrency(data.summary.totalInvested);
    }
    
    if (finalValue) {
        finalValue.textContent = formatCurrency(data.summary.finalValue);
    }
    
    if (totalGain) {
        totalGain.textContent = formatCurrency(data.summary.totalGain);
        totalGain.className = `result-value ${data.summary.totalGain >= 0 ? 'text-success' : 'text-error'}`;
    }
    
    // Add additional metrics
    updateAdditionalMetrics(data.summary);
}

// Update Additional Metrics
function updateAdditionalMetrics(summary) {
    const resultSummary = document.querySelector('.result-summary');
    if (!resultSummary) return;
    
    // Check if additional metrics already exist
    let additionalMetrics = resultSummary.querySelector('.additional-metrics');
    if (!additionalMetrics) {
        additionalMetrics = document.createElement('div');
        additionalMetrics.className = 'additional-metrics';
        resultSummary.appendChild(additionalMetrics);
    }
    
    additionalMetrics.innerHTML = `
        <div class="result-item">
            <span class="result-label">Rendimento Totale:</span>
            <span class="result-value">${formatPercentage(summary.totalReturn)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Rendimento Annualizzato:</span>
            <span class="result-value">${formatPercentage(summary.annualizedReturn)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Moltiplicatore:</span>
            <span class="result-value">${(summary.finalValue / summary.totalInvested).toFixed(2)}x</span>
        </div>
    `;
}

// Update Chart
function updateChart(data) {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (simulatorChart) {
        simulatorChart.destroy();
    }
    
    // Create new chart
    simulatorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.years,
            datasets: [
                {
                    label: 'Valore Portafoglio',
                    data: data.values,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Capitale Investito',
                    data: data.invested,
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    fill: false,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Crescita dell\'Investimento nel Tempo'
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
                            const value = formatCurrency(context.parsed.y);
                            return `${label}: ${value}`;
                        },
                        afterBody: function(tooltipItems) {
                            if (tooltipItems.length > 0) {
                                const index = tooltipItems[0].dataIndex;
                                const gain = data.gains[index];
                                return [`Guadagno: ${formatCurrency(gain)}`];
                            }
                            return [];
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Anni'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Valore (€)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
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

// Scenario Analysis
function runScenarioAnalysis() {
    const inputs = getSimulatorInputs();
    if (!validateInputs(inputs)) return;
    
    const scenarios = [
        { name: 'Pessimistico', return: inputs.expectedReturn - 0.02 },
        { name: 'Realistico', return: inputs.expectedReturn },
        { name: 'Ottimistico', return: inputs.expectedReturn + 0.02 }
    ];
    
    const scenarioResults = scenarios.map(scenario => {
        const scenarioInputs = { ...inputs, expectedReturn: scenario.return };
        const result = calculateInvestmentGrowth(scenarioInputs);
        return {
            name: scenario.name,
            finalValue: result.summary.finalValue,
            totalGain: result.summary.totalGain
        };
    });
    
    displayScenarioAnalysis(scenarioResults);
}

// Display Scenario Analysis
function displayScenarioAnalysis(scenarios) {
    const simulatorResults = document.getElementById('simulatorResults');
    if (!simulatorResults) return;
    
    let scenarioSection = simulatorResults.querySelector('.scenario-analysis');
    if (!scenarioSection) {
        scenarioSection = document.createElement('div');
        scenarioSection.className = 'scenario-analysis';
        simulatorResults.appendChild(scenarioSection);
    }
    
    scenarioSection.innerHTML = `
        <h3>Analisi degli Scenari</h3>
        <div class="scenario-grid">
            ${scenarios.map(scenario => `
                <div class="scenario-item">
                    <div class="scenario-name">${scenario.name}</div>
                    <div class="scenario-value">${formatCurrency(scenario.finalValue)}</div>
                    <div class="scenario-gain ${scenario.totalGain >= 0 ? 'positive' : 'negative'}">
                        ${formatCurrency(scenario.totalGain)}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Monte Carlo Simulation
function runMonteCarloSimulation(iterations = 1000) {
    const inputs = getSimulatorInputs();
    if (!validateInputs(inputs)) return;
    
    const results = [];
    const volatility = 0.15; // 15% annual volatility
    
    for (let i = 0; i < iterations; i++) {
        const randomReturns = generateRandomReturns(inputs.investmentPeriod, inputs.expectedReturn, volatility);
        const result = calculateInvestmentGrowthWithRandomReturns(inputs, randomReturns);
        results.push(result.summary.finalValue);
    }
    
    results.sort((a, b) => a - b);
    
    const percentiles = {
        p10: results[Math.floor(iterations * 0.1)],
        p25: results[Math.floor(iterations * 0.25)],
        p50: results[Math.floor(iterations * 0.5)],
        p75: results[Math.floor(iterations * 0.75)],
        p90: results[Math.floor(iterations * 0.9)]
    };
    
    displayMonteCarloResults(percentiles);
}

// Generate Random Returns
function generateRandomReturns(years, expectedReturn, volatility) {
    const returns = [];
    for (let year = 0; year < years; year++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const randomReturn = expectedReturn + (volatility * z);
        returns.push(Math.max(-0.5, randomReturn)); // Cap losses at -50%
    }
    return returns;
}

// Calculate Investment Growth with Random Returns
function calculateInvestmentGrowthWithRandomReturns(inputs, returns) {
    const { initialAmount, monthlyAmount } = inputs;
    
    let currentValue = initialAmount;
    let totalInvested = initialAmount;
    
    for (let year = 0; year < returns.length; year++) {
        const yearlyReturn = returns[year];
        
        // Add monthly contributions throughout the year
        for (let month = 0; month < 12; month++) {
            currentValue += monthlyAmount;
            totalInvested += monthlyAmount;
            currentValue *= (1 + yearlyReturn / 12);
        }
    }
    
    return {
        summary: {
            totalInvested,
            finalValue: currentValue,
            totalGain: currentValue - totalInvested
        }
    };
}

// Display Monte Carlo Results
function displayMonteCarloResults(percentiles) {
    const simulatorResults = document.getElementById('simulatorResults');
    if (!simulatorResults) return;
    
    let monteCarloSection = simulatorResults.querySelector('.monte-carlo-analysis');
    if (!monteCarloSection) {
        monteCarloSection = document.createElement('div');
        monteCarloSection.className = 'monte-carlo-analysis';
        simulatorResults.appendChild(monteCarloSection);
    }
    
    monteCarloSection.innerHTML = `
        <h3>Analisi Monte Carlo</h3>
        <p class="monte-carlo-description">
            Simulazione di 1000 scenari con volatilità del 15%
        </p>
        <div class="percentile-grid">
            <div class="percentile-item">
                <div class="percentile-label">10° Percentile</div>
                <div class="percentile-value">${formatCurrency(percentiles.p10)}</div>
            </div>
            <div class="percentile-item">
                <div class="percentile-label">25° Percentile</div>
                <div class="percentile-value">${formatCurrency(percentiles.p25)}</div>
            </div>
            <div class="percentile-item">
                <div class="percentile-label">Mediana</div>
                <div class="percentile-value">${formatCurrency(percentiles.p50)}</div>
            </div>
            <div class="percentile-item">
                <div class="percentile-label">75° Percentile</div>
                <div class="percentile-value">${formatCurrency(percentiles.p75)}</div>
            </div>
            <div class="percentile-item">
                <div class="percentile-label">90° Percentile</div>
                <div class="percentile-value">${formatCurrency(percentiles.p90)}</div>
            </div>
        </div>
    `;
}

// Export Simulation Data
function exportSimulationData() {
    if (!simulationData) {
        showToast('Nessun dato di simulazione disponibile', 'error');
        return;
    }
    
    const csvData = generateCSVData(simulationData);
    downloadCSV(csvData, 'simulazione-etf.csv');
    showToast('Dati esportati con successo', 'success');
}

// Generate CSV Data
function generateCSVData(data) {
    const headers = ['Anno', 'Valore Portafoglio', 'Capitale Investito', 'Guadagno'];
    const rows = data.years.map((year, index) => [
        year,
        data.values[index].toFixed(2),
        data.invested[index].toFixed(2),
        data.gains[index].toFixed(2)
    ]);
    
    return [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
}

// Download CSV
function downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Utility Functions
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

// Add Advanced Simulator Controls
function addAdvancedControls() {
    const simulatorInputs = document.querySelector('.simulator-inputs');
    if (!simulatorInputs) return;
    
    const advancedControls = document.createElement('div');
    advancedControls.className = 'advanced-controls';
    advancedControls.innerHTML = `
        <h3>Analisi Avanzate</h3>
        <div class="advanced-buttons">
            <button class="btn btn-secondary" onclick="runScenarioAnalysis()">
                📊 Analisi Scenari
            </button>
            <button class="btn btn-secondary" onclick="runMonteCarloSimulation()">
                🎲 Monte Carlo
            </button>
            <button class="btn btn-secondary" onclick="exportSimulationData()">
                📥 Esporta Dati
            </button>
        </div>
    `;
    
    simulatorInputs.appendChild(advancedControls);
}

// Initialize advanced controls when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addAdvancedControls, 100);
});

// Add custom styles for simulator
const simulatorStyles = document.createElement('style');
simulatorStyles.textContent = `
    .additional-metrics {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .scenario-analysis,
    .monte-carlo-analysis {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 0.5rem;
    }
    
    .scenario-grid,
    .percentile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .scenario-item,
    .percentile-item {
        background: white;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .scenario-name,
    .percentile-label {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
    }
    
    .scenario-value,
    .percentile-value {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .scenario-gain {
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .scenario-gain.positive {
        color: #059669;
    }
    
    .scenario-gain.negative {
        color: #dc2626;
    }
    
    .monte-carlo-description {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 1rem;
    }
    
    .advanced-controls {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .advanced-buttons {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }
    
    .advanced-buttons .btn {
        flex: 1;
        min-width: 120px;
    }
    
    @media (max-width: 768px) {
        .advanced-buttons {
            flex-direction: column;
        }
        
        .scenario-grid,
        .percentile-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(simulatorStyles);