// FIRE Calculator - Financial Independence Retire Early

// FIRE Calculator State
let fireCalculatorState = {
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 10000,
    monthlyIncome: 3000,
    monthlyExpenses: 2000,
    monthlySavings: 1000,
    expectedReturn: 7,
    inflationRate: 2,
    withdrawalRate: 4,
    fireNumber: 0,
    yearsToFire: 0,
    fireAge: 0
};

let fireChart = null;
let fireProjectionChart = null;

// Initialize FIRE Calculator
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('fire-calculator')) {
        initializeFIRECalculator();
    }
});

function initializeFIRECalculator() {
    setupFIREControls();
    setupFIREInputs();
    calculateFIRE();
    updateFIREDisplay();
}

// Setup FIRE Controls
function setupFIREControls() {
    const fireSection = document.getElementById('fire-calculator');
    if (!fireSection) return;
    
    fireSection.innerHTML = `
        <div class="fire-calculator-container">
            <div class="fire-header">
                <h2>🔥 Calcolatore FIRE</h2>
                <p>Calcola quando potrai raggiungere l'indipendenza finanziaria</p>
            </div>
            
            <div class="fire-content">
                <div class="fire-inputs">
                    <div class="fire-input-section">
                        <h3>📊 Situazione Attuale</h3>
                        <div class="input-grid">
                            <div class="input-group">
                                <label for="currentAge">Età Attuale</label>
                                <input type="number" id="currentAge" value="${fireCalculatorState.currentAge}" min="18" max="80">
                                <span class="input-unit">anni</span>
                            </div>
                            
                            <div class="input-group">
                                <label for="currentSavings">Risparmi Attuali</label>
                                <input type="number" id="currentSavings" value="${fireCalculatorState.currentSavings}" min="0" step="1000">
                                <span class="input-unit">€</span>
                            </div>
                            
                            <div class="input-group">
                                <label for="monthlyIncome">Reddito Mensile</label>
                                <input type="number" id="monthlyIncome" value="${fireCalculatorState.monthlyIncome}" min="0" step="100">
                                <span class="input-unit">€/mese</span>
                            </div>
                            
                            <div class="input-group">
                                <label for="monthlyExpenses">Spese Mensili</label>
                                <input type="number" id="monthlyExpenses" value="${fireCalculatorState.monthlyExpenses}" min="0" step="100">
                                <span class="input-unit">€/mese</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="fire-input-section">
                        <h3>💰 Parametri di Investimento</h3>
                        <div class="input-grid">
                            <div class="input-group">
                                <label for="monthlySavings">Risparmio Mensile</label>
                                <input type="number" id="monthlySavings" value="${fireCalculatorState.monthlySavings}" min="0" step="50">
                                <span class="input-unit">€/mese</span>
                            </div>
                            
                            <div class="input-group">
                                <label for="expectedReturn">Rendimento Atteso</label>
                                <input type="range" id="expectedReturn" value="${fireCalculatorState.expectedReturn}" min="3" max="12" step="0.5">
                                <span class="input-unit" id="expectedReturnValue">${fireCalculatorState.expectedReturn}%</span>
                            </div>
                            
                            <div class="input-group">
                                <label for="inflationRate">Tasso di Inflazione</label>
                                <input type="range" id="inflationRate" value="${fireCalculatorState.inflationRate}" min="1" max="5" step="0.1">
                                <span class="input-unit" id="inflationRateValue">${fireCalculatorState.inflationRate}%</span>
                            </div>
                            
                            <div class="input-group">
                                <label for="withdrawalRate">Tasso di Prelievo</label>
                                <input type="range" id="withdrawalRate" value="${fireCalculatorState.withdrawalRate}" min="2" max="6" step="0.1">
                                <span class="input-unit" id="withdrawalRateValue">${fireCalculatorState.withdrawalRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="fire-results">
                    <div class="fire-summary">
                        <div class="fire-metric">
                            <div class="metric-icon">🎯</div>
                            <div class="metric-content">
                                <div class="metric-label">Numero FIRE</div>
                                <div class="metric-value" id="fireNumber">€0</div>
                                <div class="metric-description">Capitale necessario per l'indipendenza</div>
                            </div>
                        </div>
                        
                        <div class="fire-metric">
                            <div class="metric-icon">⏰</div>
                            <div class="metric-content">
                                <div class="metric-label">Anni al FIRE</div>
                                <div class="metric-value" id="yearsToFire">0</div>
                                <div class="metric-description">Tempo rimanente</div>
                            </div>
                        </div>
                        
                        <div class="fire-metric">
                            <div class="metric-icon">🎂</div>
                            <div class="metric-content">
                                <div class="metric-label">Età FIRE</div>
                                <div class="metric-value" id="fireAge">0</div>
                                <div class="metric-description">Età di indipendenza finanziaria</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="fire-charts">
                        <div class="chart-container">
                            <canvas id="fireProgressChart" width="400" height="200"></canvas>
                        </div>
                        
                        <div class="chart-container">
                            <canvas id="fireProjectionChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="fire-strategies">
                <h3>🚀 Strategie per Accelerare il FIRE</h3>
                <div class="strategies-grid" id="fireStrategies">
                    <!-- Strategies will be populated here -->
                </div>
            </div>
            
            <div class="fire-scenarios">
                <h3>📈 Analisi degli Scenari</h3>
                <div class="scenarios-container" id="fireScenarios">
                    <!-- Scenarios will be populated here -->
                </div>
            </div>
            
            <div class="fire-actions">
                <button class="btn btn-primary" onclick="exportFIREPlan()">
                    📊 Esporta Piano FIRE
                </button>
                <button class="btn btn-secondary" onclick="saveFIREPlan()">
                    💾 Salva Piano
                </button>
                <button class="btn btn-secondary" onclick="shareFIREResults()">
                    🔗 Condividi Risultati
                </button>
            </div>
        </div>
    `;
}

