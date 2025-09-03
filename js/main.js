// Main JavaScript file for ETF Italia

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupSmoothScrolling();
    setupAnimations();
    loadInitialData();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add click handlers for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    // Already handled in CSS with scroll-behavior: smooth
    // This function can be used for additional smooth scrolling features
}

// Animation Setup
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.etf-card, .stat-item, .blog-card, .result-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Load Initial Data
function loadInitialData() {
    // Update ETF count in hero section
    updateETFCount();
    
    // Load featured ETFs
    loadFeaturedETFs();
    
    // Load latest blog posts
    loadLatestBlogPosts();
}

// Update ETF Count
function updateETFCount() {
    const etfCountElement = document.getElementById('etfCount');
    if (etfCountElement) {
        // Simulate API call to get ETF count
        setTimeout(() => {
            etfCountElement.textContent = '547+';
        }, 1000);
    }
}

// Load Featured ETFs
function loadFeaturedETFs() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        // Sample ETF data
        const featuredETFs = [
            {
                name: 'Vanguard FTSE All-World UCITS ETF',
                isin: 'IE00BK5BQT80',
                price: '€108.45',
                change: '+1.23%',
                changeType: 'positive',
                ter: '0.22%',
                aum: '€15.2B',
                yield: '1.85%',
                region: 'Globale'
            },
            {
                name: 'iShares Core MSCI World UCITS ETF',
                isin: 'IE00B4L5Y983',
                price: '€82.15',
                change: '-0.45%',
                changeType: 'negative',
                ter: '0.20%',
                aum: '€58.7B',
                yield: '1.92%',
                region: 'Globale'
            },
            {
                name: 'Xtrackers MSCI Europe UCITS ETF',
                isin: 'LU0274209237',
                price: '€75.89',
                change: '+0.78%',
                changeType: 'positive',
                ter: '0.12%',
                aum: '€4.8B',
                yield: '2.15%',
                region: 'Europa'
            }
        ];
        
        displayETFs(featuredETFs, searchResults);
    }
}

// Display ETFs
function displayETFs(etfs, container) {
    container.innerHTML = '';
    
    etfs.forEach(etf => {
        const etfCard = createETFCard(etf);
        container.appendChild(etfCard);
    });
}

// Create ETF Card
function createETFCard(etf) {
    const card = document.createElement('div');
    card.className = 'etf-card';
    
    card.innerHTML = `
        <div class="etf-header">
            <div class="etf-info">
                <div class="etf-name">${etf.name}</div>
                <div class="etf-isin">${etf.isin}</div>
            </div>
            <div class="etf-price">
                <div class="price-value">${etf.price}</div>
                <div class="price-change ${etf.changeType}">${etf.change}</div>
            </div>
        </div>
        <div class="etf-metrics">
            <div class="metric">
                <div class="metric-label">TER</div>
                <div class="metric-value">${etf.ter}</div>
            </div>
            <div class="metric">
                <div class="metric-label">AUM</div>
                <div class="metric-value">${etf.aum}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Yield</div>
                <div class="metric-value">${etf.yield}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Regione</div>
                <div class="metric-value">${etf.region}</div>
            </div>
        </div>
        <div class="etf-actions">
            <button class="btn btn-secondary" onclick="addToComparison('${etf.isin}')">Confronta</button>
            <button class="btn btn-primary" onclick="viewETFDetails('${etf.isin}')">Dettagli</button>
        </div>
    `;
    
    return card;
}

// Load Latest Blog Posts
function loadLatestBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (blogGrid) {
        // Sample blog posts
        const blogPosts = [
            {
                title: 'Analisi Mercati: ETF Azionari in Crescita nel Q4 2024',
                excerpt: 'I mercati azionari europei mostrano segnali positivi con gli ETF che registrano performance superiori alle aspettative...',
                date: '15 Gen 2024',
                readTime: '5 min',
                category: 'Analisi'
            },
            {
                title: 'Guida Completa agli ETF Obbligazionari Italiani',
                excerpt: 'Tutto quello che devi sapere sugli ETF obbligazionari quotati su Borsa Italiana per diversificare il tuo portafoglio...',
                date: '12 Gen 2024',
                readTime: '8 min',
                category: 'Guida'
            },
            {
                title: 'Strategia FIRE: Come Raggiungere l\'Indipendenza Finanziaria',
                excerpt: 'Scopri come utilizzare gli ETF per costruire una strategia FIRE efficace e raggiungere l\'indipendenza finanziaria...',
                date: '10 Gen 2024',
                readTime: '12 min',
                category: 'Strategia'
            }
        ];
        
        displayBlogPosts(blogPosts, blogGrid);
    }
}

// Display Blog Posts
function displayBlogPosts(posts, container) {
    container.innerHTML = '';
    
    posts.forEach(post => {
        const blogCard = createBlogCard(post);
        container.appendChild(blogCard);
    });
}

// Create Blog Card
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    
    card.innerHTML = `
        <div class="blog-image">📊</div>
        <div class="blog-content">
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-meta">
                <span class="blog-category">${post.category}</span>
                <span class="blog-date">${post.date} • ${post.readTime}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        // Navigate to blog post
        console.log('Navigate to blog post:', post.title);
    });
    
    return card;
}

// Utility Functions

// Format Currency
function formatCurrency(amount, currency = 'EUR') {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return 'N/A';
    }
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency
    }).format(Number(amount));
}

// Format Percentage
function formatPercentage(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    return `${Number(value).toFixed(decimals)}%`;
}

// Format Number
function formatNumber(value, decimals = 0) {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    return new Intl.NumberFormat('it-IT', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(Number(value));
}

// Show Loading State
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        element.appendChild(spinner);
    }
}

// Hide Loading State
function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        const spinner = element.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            toast.style.backgroundColor = '#059669';
            break;
        case 'error':
            toast.style.backgroundColor = '#dc2626';
            break;
        case 'warning':
            toast.style.backgroundColor = '#d97706';
            break;
        default:
            toast.style.backgroundColor = '#2563eb';
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Global Functions for ETF Operations

// Add ETF to Comparison
function addToComparison(isin) {
    console.log('Adding ETF to comparison:', isin);
    showToast('ETF aggiunto al comparatore', 'success');
    // This will be implemented in comparator.js
}

// View ETF Details
function viewETFDetails(isin) {
    console.log('Viewing ETF details:', isin);
    // This will navigate to ETF detail page
    showToast('Caricamento dettagli ETF...', 'info');
}

// Add ETF to Portfolio
function addToPortfolio(isin) {
    console.log('Adding ETF to portfolio:', isin);
    showToast('ETF aggiunto al portafoglio', 'success');
    // This will be implemented in portfolio.js
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showToast('Si è verificato un errore. Riprova più tardi.', 'error');
});

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatPercentage,
        formatNumber,
        showLoading,
        hideLoading,
        showToast,
        createETFCard,
        displayETFs
    };
}