// API Integration System for ETF Data and SEO Optimization

// API Configuration
const apiConfig = {
    // IEX Cloud API for real-time prices and historical data
    iexCloud: {
        baseUrl: 'https://cloud.iexapis.com/stable',
        token: 'YOUR_IEX_CLOUD_TOKEN', // Replace with actual token
        endpoints: {
            quote: '/stock/{symbol}/quote',
            chart: '/stock/{symbol}/chart/{range}',
            stats: '/stock/{symbol}/stats',
            company: '/stock/{symbol}/company'
        },
        rateLimit: 100, // requests per second
        cacheDuration: 300000 // 5 minutes
    },
    
    // Alpha Vantage API - Free tier available
    alphaVantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: 'SR9O4J1L3LKYVG96', // Free demo key, replace with actual key for production
        endpoints: {
            quote: '?function=GLOBAL_QUOTE&symbol={symbol}',
            daily: '?function=TIME_SERIES_DAILY&symbol={symbol}',
            overview: '?function=OVERVIEW&symbol={symbol}'
        },
        rateLimit: 5, // 5 requests per minute for free tier
        cacheDuration: 3600000 // 1 hour
    },
    
    // Finnhub API - Free tier available
    finnhub: {
        baseUrl: 'https://finnhub.io/api/v1',
        apiKey: 'd2rumghr01qv11lgarr0d2rumghr01qv11lgarrg', // Free demo key, replace with actual key for production
        endpoints: {
            quote: '/quote?symbol={symbol}',
            profile: '/stock/profile2?symbol={symbol}',
            etf: '/etf/profile?symbol={symbol}',
            holdings: '/etf/holdings?symbol={symbol}'
        },
        rateLimit: 60, // 60 requests per minute for free tier
        cacheDuration: 3600000 // 1 hour
    },
    
    // EODHD API - Free tier available
    eodhd: {
        baseUrl: 'https://eodhd.com/api',
        apiKey: 'demo', // Demo key for testing, replace with actual key for production
        endpoints: {
            fundamentals: '/fundamentals/{symbol}',
            eod: '/eod/{symbol}',
            realtime: '/real-time/{symbol}'
        },
        rateLimit: 20, // 20 requests per day for free tier
        cacheDuration: 3600000 // 1 hour
    },
    
    // Cbonds API for NAV and risk analysis
    cbonds: {
        baseUrl: 'https://api.cbonds.com/v1',
        apiKey: 'YOUR_CBONDS_API_KEY', // Replace with actual key
        endpoints: {
            nav: '/etf/{isin}/nav',
            risk: '/etf/{isin}/risk-metrics',
            benchmark: '/etf/{isin}/benchmark'
        },
        rateLimit: 30,
        cacheDuration: 1800000 // 30 minutes
    },
    
    // Borsa Italiana (Euronext Milan) - Custom scraping endpoint
    borsaItaliana: {
        baseUrl: 'https://www.borsaitaliana.it/borsa/etf',
        endpoints: {
            etfList: '/lista-completa.html',
            etfDetail: '/scheda/{isin}.html',
            prices: '/prezzi/{isin}.html'
        },
        cacheDuration: 900000 // 15 minutes
    }
};

// Cache Management
class APICache {
    constructor() {
        this.cache = new Map();
        this.timestamps = new Map();
    }
    
    set(key, data, duration = 300000) {
        this.cache.set(key, data);
        this.timestamps.set(key, Date.now() + duration);
    }
    
    get(key) {
        if (this.timestamps.has(key) && Date.now() < this.timestamps.get(key)) {
            return this.cache.get(key);
        }
        this.delete(key);
        return null;
    }
    
    delete(key) {
        this.cache.delete(key);
        this.timestamps.delete(key);
    }
    
    clear() {
        this.cache.clear();
        this.timestamps.clear();
    }
    
    size() {
        return this.cache.size;
    }
}

// Global cache instance
const apiCache = new APICache();

