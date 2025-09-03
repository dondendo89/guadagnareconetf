// Affiliate System for Italian Brokers

// Affiliate Configuration
const affiliateConfig = {
    brokers: {
        etoro: {
            name: 'eToro',
            logo: '🌟',
            description: 'Piattaforma di social trading leader mondiale',
            features: ['Copy Trading', 'ETF senza commissioni', 'App mobile avanzata'],
            minDeposit: 50,
            commission: 'Spread variabile',
            rating: 4.5,
            pros: ['Social trading', 'Interfaccia intuitiva', 'Regolamentato CySEC'],
            cons: ['Spread più alti', 'Prelievi a pagamento'],
            affiliateUrl: 'https://etoro.tw/3XXX', // Placeholder affiliate link
            trackingId: 'etoro_guadagnareconetf',
            color: '#17a2b8'
        },
        scalable: {
            name: 'Scalable Capital',
            logo: '📈',
            description: 'Broker tedesco con commissioni competitive',
            features: ['ETF gratuiti', 'Piani di accumulo', 'Robo-advisor'],
            minDeposit: 1,
            commission: '0.99€ per ordine',
            rating: 4.3,
            pros: ['Commissioni basse', 'Ampia selezione ETF', 'Piani di accumulo gratuiti'],
            cons: ['Solo in tedesco/inglese', 'Interfaccia complessa'],
            affiliateUrl: 'https://de.scalable.capital/XXX', // Placeholder affiliate link
            trackingId: 'scalable_guadagnareconetf',
            color: '#28a745'
        },
        traderepublic: {
            name: 'Trade Republic',
            logo: '📱',
            description: 'Broker mobile-first con commissioni minime',
            features: ['1€ per ordine', 'App mobile', 'ETF gratuiti'],
            minDeposit: 1,
            commission: '1€ per ordine',
            rating: 4.2,
            pros: ['Commissioni bassissime', 'App eccellente', 'ETF gratuiti'],
            cons: ['Solo mobile', 'Selezione limitata'],
            affiliateUrl: 'https://traderepublic.com/XXX', // Placeholder affiliate link
            trackingId: 'tr_guadagnareconetf',
            color: '#007bff'
        },
        degiro: {
            name: 'DEGIRO',
            logo: '🏦',
            description: 'Broker olandese con commissioni competitive',
            features: ['Commissioni basse', 'Ampia gamma prodotti', 'Piattaforma web'],
            minDeposit: 0,
            commission: '2€ + 0.03%',
            rating: 4.1,
            pros: ['Commissioni molto basse', 'Molti mercati', 'Trasparenza'],
            cons: ['Interfaccia datata', 'Servizio clienti limitato'],
            affiliateUrl: 'https://www.degiro.it/XXX', // Placeholder affiliate link
            trackingId: 'degiro_guadagnareconetf',
            color: '#ffc107'
        },
        freedom24: {
            name: 'Freedom24',
            logo: '🚀',
            description: 'Accesso ai mercati USA ed europei',
            features: ['Mercati USA', 'IPO', 'Commissioni competitive'],
            minDeposit: 1,
            commission: 'Da 2€',
            rating: 4.0,
            pros: ['Accesso IPO', 'Mercati internazionali', 'Piattaforma moderna'],
            cons: ['Meno conosciuto', 'Supporto limitato in italiano'],
            affiliateUrl: 'https://freedom24.com/XXX', // Placeholder affiliate link
            trackingId: 'freedom24_guadagnareconetf',
            color: '#6f42c1'
        }
    },
    tracking: {
        enabled: true,
        cookieDuration: 30, // days
        conversionTracking: true
    }
};

// Affiliate System State
let affiliateState = {
    userPreferences: {},
    clickHistory: [],
    recommendations: [],
    comparisonMode: false
};

// Initialize Affiliate System
document.addEventListener('DOMContentLoaded', function() {
    initializeAffiliateSystem();
    loadUserPreferences();
    setupAffiliateTracking();
});

function initializeAffiliateSystem() {
    createBrokerComparisonSection();
    createBrokerRecommendations();
    setupAffiliateButtons();
    loadAffiliateAnalytics();
}

