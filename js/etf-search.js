// ETF Search Engine with Advanced Filters

// ETF Database (in production this would come from API)
const ETF_DATABASE = [
    {
        isin: 'IE00BK5BQT80',
        name: 'Vanguard FTSE All-World UCITS ETF',
        ticker: 'VWCE',
        price: 108.45,
        currency: 'EUR',
        change: 1.23,
        changePercent: 1.15,
        ter: 0.22,
        aum: 15200000000,
        yield: 1.85,
        sector: 'azionario',
        region: 'globale',
        distribution: 'accumulating',
        domicile: 'Ireland',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'Medium',
        inceptionDate: '2019-07-23',
        benchmark: 'FTSE All-World Index',
        holdings: 3875,
        topHoldings: ['Apple Inc', 'Microsoft Corp', 'Amazon.com Inc'],
        sectorAllocation: {
            'Technology': 23.5,
            'Financial Services': 14.2,
            'Healthcare': 12.8,
            'Consumer Cyclical': 11.9,
            'Industrials': 9.7
        },
        geographicAllocation: {
            'United States': 61.2,
            'Japan': 5.8,
            'United Kingdom': 4.1,
            'China': 3.9,
            'Canada': 3.2
        }
    },
    {
        isin: 'IE00B4L5Y983',
        name: 'iShares Core MSCI World UCITS ETF',
        ticker: 'IWDA',
        price: 82.15,
        currency: 'EUR',
        change: -0.45,
        changePercent: -0.54,
        ter: 0.20,
        aum: 58700000000,
        yield: 1.92,
        sector: 'azionario',
        region: 'globale',
        distribution: 'accumulating',
        domicile: 'Ireland',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'Medium',
        inceptionDate: '2009-09-25',
        benchmark: 'MSCI World Index',
        holdings: 1512,
        topHoldings: ['Apple Inc', 'Microsoft Corp', 'Nvidia Corp'],
        sectorAllocation: {
            'Technology': 24.1,
            'Financial Services': 13.8,
            'Healthcare': 12.5,
            'Consumer Cyclical': 10.8,
            'Industrials': 9.2
        },
        geographicAllocation: {
            'United States': 70.5,
            'Japan': 6.1,
            'United Kingdom': 3.8,
            'Canada': 3.4,
            'France': 3.1
        }
    },
    {
        isin: 'LU0274209237',
        name: 'Xtrackers MSCI Europe UCITS ETF',
        ticker: 'XEUR',
        price: 75.89,
        currency: 'EUR',
        change: 0.78,
        changePercent: 1.04,
        ter: 0.12,
        aum: 4800000000,
        yield: 2.15,
        sector: 'azionario',
        region: 'europa',
        distribution: 'distributing',
        domicile: 'Luxembourg',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'Medium',
        inceptionDate: '2007-01-25',
        benchmark: 'MSCI Europe Index',
        holdings: 432,
        topHoldings: ['ASML Holding NV', 'Novo Nordisk A/S', 'LVMH Moet Hennessy'],
        sectorAllocation: {
            'Financial Services': 17.2,
            'Technology': 15.8,
            'Healthcare': 14.3,
            'Industrials': 13.1,
            'Consumer Cyclical': 11.9
        },
        geographicAllocation: {
            'France': 19.8,
            'Germany': 16.2,
            'United Kingdom': 15.1,
            'Switzerland': 14.7,
            'Netherlands': 12.3
        }
    },
    {
        isin: 'IE00B4L5YC18',
        name: 'iShares Core S&P 500 UCITS ETF',
        ticker: 'CSPX',
        price: 456.78,
        currency: 'EUR',
        change: 2.34,
        changePercent: 0.51,
        ter: 0.07,
        aum: 72300000000,
        yield: 1.45,
        sector: 'azionario',
        region: 'usa',
        distribution: 'accumulating',
        domicile: 'Ireland',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'Medium',
        inceptionDate: '2010-05-19',
        benchmark: 'S&P 500 Index',
        holdings: 503,
        topHoldings: ['Apple Inc', 'Microsoft Corp', 'Amazon.com Inc'],
        sectorAllocation: {
            'Technology': 29.2,
            'Financial Services': 12.8,
            'Healthcare': 12.1,
            'Consumer Cyclical': 10.4,
            'Communication Services': 8.7
        },
        geographicAllocation: {
            'United States': 100.0
        }
    },
    {
        isin: 'IE00BKM4GZ66',
        name: 'iShares Core MSCI Emerging Markets IMI UCITS ETF',
        ticker: 'EIMI',
        price: 28.45,
        currency: 'EUR',
        change: -0.23,
        changePercent: -0.80,
        ter: 0.18,
        aum: 18900000000,
        yield: 2.85,
        sector: 'azionario',
        region: 'emergenti',
        distribution: 'accumulating',
        domicile: 'Ireland',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'High',
        inceptionDate: '2014-12-15',
        benchmark: 'MSCI Emerging Markets IMI Index',
        holdings: 3045,
        topHoldings: ['Taiwan Semiconductor', 'Tencent Holdings', 'Samsung Electronics'],
        sectorAllocation: {
            'Technology': 21.8,
            'Financial Services': 19.2,
            'Consumer Cyclical': 12.4,
            'Communication Services': 9.8,
            'Energy': 7.1
        },
        geographicAllocation: {
            'China': 30.2,
            'India': 18.7,
            'Taiwan': 15.1,
            'South Korea': 12.8,
            'Brazil': 5.4
        }
    },
    {
        isin: 'LU0908500753',
        name: 'Lyxor Core STOXX Europe 600 UCITS ETF',
        ticker: 'MEUD',
        price: 156.23,
        currency: 'EUR',
        change: 1.45,
        changePercent: 0.94,
        ter: 0.07,
        aum: 3200000000,
        yield: 2.45,
        sector: 'azionario',
        region: 'europa',
        distribution: 'distributing',
        domicile: 'Luxembourg',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'Medium',
        inceptionDate: '2013-02-25',
        benchmark: 'STOXX Europe 600 Index',
        holdings: 600,
        topHoldings: ['ASML Holding NV', 'Novo Nordisk A/S', 'LVMH Moet Hennessy'],
        sectorAllocation: {
            'Financial Services': 16.8,
            'Technology': 15.2,
            'Healthcare': 14.1,
            'Industrials': 13.5,
            'Consumer Cyclical': 12.2
        },
        geographicAllocation: {
            'France': 18.9,
            'Germany': 16.8,
            'United Kingdom': 15.4,
            'Switzerland': 14.2,
            'Netherlands': 11.8
        }
    },
    {
        isin: 'IE00B14X4Q57',
        name: 'iShares Core Euro Government Bond UCITS ETF',
        ticker: 'IEAG',
        price: 124.67,
        currency: 'EUR',
        change: -0.12,
        changePercent: -0.10,
        ter: 0.09,
        aum: 12400000000,
        yield: 3.25,
        sector: 'obbligazionario',
        region: 'europa',
        distribution: 'distributing',
        domicile: 'Ireland',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'Low',
        inceptionDate: '2009-06-25',
        benchmark: 'Bloomberg Euro Treasury Index',
        holdings: 156,
        duration: 8.2,
        creditRating: 'AAA',
        sectorAllocation: {
            'Government Bonds': 100.0
        },
        geographicAllocation: {
            'Germany': 28.5,
            'France': 22.1,
            'Italy': 18.9,
            'Spain': 12.3,
            'Netherlands': 8.7
        }
    },
    {
        isin: 'IE00B3RBWM25',
        name: 'Vanguard FTSE Developed Europe UCITS ETF',
        ticker: 'VEUR',
        price: 32.45,
        currency: 'EUR',
        change: 0.34,
        changePercent: 1.06,
        ter: 0.10,
        aum: 8900000000,
        yield: 2.35,
        sector: 'azionario',
        region: 'europa',
        distribution: 'distributing',
        domicile: 'Ireland',
        replicationMethod: 'Physical',
        fundSize: 'Large',
        riskLevel: 'Medium',
        inceptionDate: '2012-05-22',
        benchmark: 'FTSE Developed Europe Index',
        holdings: 1234,
        topHoldings: ['ASML Holding NV', 'Novo Nordisk A/S', 'LVMH Moet Hennessy'],
        sectorAllocation: {
            'Financial Services': 17.5,
            'Technology': 15.9,
            'Healthcare': 14.8,
            'Industrials': 13.2,
            'Consumer Cyclical': 11.7
        },
        geographicAllocation: {
            'France': 19.2,
            'Germany': 16.8,
            'United Kingdom': 15.6,
            'Switzerland': 14.1,
            'Netherlands': 12.9
        }
    }
];