// Setup FIRE Inputs
function setupFIREInputs() {
    // Add event listeners to all inputs
    const inputs = [
        'currentAge', 'currentSavings', 'monthlyIncome', 'monthlyExpenses',
        'monthlySavings', 'expectedReturn', 'inflationRate', 'withdrawalRate'
    ];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function() {
                updateFIREState(inputId, parseFloat(this.value));
                calculateFIRE();
                updateFIREDisplay();
            });
        }
    });
    
    // Special handling for range inputs
    const rangeInputs = ['expectedReturn', 'inflationRate', 'withdrawalRate'];
    rangeInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const valueDisplay = document.getElementById(inputId + 'Value');
        if (input && valueDisplay) {
            input.addEventListener('input', function() {
                valueDisplay.textContent = this.value + '%';
            });
        }
    });
    
    // Auto-calculate monthly savings
    const incomeInput = document.getElementById('monthlyIncome');
    const expensesInput = document.getElementById('monthlyExpenses');
    const savingsInput = document.getElementById('monthlySavings');
    
    function updateMonthlySavings() {
        const income = parseFloat(incomeInput.value) || 0;
        const expenses = parseFloat(expensesInput.value) || 0;
        const calculatedSavings = Math.max(0, income - expenses);
        
        if (savingsInput && calculatedSavings !== parseFloat(savingsInput.value)) {
            savingsInput.value = calculatedSavings;
            updateFIREState('monthlySavings', calculatedSavings);
        }
    }
    
    if (incomeInput && expensesInput) {
        incomeInput.addEventListener('input', updateMonthlySavings);
        expensesInput.addEventListener('input', updateMonthlySavings);
    }
}

// Update FIRE State
function updateFIREState(key, value) {
    fireCalculatorState[key] = value;
}