// Create Broker Comparison Section
function createBrokerComparisonSection() {
    const existingSection = document.getElementById('broker-comparison');
    if (existingSection) {
        existingSection.innerHTML = generateBrokerComparisonHTML();
        return;
    }
    
    // Create new section if it doesn't exist
    const section = document.createElement('section');
    section.id = 'broker-comparison';
    section.className = 'broker-comparison-section';
    section.innerHTML = generateBrokerComparisonHTML();
    
    // Insert before footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.parentNode.insertBefore(section, footer);
    } else {
        document.body.appendChild(section);
    }
}

// Generate Broker Comparison HTML
function generateBrokerComparisonHTML() {
    return `
        <div class="container">
            <div class="broker-header">
                <h2>🏆 Migliori Broker per ETF in Italia</h2>
                <p>Confronta i broker più convenienti per investire in ETF</p>
                <div class="broker-filters">
                    <button class="filter-btn active" onclick="filterBrokers('all')">Tutti</button>
                    <button class="filter-btn" onclick="filterBrokers('low-cost')">Commissioni Basse</button>
                    <button class="filter-btn" onclick="filterBrokers('beginner')">Principianti</button>
                    <button class="filter-btn" onclick="filterBrokers('advanced')">Avanzati</button>
                </div>
            </div>
            
            <div class="brokers-grid" id="brokersGrid">
                ${Object.entries(affiliateConfig.brokers).map(([key, broker]) => 
                    generateBrokerCard(key, broker)
                ).join('')}
            </div>
            
            <div class="broker-comparison-table">
                <h3>Confronto Dettagliato</h3>
                <div class="comparison-table-container">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Broker</th>
                                <th>Commissioni ETF</th>
                                <th>Deposito Minimo</th>
                                <th>Piani di Accumulo</th>
                                <th>App Mobile</th>
                                <th>Valutazione</th>
                                <th>Azione</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(affiliateConfig.brokers).map(([key, broker]) => 
                                generateComparisonRow(key, broker)
                            ).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="broker-recommendations" id="brokerRecommendations">
                <!-- Recommendations will be populated here -->
            </div>
        </div>
    `;
}

// Generate Broker Card
function generateBrokerCard(key, broker) {
    return `
        <div class="broker-card" data-broker="${key}" data-category="${getBrokerCategory(broker)}">
            <div class="broker-card-header" style="background: ${broker.color}">
                <div class="broker-logo">${broker.logo}</div>
                <div class="broker-name">${broker.name}</div>
                <div class="broker-rating">
                    ${generateStarRating(broker.rating)}
                    <span class="rating-value">${broker.rating}</span>
                </div>
            </div>
            
            <div class="broker-card-body">
                <p class="broker-description">${broker.description}</p>
                
                <div class="broker-features">
                    <h4>Caratteristiche Principali:</h4>
                    <ul>
                        ${broker.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="broker-details">
                    <div class="detail-item">
                        <span class="detail-label">Deposito Minimo:</span>
                        <span class="detail-value">${broker.minDeposit === 0 ? 'Nessuno' : '€' + broker.minDeposit}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Commissioni:</span>
                        <span class="detail-value">${broker.commission}</span>
                    </div>
                </div>
                
                <div class="broker-pros-cons">
                    <div class="pros">
                        <h5>✅ Pro:</h5>
                        <ul>
                            ${broker.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="cons">
                        <h5>❌ Contro:</h5>
                        <ul>
                            ${broker.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="broker-card-footer">
                <button class="btn btn-primary affiliate-btn" 
                        onclick="trackAffiliateClick('${key}', 'card')" 
                        data-broker="${key}">
                    Apri Conto ${broker.name}
                </button>
                <button class="btn btn-secondary" onclick="showBrokerDetails('${key}')">
                    Dettagli
                </button>
            </div>
        </div>
    `;
}