// Search State
let currentFilters = {
    search: '',
    sector: '',
    region: '',
    ter: 2.0,
    distribution: '',
    minAum: 0,
    maxAum: Infinity,
    riskLevel: '',
    sortBy: 'aum',
    sortOrder: 'desc'
};

let filteredETFs = [...ETF_DATABASE];

// Initialize Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

function initializeSearch() {
    setupSearchFilters();
    setupSorting();
    performSearch();
}

// Setup Search Filters
function setupSearchFilters() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    }
    
    // Sector filter
    const sectorFilter = document.getElementById('sectorFilter');
    if (sectorFilter) {
        sectorFilter.addEventListener('change', handleSectorFilter);
    }
    
    // Region filter
    const regionFilter = document.getElementById('regionFilter');
    if (regionFilter) {
        regionFilter.addEventListener('change', handleRegionFilter);
    }
    
    // TER filter
    const terFilter = document.getElementById('terFilter');
    const terValue = document.getElementById('terValue');
    if (terFilter && terValue) {
        terFilter.addEventListener('input', handleTerFilter);
        terValue.textContent = `${terFilter.value}%`;
    }
    
    // Distribution filter
    const distributionFilter = document.getElementById('distributionFilter');
    if (distributionFilter) {
        distributionFilter.addEventListener('change', handleDistributionFilter);
    }
    
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