// Calculate FIRE
function calculateFIRE() {
    const state = fireCalculatorState;
    
    // Calculate annual expenses (needed for FIRE number)
    const annualExpenses = state.monthlyExpenses * 12;
    
    // Calculate FIRE number using the withdrawal rate
    state.fireNumber = annualExpenses / (state.withdrawalRate / 100);
    
    // Calculate years to FIRE
    const monthlyReturn = state.expectedReturn / 100 / 12;
    const monthlyInflation = state.inflationRate / 100 / 12;
    const realMonthlyReturn = (1 + monthlyReturn) / (1 + monthlyInflation) - 1;
    
    // Future value calculation
    const currentValue = state.currentSavings;
    const monthlyContribution = state.monthlySavings;
    const targetValue = state.fireNumber;
    
    // Calculate months to reach FIRE number
    let months = 0;
    let currentAmount = currentValue;
    
    if (monthlyContribution > 0 && realMonthlyReturn > 0) {
        // Use financial formula for compound growth with regular contributions
        const numerator = Math.log((targetValue * realMonthlyReturn / monthlyContribution) + 1);
        const denominator = Math.log(1 + realMonthlyReturn);
        
        if (currentValue > 0) {
            // Adjust for existing savings
            const futureValueOfCurrentSavings = currentValue * Math.pow(1 + realMonthlyReturn, 12);
            const adjustedTarget = Math.max(0, targetValue - futureValueOfCurrentSavings);
            
            if (adjustedTarget > 0) {
                months = Math.log((adjustedTarget * realMonthlyReturn / monthlyContribution) + 1) / Math.log(1 + realMonthlyReturn);
            } else {
                months = 0; // Already have enough
            }
        } else {
            months = numerator / denominator;
        }
    } else if (monthlyContribution > 0) {
        // Simple calculation without compound interest
        months = (targetValue - currentValue) / monthlyContribution;
    } else {
        months = Infinity; // Cannot reach FIRE without savings
    }
    
    state.yearsToFire = Math.max(0, months / 12);
    state.fireAge = state.currentAge + state.yearsToFire;
    
    // Ensure reasonable bounds
    if (state.yearsToFire > 100 || !isFinite(state.yearsToFire)) {
        state.yearsToFire = 100;
        state.fireAge = state.currentAge + 100;
    }
}

// Update FIRE Display
function updateFIREDisplay() {
    const state = fireCalculatorState;
    
    // Update summary metrics
    const fireNumberEl = document.getElementById('fireNumber');
    const yearsToFireEl = document.getElementById('yearsToFire');
    const fireAgeEl = document.getElementById('fireAge');
    
    if (fireNumberEl) fireNumberEl.textContent = formatCurrency(state.fireNumber);
    if (yearsToFireEl) yearsToFireEl.textContent = state.yearsToFire.toFixed(1);
    if (fireAgeEl) fireAgeEl.textContent = Math.round(state.fireAge);
    
    // Update charts
    updateFIRECharts();
    
    // Update strategies
    updateFIREStrategies();
    
    // Update scenarios
    updateFIREScenarios();
}

// Update FIRE Charts
function updateFIRECharts() {
    updateFIREProgressChart();
    updateFIREProjectionChart();
}

// Update FIRE Progress Chart
function updateFIREProgressChart() {
    const ctx = document.getElementById('fireProgressChart');
    if (!ctx) return;
    
    if (fireChart) {
        fireChart.destroy();
    }
    
    const state = fireCalculatorState;
    const progressPercentage = (state.currentSavings / state.fireNumber) * 100;
    
    fireChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Progresso FIRE', 'Rimanente'],
            datasets: [{
                data: [progressPercentage, 100 - progressPercentage],
                backgroundColor: ['#10b981', '#e5e7eb'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Progresso verso il FIRE'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataIndex === 0) {
                                return `Completato: ${progressPercentage.toFixed(1)}%`;
                            } else {
                                return `Rimanente: ${(100 - progressPercentage).toFixed(1)}%`;
                            }
                        }
                    }
                }
            },
            cutout: '70%'
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = 'bold 24px Arial';
                ctx.fillStyle = '#1f2937';
                ctx.fillText(`${progressPercentage.toFixed(1)}%`, centerX, centerY - 10);
                
                ctx.font = '14px Arial';
                ctx.fillStyle = '#6b7280';
                ctx.fillText('Completato', centerX, centerY + 15);
                ctx.restore();
            }
        }]
    });
}