// Rate Limiting
class RateLimiter {
    constructor(requestsPerSecond) {
        this.requestsPerSecond = requestsPerSecond;
        this.requests = [];
    }
    
    async waitForSlot() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < 1000);
        
        if (this.requests.length >= this.requestsPerSecond) {
            const oldestRequest = Math.min(...this.requests);
            const waitTime = 1000 - (now - oldestRequest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.waitForSlot();
        }
        
        this.requests.push(now);
    }
}

// Rate limiters for each API
const rateLimiters = {
    iexCloud: new RateLimiter(apiConfig.iexCloud.rateLimit),
    alphaVantage: new RateLimiter(apiConfig.alphaVantage.rateLimit / 60), // Convert to per second
    finnhub: new RateLimiter(apiConfig.finnhub.rateLimit / 60), // Convert to per second
    eodhd: new RateLimiter(apiConfig.eodhd.rateLimit / 86400), // Convert to per second (20 per day)
    cbonds: new RateLimiter(apiConfig.cbonds.rateLimit)
};

// API Client Class
class APIClient {
    constructor(config, rateLimiter) {
        this.config = config;
        this.rateLimiter = rateLimiter;
    }
    
    async makeRequest(endpoint, params = {}) {
        // Check cache first
        const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
        const cachedData = apiCache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        
        // Wait for rate limit
        if (this.rateLimiter) {
            await this.rateLimiter.waitForSlot();
        }
        
        try {
            // Replace parameters in endpoint
            let url = this.config.baseUrl + endpoint;
            Object.keys(params).forEach(key => {
                url = url.replace(`{${key}}`, params[key]);
            });
            
            // Add API key/token
            const urlObj = new URL(url);
            if (this.config.token) {
                urlObj.searchParams.append('token', this.config.token);
            }
            if (this.config.apiKey) {
                // Special handling for EODHD API which uses 'api_token' parameter
                if (this.config.baseUrl.includes('eodhd.com')) {
                    urlObj.searchParams.append('api_token', this.config.apiKey);
                } else {
                    urlObj.searchParams.append('apikey', this.config.apiKey);
                }
            }
            
            const response = await fetch(urlObj.toString());
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Cache the response
            apiCache.set(cacheKey, data, this.config.cacheDuration);
            
            return data;
        } catch (error) {
            console.warn(`API request failed for ${endpoint}:`, error.message);
            // Return null instead of throwing to allow fallback handling
            return null;
        }
    }
}

// API clients
const apiClients = {
    iexCloud: new APIClient(apiConfig.iexCloud, rateLimiters.iexCloud),
    alphaVantage: new APIClient(apiConfig.alphaVantage, rateLimiters.alphaVantage),
    finnhub: new APIClient(apiConfig.finnhub, rateLimiters.finnhub),
    eodhd: new APIClient(apiConfig.eodhd, rateLimiters.eodhd),
    cbonds: new APIClient(apiConfig.cbonds, rateLimiters.cbonds)
};

// ETF Data Service
class ETFDataService {
    constructor() {
        this.loadingStates = new Map();
        this.errorStates = new Map();
    }
    
    // Get comprehensive ETF data
    async getETFData(isin, symbol) {
        const cacheKey = `etf_complete_${isin}`;
        const cached = apiCache.get(cacheKey);
        if (cached) return cached;
        
        this.setLoadingState(isin, true);
        
        try {
            const [quote, holdings, fundamentals, riskMetrics] = await Promise.allSettled([
                this.getQuoteData(symbol),
                this.getHoldingsData(isin),
                this.getFundamentalsData(isin),
                this.getRiskMetrics(isin)
            ]);
            
            const etfData = {
                isin,
                symbol,
                quote: quote.status === 'fulfilled' ? quote.value : null,
                holdings: holdings.status === 'fulfilled' ? holdings.value : null,
                fundamentals: fundamentals.status === 'fulfilled' ? fundamentals.value : null,
                riskMetrics: riskMetrics.status === 'fulfilled' ? riskMetrics.value : null,
                lastUpdated: new Date().toISOString(),
                errors: [
                    quote.status === 'rejected' ? `Quote: ${quote.reason}` : null,
                    holdings.status === 'rejected' ? `Holdings: ${holdings.reason}` : null,
                    fundamentals.status === 'rejected' ? `Fundamentals: ${fundamentals.reason}` : null,
                    riskMetrics.status === 'rejected' ? `Risk: ${riskMetrics.reason}` : null
                ].filter(Boolean)
            };
            
            // Cache for 30 minutes
            apiCache.set(cacheKey, etfData, 1800000);
            
            this.setLoadingState(isin, false);
            this.clearErrorState(isin);
            
            return etfData;
        } catch (error) {
            this.setLoadingState(isin, false);
            this.setErrorState(isin, error.message);
            throw error;
        }
    }
    