// Setup Sorting
function setupSorting() {
    // Add sorting controls to the search results area
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        const sortingControls = createSortingControls();
        searchResults.parentNode.insertBefore(sortingControls, searchResults);
    }
}

// Create Sorting Controls
function createSortingControls() {
    const sortingDiv = document.createElement('div');
    sortingDiv.className = 'sorting-controls';
    sortingDiv.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    `;
    
    sortingDiv.innerHTML = `
        <div class="results-count">
            <span id="resultsCount">0 ETF trovati</span>
        </div>
        <div class="sort-options">
            <label for="sortSelect">Ordina per:</label>
            <select id="sortSelect">
                <option value="aum-desc">Patrimonio (Alto → Basso)</option>
                <option value="aum-asc">Patrimonio (Basso → Alto)</option>
                <option value="ter-asc">TER (Basso → Alto)</option>
                <option value="ter-desc">TER (Alto → Basso)</option>
                <option value="yield-desc">Rendimento (Alto → Basso)</option>
                <option value="yield-asc">Rendimento (Basso → Alto)</option>
                <option value="name-asc">Nome (A → Z)</option>
                <option value="name-desc">Nome (Z → A)</option>
            </select>
        </div>
    `;
    
    // Add event listener for sorting
    const sortSelect = sortingDiv.querySelector('#sortSelect');
    sortSelect.addEventListener('change', handleSortChange);
    
    return sortingDiv;
}

// Filter Handlers
function handleSearchInput(event) {
    currentFilters.search = event.target.value.toLowerCase();
    performSearch();
}

function handleSectorFilter(event) {
    currentFilters.sector = event.target.value;
    performSearch();
}

function handleRegionFilter(event) {
    currentFilters.region = event.target.value;
    performSearch();
}

function handleTerFilter(event) {
    currentFilters.ter = parseFloat(event.target.value);
    const terValue = document.getElementById('terValue');
    if (terValue) {
        terValue.textContent = `${event.target.value}%`;
    }
    performSearch();
}

function handleDistributionFilter(event) {
    currentFilters.distribution = event.target.value;
    performSearch();
}

function handleSortChange(event) {
    const [sortBy, sortOrder] = event.target.value.split('-');
    currentFilters.sortBy = sortBy;
    currentFilters.sortOrder = sortOrder;
    performSearch();
}

// Perform Search
function performSearch() {
    // Show loading state
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        showLoading(searchResults);
    }
    
    // Simulate API delay
    setTimeout(() => {
        filteredETFs = filterETFs(ETF_DATABASE, currentFilters);
        sortETFs(filteredETFs, currentFilters.sortBy, currentFilters.sortOrder);
        displaySearchResults(filteredETFs);
        updateResultsCount(filteredETFs.length);
        
        if (searchResults) {
            hideLoading(searchResults);
        }
    }, 500);
}

// Filter ETFs
function filterETFs(etfs, filters) {
    return etfs.filter(etf => {
        // Search filter (name, ISIN, ticker)
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch = 
                etf.name.toLowerCase().includes(searchTerm) ||
                etf.isin.toLowerCase().includes(searchTerm) ||
                etf.ticker.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
        
        // Sector filter
        if (filters.sector && etf.sector !== filters.sector) {
            return false;
        }
        
        // Region filter
        if (filters.region && etf.region !== filters.region) {
            return false;
        }
        
        // TER filter
        if (etf.ter > filters.ter) {
            return false;
        }
        
        // Distribution filter
        if (filters.distribution && etf.distribution !== filters.distribution) {
            return false;
        }
        
        // AUM filter
        if (etf.aum < filters.minAum || etf.aum > filters.maxAum) {
            return false;
        }
        
        // Risk level filter
        if (filters.riskLevel && etf.riskLevel !== filters.riskLevel) {
            return false;
        }
        
        return true;
    });
}

// Sort ETFs
function sortETFs(etfs, sortBy, sortOrder) {
    etfs.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'ter':
                valueA = a.ter;
                valueB = b.ter;
                break;
            case 'aum':
                valueA = a.aum;
                valueB = b.aum;
                break;
            case 'yield':
                valueA = a.yield;
                valueB = b.yield;
                break;
            case 'price':
                valueA = a.price;
                valueB = b.price;
                break;
            default:
                valueA = a.aum;
                valueB = b.aum;
        }
        
        if (sortOrder === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}

// Display Search Results
function displaySearchResults(etfs) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    
    if (etfs.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <h3>Nessun ETF trovato</h3>
                <p>Prova a modificare i filtri di ricerca per trovare ETF che corrispondono ai tuoi criteri.</p>
            </div>
        `;
        return;
    }
    
    etfs.forEach(etf => {
        const etfCard = createAdvancedETFCard(etf);
        searchResults.appendChild(etfCard);
    });
}