// Generate Comparison Row
function generateComparisonRow(key, broker) {
    return `
        <tr>
            <td>
                <div class="broker-name-cell">
                    <span class="broker-logo-small">${broker.logo}</span>
                    ${broker.name}
                </div>
            </td>
            <td>${broker.commission}</td>
            <td>${broker.minDeposit === 0 ? 'Nessuno' : '€' + broker.minDeposit}</td>
            <td>${broker.features.includes('Piani di accumulo') ? '✅' : '❌'}</td>
            <td>${broker.features.includes('App mobile') || broker.features.includes('App mobile avanzata') ? '✅' : '❌'}</td>
            <td>
                <div class="rating-cell">
                    ${generateStarRating(broker.rating)}
                    <span>${broker.rating}</span>
                </div>
            </td>
            <td>
                <button class="btn btn-sm btn-primary affiliate-btn" 
                        onclick="trackAffiliateClick('${key}', 'table')" 
                        data-broker="${key}">
                    Apri Conto
                </button>
            </td>
        </tr>
    `;
}

// Generate Star Rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Get Broker Category
function getBrokerCategory(broker) {
    const categories = [];
    
    if (broker.commission.includes('0') || broker.commission.includes('gratuiti')) {
        categories.push('low-cost');
    }
    
    if (broker.features.includes('Copy Trading') || broker.description.includes('intuitiva')) {
        categories.push('beginner');
    }
    
    if (broker.features.includes('Robo-advisor') || broker.features.includes('Ampia gamma prodotti')) {
        categories.push('advanced');
    }
    
    return categories.join(' ');
}