// Update FIRE Projection Chart
function updateFIREProjectionChart() {
    const ctx = document.getElementById('fireProjectionChart');
    if (!ctx) return;
    
    if (fireProjectionChart) {
        fireProjectionChart.destroy();
    }
    
    const state = fireCalculatorState;
    const projectionData = generateFIREProjection(state);
    
    fireProjectionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: projectionData.labels,
            datasets: [
                {
                    label: 'Patrimonio Accumulato',
                    data: projectionData.wealth,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Obiettivo FIRE',
                    data: projectionData.fireTarget,
                    borderColor: '#ef4444',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Proiezione Accumulo Patrimonio'
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
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
                        text: 'Patrimonio (€)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Generate FIRE Projection Data
function generateFIREProjection(state) {
    const years = Math.min(Math.ceil(state.yearsToFire) + 5, 50);
    const labels = [];
    const wealth = [];
    const fireTarget = [];
    
    const monthlyReturn = state.expectedReturn / 100 / 12;
    const monthlyInflation = state.inflationRate / 100 / 12;
    const realMonthlyReturn = (1 + monthlyReturn) / (1 + monthlyInflation) - 1;
    
    let currentWealth = state.currentSavings;
    
    for (let year = 0; year <= years; year++) {
        labels.push((state.currentAge + year).toString());
        wealth.push(currentWealth);
        fireTarget.push(state.fireNumber);
        
        // Calculate wealth growth for next year
        for (let month = 0; month < 12; month++) {
            currentWealth = currentWealth * (1 + realMonthlyReturn) + state.monthlySavings;
        }
    }
    
    return { labels, wealth, fireTarget };
}

// Update FIRE Strategies
function updateFIREStrategies() {
    const strategiesContainer = document.getElementById('fireStrategies');
    if (!strategiesContainer) return;
    
    const state = fireCalculatorState;
    const strategies = generateFIREStrategies(state);
    
    strategiesContainer.innerHTML = strategies.map(strategy => `
        <div class="strategy-card">
            <div class="strategy-icon">${strategy.icon}</div>
            <div class="strategy-content">
                <h4>${strategy.title}</h4>
                <p>${strategy.description}</p>
                <div class="strategy-impact">
                    <span class="impact-label">Impatto:</span>
                    <span class="impact-value ${strategy.impact > 0 ? 'positive' : 'neutral'}">
                        ${strategy.impact > 0 ? '-' : ''}${Math.abs(strategy.impact).toFixed(1)} anni
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate FIRE Strategies
function generateFIREStrategies(state) {
    const strategies = [];
    
    // Increase savings rate
    const savingsRate = (state.monthlySavings / state.monthlyIncome) * 100;
    if (savingsRate < 50) {
        const newSavings = state.monthlySavings + 200;
        const newYears = calculateYearsToFIRE(state.currentSavings, newSavings, state.fireNumber, state.expectedReturn, state.inflationRate);
        const impact = state.yearsToFire - newYears;
        
        strategies.push({
            icon: '💰',
            title: 'Aumenta il Risparmio Mensile',
            description: `Risparmia €200 in più al mese (${((newSavings / state.monthlyIncome) * 100).toFixed(1)}% del reddito)`,
            impact: impact
        });
    }
    
    // Reduce expenses
    if (state.monthlyExpenses > 1000) {
        const reducedExpenses = state.monthlyExpenses * 0.9;
        const newSavings = state.monthlyIncome - reducedExpenses;
        const newFireNumber = (reducedExpenses * 12) / (state.withdrawalRate / 100);
        const newYears = calculateYearsToFIRE(state.currentSavings, newSavings, newFireNumber, state.expectedReturn, state.inflationRate);
        const impact = state.yearsToFire - newYears;
        
        strategies.push({
            icon: '✂️',
            title: 'Riduci le Spese del 10%',
            description: `Riduci le spese mensili a €${reducedExpenses.toFixed(0)} (-€${(state.monthlyExpenses - reducedExpenses).toFixed(0)}/mese)`,
            impact: impact
        });
    }
    
    // Increase income
    const increasedIncome = state.monthlyIncome * 1.2;
    const newSavingsFromIncome = increasedIncome - state.monthlyExpenses;
    if (newSavingsFromIncome > state.monthlySavings) {
        const newYears = calculateYearsToFIRE(state.currentSavings, newSavingsFromIncome, state.fireNumber, state.expectedReturn, state.inflationRate);
        const impact = state.yearsToFire - newYears;
        
        strategies.push({
            icon: '📈',
            title: 'Aumenta il Reddito del 20%',
            description: `Porta il reddito a €${increasedIncome.toFixed(0)}/mese (+€${(increasedIncome - state.monthlyIncome).toFixed(0)}/mese)`,
            impact: impact
        });
    }
    
    // Optimize investment returns
    if (state.expectedReturn < 8) {
        const betterReturn = state.expectedReturn + 1;
        const newYears = calculateYearsToFIRE(state.currentSavings, state.monthlySavings, state.fireNumber, betterReturn, state.inflationRate);
        const impact = state.yearsToFire - newYears;
        
        strategies.push({
            icon: '📊',
            title: 'Ottimizza gli Investimenti',
            description: `Migliora il rendimento al ${betterReturn}% annuo con ETF più performanti`,
            impact: impact
        });
    }
    
    return strategies.slice(0, 4); // Show top 4 strategies
}

// Calculate Years to FIRE (helper function)
function calculateYearsToFIRE(currentSavings, monthlySavings, fireNumber, expectedReturn, inflationRate) {
    const monthlyReturn = expectedReturn / 100 / 12;
    const monthlyInflation = inflationRate / 100 / 12;
    const realMonthlyReturn = (1 + monthlyReturn) / (1 + monthlyInflation) - 1;
    
    if (monthlySavings <= 0 || realMonthlyReturn <= 0) return 100;
    
    const numerator = Math.log((fireNumber * realMonthlyReturn / monthlySavings) + 1);
    const denominator = Math.log(1 + realMonthlyReturn);
    
    let months = numerator / denominator;
    
    if (currentSavings > 0) {
        const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + realMonthlyReturn, 12);
        const adjustedTarget = Math.max(0, fireNumber - futureValueOfCurrentSavings);
        
        if (adjustedTarget > 0) {
            months = Math.log((adjustedTarget * realMonthlyReturn / monthlySavings) + 1) / Math.log(1 + realMonthlyReturn);
        } else {
            months = 0;
        }
    }
    
    return Math.max(0, months / 12);
}

// Update FIRE Scenarios
function updateFIREScenarios() {
    const scenariosContainer = document.getElementById('fireScenarios');
    if (!scenariosContainer) return;
    
    const state = fireCalculatorState;
    const scenarios = generateFIREScenarios(state);
    
    scenariosContainer.innerHTML = `
        <div class="scenarios-table">
            <div class="scenario-header">
                <div>Scenario</div>
                <div>Rendimento</div>
                <div>Anni al FIRE</div>
                <div>Età FIRE</div>
                <div>Probabilità</div>
            </div>
            ${scenarios.map(scenario => `
                <div class="scenario-row ${scenario.type}">
                    <div class="scenario-name">
                        <span class="scenario-icon">${scenario.icon}</span>
                        ${scenario.name}
                    </div>
                    <div class="scenario-return">${scenario.return}%</div>
                    <div class="scenario-years">${scenario.years.toFixed(1)}</div>
                    <div class="scenario-age">${Math.round(state.currentAge + scenario.years)}</div>
                    <div class="scenario-probability">${scenario.probability}%</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Generate FIRE Scenarios
function generateFIREScenarios(state) {
    const scenarios = [
        {
            name: 'Pessimistico',
            icon: '📉',
            type: 'pessimistic',
            return: state.expectedReturn - 2,
            probability: 20
        },
        {
            name: 'Conservativo',
            icon: '🛡️',
            type: 'conservative',
            return: state.expectedReturn - 1,
            probability: 30
        },
        {
            name: 'Realistico',
            icon: '🎯',
            type: 'realistic',
            return: state.expectedReturn,
            probability: 40
        },
        {
            name: 'Ottimistico',
            icon: '🚀',
            type: 'optimistic',
            return: state.expectedReturn + 1,
            probability: 25
        },
        {
            name: 'Molto Ottimistico',
            icon: '🌟',
            type: 'very-optimistic',
            return: state.expectedReturn + 2,
            probability: 10
        }
    ];
    
    scenarios.forEach(scenario => {
        scenario.years = calculateYearsToFIRE(
            state.currentSavings,
            state.monthlySavings,
            state.fireNumber,
            scenario.return,
            state.inflationRate
        );
    });
    
    return scenarios;
}

// Export FIRE Plan
function exportFIREPlan() {
    const state = fireCalculatorState;
    
    const planData = {
        timestamp: new Date().toISOString(),
        personalInfo: {
            currentAge: state.currentAge,
            currentSavings: state.currentSavings,
            monthlyIncome: state.monthlyIncome,
            monthlyExpenses: state.monthlyExpenses,
            monthlySavings: state.monthlySavings
        },
        investmentParams: {
            expectedReturn: state.expectedReturn,
            inflationRate: state.inflationRate,
            withdrawalRate: state.withdrawalRate
        },
        results: {
            fireNumber: state.fireNumber,
            yearsToFire: state.yearsToFire,
            fireAge: state.fireAge
        },
        strategies: generateFIREStrategies(state),
        scenarios: generateFIREScenarios(state)
    };
    
    // Create CSV content
    let csvContent = "Piano FIRE - GuadagnareConETF\n\n";
    csvContent += "SITUAZIONE ATTUALE\n";
    csvContent += `Età,${state.currentAge}\n`;
    csvContent += `Risparmi Attuali,${formatCurrency(state.currentSavings)}\n`;
    csvContent += `Reddito Mensile,${formatCurrency(state.monthlyIncome)}\n`;
    csvContent += `Spese Mensili,${formatCurrency(state.monthlyExpenses)}\n`;
    csvContent += `Risparmio Mensile,${formatCurrency(state.monthlySavings)}\n\n`;
    
    csvContent += "PARAMETRI DI INVESTIMENTO\n";
    csvContent += `Rendimento Atteso,${state.expectedReturn}%\n`;
    csvContent += `Tasso di Inflazione,${state.inflationRate}%\n`;
    csvContent += `Tasso di Prelievo,${state.withdrawalRate}%\n\n`;
    
    csvContent += "RISULTATI\n";
    csvContent += `Numero FIRE,${formatCurrency(state.fireNumber)}\n`;
    csvContent += `Anni al FIRE,${state.yearsToFire.toFixed(1)}\n`;
    csvContent += `Età FIRE,${Math.round(state.fireAge)}\n\n`;
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `piano-fire-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast('Piano FIRE esportato con successo', 'success');
}

// Save FIRE Plan
function saveFIREPlan() {
    const state = fireCalculatorState;
    const planName = `Piano FIRE ${new Date().toLocaleDateString('it-IT')}`;
    
    const savedPlans = JSON.parse(localStorage.getItem('firePlans') || '[]');
    savedPlans.push({
        id: Date.now().toString(),
        name: planName,
        date: new Date().toISOString(),
        state: { ...state }
    });
    
    localStorage.setItem('firePlans', JSON.stringify(savedPlans));
    showToast('Piano FIRE salvato con successo', 'success');
}

// Share FIRE Results
function shareFIREResults() {
    const state = fireCalculatorState;
    
    const shareText = `🔥 Il mio Piano FIRE:\n` +
        `💰 Obiettivo: ${formatCurrency(state.fireNumber)}\n` +
        `⏰ Tempo rimanente: ${state.yearsToFire.toFixed(1)} anni\n` +
        `🎂 Età FIRE: ${Math.round(state.fireAge)} anni\n\n` +
        `Calcolato su GuadagnareConETF`;
    
    const shareData = {
        title: 'Il mio Piano FIRE',
        text: shareText,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Risultati copiati negli appunti', 'success');
        });
    }
}

// Add custom styles for FIRE calculator
const fireStyles = document.createElement('style');
fireStyles.textContent = `
    .fire-calculator-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .fire-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .fire-header h2 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #ff6b6b, #ffa500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .fire-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin-bottom: 3rem;
    }
    
    .fire-input-section {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .fire-input-section h3 {
        margin-bottom: 1.5rem;
        color: #1f2937;
        font-size: 1.25rem;
    }
    
    .input-grid {
        display: grid;
        gap: 1.5rem;
    }
    
    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .input-group label {
        font-weight: 600;
        color: #374151;
        font-size: 0.875rem;
    }
    
    .input-group input {
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.2s;
    }
    
    .input-group input:focus {
        outline: none;
        border-color: #3b82f6;
    }
    
    .input-group input[type="range"] {
        padding: 0;
        height: 0.5rem;
        background: #e5e7eb;
        border-radius: 0.25rem;
    }
    
    .input-unit {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
    }
    
    .fire-results {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .fire-summary {
        display: grid;
        gap: 1.5rem;
    }
    
    .fire-metric {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .metric-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
    }
    
    .metric-content {
        flex: 1;
    }
    
    .metric-label {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.25rem;
    }
    
    .metric-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }
    
    .metric-description {
        font-size: 0.75rem;
        color: #9ca3af;
    }
    
    .fire-charts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    
    .chart-container {
        height: 300px;
        background: white;
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .fire-strategies {
        margin-bottom: 3rem;
    }
    
    .fire-strategies h3 {
        margin-bottom: 1.5rem;
        color: #1f2937;
        font-size: 1.5rem;
    }
    
    .strategies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .strategy-card {
        display: flex;
        gap: 1rem;
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
    }
    
    .strategy-card:hover {
        transform: translateY(-2px);
    }
    
    .strategy-icon {
        font-size: 2rem;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f3f4f6;
        border-radius: 50%;
        flex-shrink: 0;
    }
    
    .strategy-content h4 {
        margin-bottom: 0.5rem;
        color: #1f2937;
    }
    
    .strategy-content p {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 0.75rem;
    }
    
    .strategy-impact {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .impact-label {
        font-size: 0.75rem;
        color: #9ca3af;
    }
    
    .impact-value {
        font-weight: 600;
        font-size: 0.875rem;
    }
    
    .impact-value.positive {
        color: #10b981;
    }
    
    .impact-value.neutral {
        color: #6b7280;
    }
    
    .fire-scenarios h3 {
        margin-bottom: 1.5rem;
        color: #1f2937;
        font-size: 1.5rem;
    }
    
    .scenarios-table {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .scenario-header {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .scenario-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f3f4f6;
        align-items: center;
    }
    
    .scenario-row:last-child {
        border-bottom: none;
    }
    
    .scenario-name {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    }
    
    .scenario-row.pessimistic {
        background: rgba(239, 68, 68, 0.05);
    }
    
    .scenario-row.conservative {
        background: rgba(245, 158, 11, 0.05);
    }
    
    .scenario-row.realistic {
        background: rgba(59, 130, 246, 0.05);
    }
    
    .scenario-row.optimistic {
        background: rgba(16, 185, 129, 0.05);
    }
    
    .scenario-row.very-optimistic {
        background: rgba(139, 92, 246, 0.05);
    }
    
    .fire-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .fire-actions .btn {
        min-width: 180px;
    }
    
    @media (max-width: 768px) {
        .fire-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .fire-charts {
            grid-template-columns: 1fr;
        }
        
        .strategies-grid {
            grid-template-columns: 1fr;
        }
        
        .scenario-header,
        .scenario-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }
        
        .scenario-header {
            display: none;
        }
        
        .scenario-row {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
        }
        
        .fire-actions {
            flex-direction: column;
        }
        
        .fire-actions .btn {
            min-width: auto;
        }
    }
`;
document.head.appendChild(fireStyles);