// Create Advanced ETF Card
function createAdvancedETFCard(etf) {
    const card = document.createElement('div');
    card.className = 'etf-card advanced-card';
    
    // Safe value extraction with defaults
    const change = etf.change || 0;
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '+' : '';
    const riskLevel = etf.riskLevel || 'Medium';
    const topHoldings = etf.topHoldings || [];
    const distribution = etf.distribution || 'N/A';
    
    card.innerHTML = `
        <div class="etf-header">
            <div class="etf-info">
                <div class="etf-name">${etf.name || 'N/A'}</div>
                <div class="etf-details">
                    <span class="etf-isin">${etf.isin || 'N/A'}</span>
                    <span class="etf-ticker">${etf.ticker || 'N/A'}</span>
                    <span class="etf-domicile">${etf.domicile || 'N/A'}</span>
                </div>
            </div>
            <div class="etf-price">
                <div class="price-value">${formatCurrency(etf.price)}</div>
                <div class="price-change ${changeClass}">
                    ${changeSymbol}${formatCurrency(change)} (${changeSymbol}${formatPercentage(etf.changePercent)})
                </div>
            </div>
        </div>
        
        <div class="etf-metrics">
            <div class="metric">
                <div class="metric-label">TER</div>
                <div class="metric-value">${formatPercentage(etf.ter)}</div>
            </div>
            <div class="metric">
                <div class="metric-label">AUM</div>
                <div class="metric-value">${formatAUM(etf.aum)}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Yield</div>
                <div class="metric-value">${formatPercentage(etf.yield)}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Rischio</div>
                <div class="metric-value risk-${riskLevel.toLowerCase()}">${riskLevel}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Holdings</div>
                <div class="metric-value">${formatNumber(etf.holdings)}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Distribuzione</div>
                <div class="metric-value">${distribution === 'accumulating' ? 'Acc.' : distribution === 'distributing' ? 'Dist.' : 'N/A'}</div>
            </div>
        </div>
        
        <div class="etf-allocation">
            <div class="allocation-section">
                <h4>Top Holdings</h4>
                <div class="top-holdings">
                    ${topHoldings.length > 0 ? topHoldings.slice(0, 3).map(holding => `<span class="holding">${holding}</span>`).join('') : '<span class="holding">N/A</span>'}
                </div>
            </div>
        </div>
        
        <div class="etf-actions">
            <button class="btn btn-secondary" onclick="addToComparison('${etf.isin || ''}')">
                <span>📊</span> Confronta
            </button>
            <button class="btn btn-secondary" onclick="addToPortfolio('${etf.isin || ''}')">
                <span>💼</span> Portafoglio
            </button>
            <button class="btn btn-primary" onclick="viewETFDetails('${etf.isin || ''}')">
                <span>👁️</span> Dettagli
            </button>
        </div>
    `;
    
    return card;
}