// Filter Brokers
function filterBrokers(category) {
    const cards = document.querySelectorAll('.broker-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter cards
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category.includes(category)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Track filter usage
    trackEvent('broker_filter', { category });
}

// Track Affiliate Click
function trackAffiliateClick(brokerKey, source) {
    const broker = affiliateConfig.brokers[brokerKey];
    if (!broker) return;
    
    // Track click
    const clickData = {
        broker: brokerKey,
        source: source,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
    };
    
    // Store in local storage for analytics
    const clickHistory = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
    clickHistory.push(clickData);
    localStorage.setItem('affiliateClicks', JSON.stringify(clickHistory));
    
    // Set tracking cookie
    setTrackingCookie(brokerKey);
    
    // Show confirmation modal
    showAffiliateModal(broker);
    
    // Track event
    trackEvent('affiliate_click', clickData);
    
    // Delay redirect to ensure tracking
    setTimeout(() => {
        window.open(broker.affiliateUrl, '_blank');
    }, 1000);
}

// Show Affiliate Modal
function showAffiliateModal(broker) {
    const modal = document.createElement('div');
    modal.className = 'affiliate-modal';
    modal.innerHTML = `
        <div class="affiliate-modal-content">
            <div class="affiliate-modal-header">
                <h3>🚀 Stai per essere reindirizzato a ${broker.name}</h3>
                <button class="modal-close" onclick="closeAffiliateModal()">&times;</button>
            </div>
            <div class="affiliate-modal-body">
                <div class="broker-info">
                    <div class="broker-logo-large">${broker.logo}</div>
                    <p><strong>${broker.name}</strong> - ${broker.description}</p>
                </div>
                
                <div class="affiliate-benefits">
                    <h4>🎁 Vantaggi per te:</h4>
                    <ul>
                        <li>✅ Supporto gratuito da GuadagnareConETF</li>
                        <li>✅ Guide esclusive per iniziare</li>
                        <li>✅ Aggiornamenti sui migliori ETF</li>
                    </ul>
                </div>
                
                <div class="affiliate-disclaimer">
                    <p><small>⚠️ <strong>Disclaimer:</strong> Questo è un link affiliato. GuadagnareConETF riceve una commissione se apri un conto, senza costi aggiuntivi per te. Questo ci aiuta a mantenere il sito gratuito e aggiornato.</small></p>
                </div>
            </div>
            <div class="affiliate-modal-footer">
                <button class="btn btn-primary" onclick="proceedToAffiliate('${broker.name}')">
                    Continua verso ${broker.name}
                </button>
                <button class="btn btn-secondary" onclick="closeAffiliateModal()">
                    Annulla
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Affiliate Modal
function closeAffiliateModal() {
    const modal = document.querySelector('.affiliate-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Proceed to Affiliate
function proceedToAffiliate(brokerName) {
    closeAffiliateModal();
    showToast(`Reindirizzamento a ${brokerName} in corso...`, 'info');
}

// Set Tracking Cookie
function setTrackingCookie(brokerKey) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + affiliateConfig.tracking.cookieDuration);
    
    const cookieValue = {
        broker: brokerKey,
        timestamp: new Date().toISOString(),
        source: 'guadagnareconetf'
    };
    
    document.cookie = `affiliate_${brokerKey}=${JSON.stringify(cookieValue)}; expires=${expirationDate.toUTCString()}; path=/`;
}

// Setup Affiliate Tracking
function setupAffiliateTracking() {
    // Track page views
    trackEvent('page_view', {
        url: window.location.href,
        timestamp: new Date().toISOString()
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('scroll_depth', { percent: maxScroll });
            }
        }
    });
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', { seconds: timeOnPage });
    });
}

// Create Broker Recommendations
function createBrokerRecommendations() {
    const recommendationsContainer = document.getElementById('brokerRecommendations');
    if (!recommendationsContainer) return;
    
    const recommendations = generatePersonalizedRecommendations();
    
    recommendationsContainer.innerHTML = `
        <h3>🎯 Raccomandazioni Personalizzate</h3>
        <div class="recommendations-grid">
            ${recommendations.map(rec => `
                <div class="recommendation-card">
                    <div class="recommendation-header">
                        <h4>${rec.title}</h4>
                        <span class="recommendation-badge">${rec.badge}</span>
                    </div>
                    <p>${rec.description}</p>
                    <div class="recommended-broker">
                        <div class="broker-info">
                            <span class="broker-logo">${rec.broker.logo}</span>
                            <span class="broker-name">${rec.broker.name}</span>
                        </div>
                        <button class="btn btn-primary affiliate-btn" 
                                onclick="trackAffiliateClick('${rec.brokerKey}', 'recommendation')" 
                                data-broker="${rec.brokerKey}">
                            Scegli ${rec.broker.name}
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Generate Personalized Recommendations
function generatePersonalizedRecommendations() {
    return [
        {
            title: 'Migliore per Principianti',
            badge: '🌟 Consigliato',
            description: 'Perfetto per chi inizia con gli ETF. Interfaccia semplice e copy trading.',
            brokerKey: 'etoro',
            broker: affiliateConfig.brokers.etoro
        },
        {
            title: 'Commissioni più Basse',
            badge: '💰 Risparmio',
            description: 'Ideale per investitori attivi che vogliono minimizzare i costi.',
            brokerKey: 'scalable',
            broker: affiliateConfig.brokers.scalable
        },
        {
            title: 'Migliore App Mobile',
            badge: '📱 Mobile',
            description: 'Per chi preferisce investire dal telefono con un\'app moderna.',
            brokerKey: 'traderepublic',
            broker: affiliateConfig.brokers.traderepublic
        }
    ];
}

// Setup Affiliate Buttons
function setupAffiliateButtons() {
    // Add affiliate buttons to ETF cards
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('affiliate-btn')) {
            e.preventDefault();
            const brokerKey = e.target.dataset.broker;
            if (brokerKey) {
                trackAffiliateClick(brokerKey, 'button');
            }
        }
    });
    
    // Add affiliate links to ETF detail pages
    addAffiliateLinksToETFPages();
}

// Add Affiliate Links to ETF Pages
function addAffiliateLinksToETFPages() {
    const etfCards = document.querySelectorAll('[data-etf-id]');
    etfCards.forEach(card => {
        if (!card.querySelector('.affiliate-links')) {
            const affiliateLinks = document.createElement('div');
            affiliateLinks.className = 'affiliate-links';
            affiliateLinks.innerHTML = `
                <div class="affiliate-cta">
                    <p><small>💡 Investi in questo ETF con:</small></p>
                    <div class="quick-brokers">
                        <button class="btn btn-xs affiliate-btn" data-broker="etoro" onclick="trackAffiliateClick('etoro', 'etf_card')">
                            ${affiliateConfig.brokers.etoro.logo} eToro
                        </button>
                        <button class="btn btn-xs affiliate-btn" data-broker="scalable" onclick="trackAffiliateClick('scalable', 'etf_card')">
                            ${affiliateConfig.brokers.scalable.logo} Scalable
                        </button>
                        <button class="btn btn-xs affiliate-btn" data-broker="degiro" onclick="trackAffiliateClick('degiro', 'etf_card')">
                            ${affiliateConfig.brokers.degiro.logo} DEGIRO
                        </button>
                    </div>
                </div>
            `;
            card.appendChild(affiliateLinks);
        }
    });
}

// Show Broker Details
function showBrokerDetails(brokerKey) {
    const broker = affiliateConfig.brokers[brokerKey];
    if (!broker) return;
    
    const modal = document.createElement('div');
    modal.className = 'broker-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${broker.logo} ${broker.name}</h2>
                <button class="modal-close" onclick="closeBrokerDetails()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="broker-detailed-info">
                    <div class="info-section">
                        <h3>Informazioni Generali</h3>
                        <p>${broker.description}</p>
                        <div class="rating-large">
                            ${generateStarRating(broker.rating)}
                            <span class="rating-text">${broker.rating}/5 stelle</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h3>Caratteristiche</h3>
                        <ul class="features-list">
                            ${broker.features.map(feature => `<li>✅ ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h3>Costi e Commissioni</h3>
                        <div class="cost-details">
                            <div class="cost-item">
                                <span>Commissioni ETF:</span>
                                <span>${broker.commission}</span>
                            </div>
                            <div class="cost-item">
                                <span>Deposito Minimo:</span>
                                <span>${broker.minDeposit === 0 ? 'Nessuno' : '€' + broker.minDeposit}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pros-cons-detailed">
                        <div class="pros-section">
                            <h3>✅ Vantaggi</h3>
                            <ul>
                                ${broker.pros.map(pro => `<li>${pro}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="cons-section">
                            <h3>❌ Svantaggi</h3>
                            <ul>
                                ${broker.cons.map(con => `<li>${con}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary affiliate-btn" 
                        onclick="trackAffiliateClick('${brokerKey}', 'details_modal')" 
                        data-broker="${brokerKey}">
                    Apri Conto ${broker.name}
                </button>
                <button class="btn btn-secondary" onclick="closeBrokerDetails()">
                    Chiudi
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Broker Details
function closeBrokerDetails() {
    const modal = document.querySelector('.broker-details-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Load User Preferences
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    affiliateState.userPreferences = preferences;
}

// Save User Preferences
function saveUserPreferences(preferences) {
    affiliateState.userPreferences = { ...affiliateState.userPreferences, ...preferences };
    localStorage.setItem('userPreferences', JSON.stringify(affiliateState.userPreferences));
}

// Load Affiliate Analytics
function loadAffiliateAnalytics() {
    const analytics = JSON.parse(localStorage.getItem('affiliateAnalytics') || '{}');
    
    // Display popular brokers
    const popularBrokers = Object.entries(analytics.brokerClicks || {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    if (popularBrokers.length > 0) {
        displayPopularBrokers(popularBrokers);
    }
}

// Display Popular Brokers
function displayPopularBrokers(popularBrokers) {
    const container = document.querySelector('.broker-header');
    if (!container) return;
    
    const popularSection = document.createElement('div');
    popularSection.className = 'popular-brokers';
    popularSection.innerHTML = `
        <p><small>🔥 Più scelti dai nostri utenti: ${popularBrokers.map(([key]) => 
            affiliateConfig.brokers[key]?.name
        ).filter(Boolean).join(', ')}</small></p>
    `;
    
    container.appendChild(popularSection);
}

// Track Event
function trackEvent(eventName, data) {
    const analytics = JSON.parse(localStorage.getItem('affiliateAnalytics') || '{}');
    
    if (!analytics.events) analytics.events = [];
    analytics.events.push({
        name: eventName,
        data: data,
        timestamp: new Date().toISOString()
    });
    
    // Update broker click counts
    if (eventName === 'affiliate_click') {
        if (!analytics.brokerClicks) analytics.brokerClicks = {};
        analytics.brokerClicks[data.broker] = (analytics.brokerClicks[data.broker] || 0) + 1;
    }
    
    localStorage.setItem('affiliateAnalytics', JSON.stringify(analytics));
    
    // Send to external analytics if configured
    if (window.gtag) {
        window.gtag('event', eventName, data);
    }
}

// Add custom styles for affiliate system
const affiliateStyles = document.createElement('style');
affiliateStyles.textContent = `
    .broker-comparison-section {
        padding: 4rem 0;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    .broker-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .broker-header h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #1f2937;
    }
    
    .broker-filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #e5e7eb;
        background: white;
        border-radius: 2rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
    }
    
    .filter-btn:hover {
        border-color: #3b82f6;
        color: #3b82f6;
    }
    
    .filter-btn.active {
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
    }
    
    .brokers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
    }
    
    .broker-card {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .broker-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .broker-card-header {
        padding: 1.5rem;
        color: white;
        text-align: center;
    }
    
    .broker-logo {
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }
    
    .broker-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .broker-rating {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 1.25rem;
    }
    
    .broker-card-body {
        padding: 1.5rem;
    }
    
    .broker-description {
        color: #6b7280;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .broker-features h4 {
        margin-bottom: 0.75rem;
        color: #374151;
        font-size: 1rem;
    }
    
    .broker-features ul {
        list-style: none;
        padding: 0;
        margin-bottom: 1.5rem;
    }
    
    .broker-features li {
        padding: 0.25rem 0;
        color: #6b7280;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .broker-features li:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #10b981;
        font-weight: bold;
    }
    
    .broker-details {
        display: grid;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .detail-label {
        color: #6b7280;
        font-weight: 500;
    }
    
    .detail-value {
        font-weight: 600;
        color: #1f2937;
    }
    
    .broker-pros-cons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .pros h5, .cons h5 {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }
    
    .pros ul, .cons ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .pros li, .cons li {
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 0.25rem;
    }
    
    .broker-card-footer {
        padding: 1.5rem;
        background: #f9fafb;
        display: flex;
        gap: 1rem;
    }
    
    .broker-card-footer .btn {
        flex: 1;
    }
    
    .comparison-table-container {
        overflow-x: auto;
        margin: 2rem 0;
    }
    
    .comparison-table {
        width: 100%;
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .comparison-table th {
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
    }
    
    .broker-name-cell {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .broker-logo-small {
        font-size: 1.25rem;
    }
    
    .rating-cell {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .recommendation-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .recommendation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .recommendation-badge {
        background: #10b981;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .recommended-broker {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .affiliate-links {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .affiliate-cta p {
        margin-bottom: 0.5rem;
        color: #6b7280;
    }
    
    .quick-brokers {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .btn-xs {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
    }
    
    .affiliate-modal,
    .broker-details-modal {
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
    
    .affiliate-modal-content {
        background: white;
        margin: 5% auto;
        padding: 0;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .affiliate-modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .affiliate-modal-body {
        padding: 1.5rem;
    }
    
    .broker-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .broker-logo-large {
        font-size: 3rem;
    }
    
    .affiliate-benefits {
        margin-bottom: 1.5rem;
    }
    
    .affiliate-benefits ul {
        list-style: none;
        padding: 0;
        margin-top: 0.5rem;
    }
    
    .affiliate-benefits li {
        padding: 0.25rem 0;
        color: #374151;
    }
    
    .affiliate-disclaimer {
        background: #fef3c7;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #f59e0b;
    }
    
    .affiliate-modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 1rem;
    }
    
    .affiliate-modal-footer .btn {
        flex: 1;
    }
    
    .popular-brokers {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 2rem;
        display: inline-block;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 768px) {
        .brokers-grid {
            grid-template-columns: 1fr;
        }
        
        .broker-pros-cons {
            grid-template-columns: 1fr;
        }
        
        .broker-card-footer {
            flex-direction: column;
        }
        
        .comparison-table {
            font-size: 0.875rem;
        }
        
        .recommendations-grid {
            grid-template-columns: 1fr;
        }
        
        .recommended-broker {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }
    }
`;
document.head.appendChild(affiliateStyles);