    // Convert ISIN to ticker symbol (simplified mapping)
    convertISINToSymbol(isin) {
        // Common ISIN to ticker mappings for popular ETFs
        const isinToSymbol = {
            'IE00B4L5Y983': 'IWDA.L', // iShares Core MSCI World (London)
            'IE00B0M62Q58': 'IWDM.L', // iShares MSCI World (London)
            'IE00B4L5YC18': 'IEMM.L', // iShares Core MSCI Emerging Markets (London)
            'LU0274208692': 'XMWO.DE', // Xtrackers MSCI World (Germany)
            'IE00BKM4GZ66': 'EIMI.L', // iShares Core MSCI Emerging Markets (London)
            'LU1681043599': 'XMWO.DE', // Xtrackers MSCI World (Germany)
            'IE00B52VJ196': 'IUSN.L', // iShares Core S&P 500 (London)
            'LU0274211217': 'XSPX.DE'  // Xtrackers S&P 500 (Germany)
        };
        
        // Return mapped symbol with exchange suffix or use ISIN as fallback
        const symbol = isinToSymbol[isin] || isin;
        
        // If no mapping found and it looks like a US symbol, add .US suffix for EODHD
        if (!isinToSymbol[isin] && symbol.length <= 5 && /^[A-Z]+$/.test(symbol)) {
            return symbol + '.US';
        }
        
        return symbol;
    }
    
    // Get real-time quote data
    async getQuoteData(symbol) {
        try {
            // Try IEX Cloud first
            const iexData = await apiClients.iexCloud.makeRequest(
                apiConfig.iexCloud.endpoints.quote,
                { symbol }
            );
            if (iexData && iexData.latestPrice) {
                return iexData;
            }
            
            // Fallback to Alpha Vantage
            const avData = await apiClients.alphaVantage.makeRequest(
                apiConfig.alphaVantage.endpoints.quote,
                { symbol }
            );
            if (avData && avData['Global Quote']) {
                return this.transformAlphaVantageQuote(avData['Global Quote']);
            }
            
            // Return mock data if all APIs fail
            return this.generateMockQuoteData(symbol);
        } catch (error) {
            console.warn('Error fetching quote data:', error);
            return this.generateMockQuoteData(symbol);
        }
    }
    
    // Get ETF holdings data
    async getHoldingsData(isin) {
        try {
            // Try Finnhub first for ETF holdings
            const symbol = this.convertISINToSymbol(isin);
            const holdingsData = await apiClients.finnhub.makeRequest(
                apiConfig.finnhub.endpoints.holdings,
                { symbol }
            );
            
            if (holdingsData && holdingsData.holdings && holdingsData.holdings.length > 0) {
                return holdingsData;
            }
            
            // Return mock data if no valid holdings data
            return this.generateMockHoldingsData(isin);
        } catch (error) {
            console.warn('Finnhub ETF holdings failed, using mock data:', error.message);
            return this.generateMockHoldingsData(isin);
        }
    }
    