// Update Results Count
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${count} ETF ${count === 1 ? 'trovato' : 'trovati'}`;
    }
}

// Utility Functions
function formatAUM(aum) {
    if (aum >= 1000000000) {
        return `€${(aum / 1000000000).toFixed(1)}B`;
    } else if (aum >= 1000000) {
        return `€${(aum / 1000000).toFixed(0)}M`;
    } else {
        return `€${(aum / 1000).toFixed(0)}K`;
    }
}

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

// Advanced Search Functions
function searchByISIN(isin) {
    const etf = ETF_DATABASE.find(etf => etf.isin === isin);
    if (etf) {
        filteredETFs = [etf];
        displaySearchResults(filteredETFs);
        updateResultsCount(1);
        return etf;
    }
    return null;
}

function getETFsByRegion(region) {
    return ETF_DATABASE.filter(etf => etf.region === region);
}

function getETFsBySector(sector) {
    return ETF_DATABASE.filter(etf => etf.sector === sector);
}

function getTopETFsByAUM(limit = 10) {
    return [...ETF_DATABASE]
        .sort((a, b) => b.aum - a.aum)
        .slice(0, limit);
}

function getETFsWithLowTER(maxTer = 0.2) {
    return ETF_DATABASE.filter(etf => etf.ter <= maxTer);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ETF_DATABASE,
        searchByISIN,
        getETFsByRegion,
        getETFsBySector,
        getTopETFsByAUM,
        getETFsWithLowTER,
        filterETFs,
        sortETFs
    };
}

// Add custom styles for advanced search
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .advanced-card {
        border-left: 4px solid #2563eb;
    }
    
    .etf-details {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .etf-allocation {
        margin: 1rem 0;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 0.5rem;
    }
    
    .allocation-section h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
    }
    
    .top-holdings {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .holding {
        background: #e5e7eb;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        color: #374151;
    }
    
    .risk-low {
        color: #059669;
    }
    
    .risk-medium {
        color: #d97706;
    }
    
    .risk-high {
        color: #dc2626;
    }
    
    .no-results {
        text-align: center;
        padding: 3rem;
        color: #6b7280;
    }
    
    .sorting-controls select {
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        margin-left: 0.5rem;
    }
    
    .etf-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .etf-actions .btn {
        flex: 1;
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
    }
    
    .etf-actions .btn span {
        margin-right: 0.25rem;
    }
    
    @media (max-width: 768px) {
        .etf-details {
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .sorting-controls {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start !important;
        }
        
        .etf-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(searchStyles);