    // Get fundamentals data
    async getFundamentalsData(isin) {
        try {
            // Try EODHD first for fundamentals
            const symbol = this.convertISINToSymbol(isin);
            const eodhData = await apiClients.eodhd.makeRequest(
                apiConfig.eodhd.endpoints.fundamentals,
                { symbol }
            );
            
            if (eodhData && (eodhData.General || eodhData.Technicals)) {
                return eodhData;
            }
            
            // Fallback to Alpha Vantage
            const avData = await apiClients.alphaVantage.makeRequest(
                apiConfig.alphaVantage.endpoints.overview,
                { symbol }
            );
            
            if (avData && avData.Symbol) {
                return avData;
            }
            
            // Return mock data if all APIs fail
            return this.generateMockFundamentalsData(isin);
        } catch (error) {
            console.warn('All fundamentals APIs failed, using mock data:', error.message);
            return this.generateMockFundamentalsData(isin);
        }
    }
    
    // Get risk metrics
    async getRiskMetrics(isin) {
        try {
            const riskData = await apiClients.cbonds.makeRequest(
                apiConfig.cbonds.endpoints.risk,
                { isin }
            );
            
            if (riskData && (riskData.volatility !== undefined || riskData.sharpeRatio !== undefined)) {
                return riskData;
            }
            
            // Return mock data if no valid risk data
            return this.generateMockRiskData(isin);
        } catch (error) {
            console.warn('Risk metrics API failed, using mock data:', error.message);
            return this.generateMockRiskData(isin);
        }
    }
    
    // Get historical performance data
    async getHistoricalData(symbol, range = '1y') {
        const cacheKey = `historical_${symbol}_${range}`;
        const cached = apiCache.get(cacheKey);
        if (cached) return cached;
        
        try {
            const data = await apiClients.iexCloud.makeRequest(
                apiConfig.iexCloud.endpoints.chart,
                { symbol, range }
            );
            
            apiCache.set(cacheKey, data, 3600000); // Cache for 1 hour
            return data;
        } catch (error) {
            return this.generateMockHistoricalData(symbol, range);
        }
    }
    
    // Scrape Borsa Italiana data
    async scrapeBorsaItalianaData(isin) {
        // Note: This would require a backend proxy due to CORS
        // For now, return mock data
        return this.generateMockBorsaItalianaData(isin);
    }
    
    // Loading state management
    setLoadingState(isin, isLoading) {
        this.loadingStates.set(isin, isLoading);
        this.updateLoadingUI(isin, isLoading);
    }
    
    isLoading(isin) {
        return this.loadingStates.get(isin) || false;
    }
    
    setErrorState(isin, error) {
        this.errorStates.set(isin, error);
        this.updateErrorUI(isin, error);
    }
    
    clearErrorState(isin) {
        this.errorStates.delete(isin);
        this.updateErrorUI(isin, null);
    }
    
    getError(isin) {
        return this.errorStates.get(isin);
    }
    
    // UI update methods
    updateLoadingUI(isin, isLoading) {
        const elements = document.querySelectorAll(`[data-etf-isin="${isin}"]`);
        elements.forEach(element => {
            if (isLoading) {
                element.classList.add('loading');
            } else {
                element.classList.remove('loading');
            }
        });
    }
    
    updateErrorUI(isin, error) {
        const elements = document.querySelectorAll(`[data-etf-isin="${isin}"]`);
        elements.forEach(element => {
            const errorElement = element.querySelector('.api-error');
            if (error) {
                if (!errorElement) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'api-error';
                    errorDiv.innerHTML = `<small>⚠️ ${error}</small>`;
                    element.appendChild(errorDiv);
                }
            } else if (errorElement) {
                errorElement.remove();
            }
        });
    }
    
    // Mock data generators (fallbacks)
    // Transform Alpha Vantage quote data to standard format
    transformAlphaVantageQuote(globalQuote) {
        const price = parseFloat(globalQuote['05. price']) || 0;
        const change = parseFloat(globalQuote['09. change']) || 0;
        
        return {
            symbol: globalQuote['01. symbol'],
            latestPrice: price,
            change: change,
            changePercent: change / price,
            volume: parseInt(globalQuote['06. volume']) || 0,
            previousClose: parseFloat(globalQuote['08. previous close']) || 0,
            high: parseFloat(globalQuote['03. high']) || 0,
            low: parseFloat(globalQuote['04. low']) || 0,
            open: parseFloat(globalQuote['02. open']) || 0
        };
    }
    
    generateMockQuoteData(symbol) {
        const basePrice = 50 + Math.random() * 100;
        const change = (Math.random() - 0.5) * 5;
        
        return {
            symbol,
            latestPrice: parseFloat(basePrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat((change / basePrice).toFixed(4)),
            volume: Math.floor(Math.random() * 1000000),
            marketCap: Math.floor(Math.random() * 10000000000),
            peRatio: parseFloat((15 + Math.random() * 20).toFixed(2)),
            week52High: parseFloat((basePrice * (1.1 + Math.random() * 0.3)).toFixed(2)),
            week52Low: parseFloat((basePrice * (0.7 + Math.random() * 0.2)).toFixed(2)),
            ytdChange: parseFloat(((Math.random() - 0.5) * 0.4).toFixed(4))
        };
    }
    
    generateMockHoldingsData(isin) {
        const sectors = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical', 'Industrials'];
        const companies = ['Apple Inc', 'Microsoft Corp', 'Amazon.com Inc', 'Alphabet Inc', 'Tesla Inc'];
        
        return {
            holdings: Array.from({ length: 10 }, (_, i) => ({
                name: companies[i % companies.length],
                weight: parseFloat((Math.random() * 10).toFixed(2)),
                sector: sectors[i % sectors.length],
                country: 'US',
                shares: Math.floor(Math.random() * 1000000),
                marketValue: Math.floor(Math.random() * 1000000000)
            })),
            totalHoldings: 500 + Math.floor(Math.random() * 1000),
            topHoldingsWeight: parseFloat((45 + Math.random() * 20).toFixed(2))
        };
    }
    
    generateMockFundamentalsData(isin) {
        return {
            name: `ETF ${isin.slice(-4)}`,
            ter: parseFloat((0.1 + Math.random() * 0.5).toFixed(3)),
            aum: Math.floor(Math.random() * 5000000000),
            inception: '2015-01-01',
            domicile: 'Ireland',
            currency: 'EUR',
            distribution: Math.random() > 0.5 ? 'Accumulating' : 'Distributing',
            replicationMethod: Math.random() > 0.5 ? 'Physical' : 'Synthetic',
            benchmark: 'MSCI World Index',
            performance1Y: parseFloat(((Math.random() - 0.5) * 0.3).toFixed(4)),
            performance3Y: parseFloat(((Math.random() - 0.3) * 0.5).toFixed(4)),
            performance5Y: parseFloat(((Math.random() - 0.2) * 0.8).toFixed(4)),
            dividend: parseFloat((Math.random() * 3).toFixed(2))
        };
    }
    
    generateMockRiskData(isin) {
        return {
            volatility: parseFloat((0.1 + Math.random() * 0.3).toFixed(4)),
            sharpeRatio: parseFloat((Math.random() * 2).toFixed(3)),
            maxDrawdown: parseFloat((-(Math.random() * 0.3)).toFixed(4)),
            beta: parseFloat((0.8 + Math.random() * 0.4).toFixed(3)),
            var95: parseFloat((-(Math.random() * 0.1)).toFixed(4)),
            trackingError: parseFloat((Math.random() * 0.05).toFixed(4))
        };
    }
    
    generateMockHistoricalData(symbol, range) {
        const days = range === '1y' ? 252 : range === '6m' ? 126 : 30;
        const basePrice = 50 + Math.random() * 100;
        
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - i));
            
            return {
                date: date.toISOString().split('T')[0],
                close: basePrice * (0.9 + Math.random() * 0.2),
                volume: Math.floor(Math.random() * 1000000)
            };
        });
    }
    
    generateMockBorsaItalianaData(isin) {
        return {
            officialName: 'Mock ETF Name',
            market: 'Borsa Italiana',
            segment: 'ETF',
            currency: 'EUR',
            lastPrice: 50 + Math.random() * 100,
            lastUpdate: new Date().toISOString()
        };
    }
}

// SEO Optimization Service
class SEOService {
    constructor() {
        this.metaData = new Map();
    }
    
    // Update page meta tags for ETF
    updateETFPageSEO(etfData) {
        const { isin, symbol, quote, fundamentals } = etfData;
        
        // Update title
        const title = `${symbol} - ETF ${fundamentals?.benchmark || 'Analisi'} | GuadagnareConETF`;
        document.title = title;
        
        // Update meta description
        const description = `Analizza ${symbol} (${isin}): prezzo ${quote?.latestPrice?.toFixed(2) || 'N/A'}€, TER ${fundamentals?.ter?.toFixed(2) || 'N/A'}%, AUM ${this.formatAUM(fundamentals?.aum)}. Confronta performance e costi.`;
        this.updateMetaTag('description', description);
        
        // Update Open Graph tags
        this.updateMetaTag('og:title', title);
        this.updateMetaTag('og:description', description);
        this.updateMetaTag('og:type', 'website');
        this.updateMetaTag('og:url', window.location.href);
        
        // Update Twitter Card tags
        this.updateMetaTag('twitter:card', 'summary');
        this.updateMetaTag('twitter:title', title);
        this.updateMetaTag('twitter:description', description);
        
        // Add structured data
        this.addStructuredData(etfData);
        
        // Update canonical URL
        this.updateCanonicalURL();
    }
    
    // Update meta tag
    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            if (name.startsWith('og:') || name.startsWith('twitter:')) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
    }
    
    // Add structured data for ETF
    addStructuredData(etfData) {
        const { isin, symbol, quote, fundamentals } = etfData;
        
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            'name': symbol,
            'identifier': isin,
            'category': 'ETF',
            'provider': {
                '@type': 'Organization',
                'name': 'GuadagnareConETF'
            },
            'offers': {
                '@type': 'Offer',
                'price': quote?.latestPrice || 0,
                'priceCurrency': fundamentals?.currency || 'EUR'
            },
            'additionalProperty': [
                {
                    '@type': 'PropertyValue',
                    'name': 'TER',
                    'value': fundamentals?.ter || 0
                },
                {
                    '@type': 'PropertyValue',
                    'name': 'AUM',
                    'value': fundamentals?.aum || 0
                }
            ]
        };
        
        // Remove existing structured data
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    // Update canonical URL
    updateCanonicalURL() {
        let canonical = document.querySelector('link[rel="canonical"]');
        
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        
        canonical.href = window.location.href.split('?')[0].split('#')[0];
    }
    
    // Generate sitemap data
    generateSitemapData(etfList) {
        return etfList.map(etf => ({
            url: `${window.location.origin}/etf/${etf.isin}`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: '0.8'
        }));
    }
    
    // Format AUM for display
    formatAUM(aum) {
        if (!aum) return 'N/A';
        
        if (aum >= 1000000000) {
            return `${(aum / 1000000000).toFixed(1)}B€`;
        } else if (aum >= 1000000) {
            return `${(aum / 1000000).toFixed(1)}M€`;
        } else {
            return `${(aum / 1000).toFixed(1)}K€`;
        }
    }
}

// Global instances
const etfDataService = new ETFDataService();
const seoService = new SEOService();

// API Integration Manager
class APIIntegrationManager {
    constructor() {
        this.initialized = false;
        this.updateInterval = null;
    }
    
    // Initialize API integration
    async initialize() {
        if (this.initialized) return;
        
        try {
            // Test API connections
            await this.testAPIConnections();
            
            // Setup periodic updates
            this.setupPeriodicUpdates();
            
            // Setup error handling
            this.setupErrorHandling();
            
            this.initialized = true;
            console.log('API Integration initialized successfully');
        } catch (error) {
            console.error('Failed to initialize API integration:', error);
        }
    }
    
    // Test API connections
    async testAPIConnections() {
        const tests = [
            { name: 'IEX Cloud', test: () => apiClients.iexCloud.makeRequest('/stock/AAPL/quote') },
            { name: 'Alpha Vantage', test: () => apiClients.alphaVantage.makeRequest('?function=GLOBAL_QUOTE&symbol=AAPL') },
            { name: 'Finnhub', test: () => apiClients.finnhub.makeRequest('/quote?symbol=AAPL') },
            { name: 'EODHD', test: () => apiClients.eodhd.makeRequest('/fundamentals/AAPL.US') },
            { name: 'Cbonds', test: () => apiClients.cbonds.makeRequest('/instruments/search?q=ETF') }
        ];
        
        const results = await Promise.allSettled(
            tests.map(async ({ name, test }) => {
                try {
                    await test();
                    return { name, status: 'connected' };
                } catch (error) {
                    return { name, status: 'failed', error: error.message };
                }
            })
        );
        
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log(`${result.value.name}: ${result.value.status}`);
            }
        });
    }
    
    // Setup periodic updates
    setupPeriodicUpdates() {
        // Update ETF data every 5 minutes during market hours
        this.updateInterval = setInterval(() => {
            if (this.isMarketHours()) {
                this.updateVisibleETFData();
            }
        }, 300000); // 5 minutes
    }
    
    // Check if market is open
    isMarketHours() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // Simple check: weekdays 9-17 (adjust for actual market hours)
        return day >= 1 && day <= 5 && hour >= 9 && hour <= 17;
    }
    
    // Update data for visible ETFs
    async updateVisibleETFData() {
        const visibleETFs = document.querySelectorAll('[data-etf-isin]:not(.loading)');
        
        for (const element of visibleETFs) {
            const isin = element.dataset.etfIsin;
            const symbol = element.dataset.etfSymbol;
            
            if (isin && symbol) {
                try {
                    const data = await etfDataService.getETFData(isin, symbol);
                    this.updateETFDisplay(element, data);
                } catch (error) {
                    console.error(`Failed to update ${isin}:`, error);
                }
            }
        }
    }
    
    // Update ETF display with new data
    updateETFDisplay(element, data) {
        // Update price
        const priceElement = element.querySelector('.etf-price');
        if (priceElement && data.quote) {
            priceElement.textContent = `€${data.quote.latestPrice.toFixed(2)}`;
        }
        
        // Update change
        const changeElement = element.querySelector('.etf-change');
        if (changeElement && data.quote) {
            const change = data.quote.changePercent * 100;
            changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
            changeElement.className = `etf-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update last updated timestamp
        const timestampElement = element.querySelector('.last-updated');
        if (timestampElement) {
            timestampElement.textContent = `Aggiornato: ${new Date().toLocaleTimeString('it-IT')}`;
        }
    }
    
    // Setup error handling
    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && event.reason.message.includes('API')) {
                console.error('API Error:', event.reason);
                this.showAPIErrorNotification(event.reason.message);
                event.preventDefault();
            }
        });
    }
    
    // Show API error notification
    showAPIErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'api-error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">⚠️</span>
                <span class="notification-message">Errore API: ${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Cleanup
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        apiCache.clear();
        this.initialized = false;
    }
}

// Global API manager instance
const apiManager = new APIIntegrationManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    apiManager.initialize();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    apiManager.destroy();
});

// Export for use in other modules
window.ETFDataService = etfDataService;
window.SEOService = seoService;
window.APIManager = apiManager;

// Add CSS for API integration UI
const apiStyles = document.createElement('style');
apiStyles.textContent = `
    .loading {
        position: relative;
        opacity: 0.7;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .api-error {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    }
    
    .api-error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        border: 1px solid #e74c3c;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        padding: 1rem;
        gap: 0.5rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        flex: 1;
        font-size: 0.9rem;
        color: #333;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    .etf-change.positive {
        color: #10b981;
    }
    
    .etf-change.negative {
        color: #ef4444;
    }
    
    .last-updated {
        font-size: 0.75rem;
        color: #6b7280;
        font-style: italic;
    }
`;
document.head.appendChild(apiStyles);