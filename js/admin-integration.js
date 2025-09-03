// Admin Integration - Controls main site sections visibility
class AdminIntegration {
    constructor() {
        this.adminData = null;
        this.lastDataHash = null;
        this.refreshAttempts = 0;
        this.maxRefreshAttempts = 3;
        console.log('AdminIntegration: Initializing...');
        this.loadAdminData();
        console.log('AdminIntegration: Data loaded:', this.adminData);
        this.applySectionVisibility();
        this.initializeContent();
        
        // Check for changes every 1 second for faster response
        setInterval(() => {
            this.checkForUpdates();
        }, 1000);
        
        // Force initial check after DOM is fully loaded
        setTimeout(() => {
            this.forceRefresh();
        }, 500);
        
        // Listen for postMessage from admin panel
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'adminUpdate') {
                console.log('AdminIntegration: Received admin update via postMessage');
                this.adminData = event.data.data;
                this.applySectionVisibility();
            }
        });
        
        // Listen for localStorage changes from other tabs/windows
        window.addEventListener('storage', (event) => {
            if (event.key === 'adminUpdate') {
                console.log('AdminIntegration: Detected adminUpdate trigger');
                this.forceRefresh();
            }
        });
    }

    loadAdminData() {
        const savedData = localStorage.getItem('adminData');
        console.log('AdminIntegration: Loading admin data from localStorage:', savedData);
        
        if (savedData) {
            try {
                this.adminData = JSON.parse(savedData);
                console.log('AdminIntegration: Parsed admin data:', this.adminData);
            } catch (error) {
                console.error('AdminIntegration: Error parsing admin data:', error);
                this.adminData = null;
            }
        } else {
            console.log('AdminIntegration: No admin data found in localStorage');
            this.adminData = null;
        }
    }

    applySectionVisibility() {
        console.log('AdminIntegration: Applying section visibility...');
        
        // Get all sections in the page
        const allSections = ['home', 'ricerca', 'comparatore', 'simulatore', 'portafoglio', 'fire', 'brokers', 'blog'];
        
        if (!this.adminData || !this.adminData.sections) {
            console.log('AdminIntegration: No admin data - showing all sections');
            // Show all sections by default
            allSections.forEach(sectionKey => {
                this.showSection(sectionKey);
            });
            return;
        }

        const sections = this.adminData.sections;
        console.log('AdminIntegration: Processing sections:', sections);
        
        // First, hide all sections
        allSections.forEach(sectionKey => {
            this.hideSection(sectionKey);
        });
        
        // Then show only visible sections in correct order
        const sortedSections = Object.entries(sections)
            .filter(([key, data]) => data.visible)
            .sort((a, b) => a[1].order - b[1].order);
            
        console.log('AdminIntegration: Visible sections in order:', sortedSections);
        
        sortedSections.forEach(([sectionKey, sectionData]) => {
            this.showSection(sectionKey);
            this.reorderSection(sectionKey, sectionData.order);
        });
        
        // Force a layout recalculation
        document.body.offsetHeight;

        // Reorder sections based on admin settings
        this.reorderSections();
        
        // Reset refresh attempts counter on successful application
        this.refreshAttempts = 0;
        console.log('AdminIntegration: Section visibility applied successfully, reset refresh attempts');
    }

    reorderSections() {
        if (!this.adminData || !this.adminData.sections) {
            return;
        }

        const sections = this.adminData.sections;
        const mainContainer = document.querySelector('main') || document.querySelector('.main-content');
        
        if (!mainContainer) {
            return;
        }

        // Get all section elements
        const sectionElements = [];
        Object.entries(sections).forEach(([sectionKey, sectionData]) => {
            const element = document.getElementById(sectionKey);
            if (element) {
                sectionElements.push({
                    element,
                    order: sectionData.order,
                    key: sectionKey
                });
            }
        });

        // Sort by order
        sectionElements.sort((a, b) => a.order - b.order);

        // Reappend in correct order
        sectionElements.forEach(({ element }) => {
            mainContainer.appendChild(element);
        });
    }

    getBrokers() {
        if (!this.adminData || !this.adminData.brokers) {
            return [];
        }
        return this.adminData.brokers.filter(broker => broker.active);
    }

    getPublishedArticles() {
        if (!this.adminData || !this.adminData.articles) {
            return [];
        }
        return this.adminData.articles.filter(article => article.published);
    }

    renderBrokers(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        const brokers = this.getBrokers();
        
        let html = '<div class="brokers-list">';
        
        brokers.forEach(broker => {
            html += `
                <div class="broker-item">
                    <div class="broker-info">
                        <h3>${broker.name}</h3>
                        <p>${broker.description}</p>
                        <div class="broker-details">
                            <span class="commission">Commissioni: ${broker.commission}</span>
                            <div class="rating">
                                ${'★'.repeat(Math.floor(broker.rating))}${'☆'.repeat(5 - Math.floor(broker.rating))}
                                <span class="rating-value">${broker.rating}/5</span>
                            </div>
                        </div>
                    </div>
                    <div class="broker-actions">
                        <a href="${broker.affiliateLink}" target="_blank" class="btn btn-primary">
                            Apri Conto
                        </a>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add CSS if not already present
        if (!document.getElementById('broker-styles')) {
            const style = document.createElement('style');
            style.id = 'broker-styles';
            style.textContent = `
                .brokers-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1rem;
                    margin: 1rem 0;
                }
                .broker-item {
                    border: 1px solid #e1e5e9;
                    border-radius: 8px;
                    padding: 1.5rem;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .broker-info h3 {
                    margin: 0 0 1rem 0;
                    color: #333;
                    font-size: 1.2rem;
                }
                .broker-info p {
                    color: #666;
                    margin: 0 0 1rem 0;
                    line-height: 1.5;
                }
                .broker-details {
                    margin: 1rem 0;
                }
                .commission {
                    display: block;
                    font-weight: 600;
                    color: #27ae60;
                    margin-bottom: 0.5rem;
                }
                .rating {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #f39c12;
                }
                .rating-value {
                    color: #666;
                    font-size: 0.9rem;
                }
                .broker-actions {
                    margin-top: auto;
                }
                .broker-actions .btn {
                    width: 100%;
                    padding: 0.75rem;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                    transition: background-color 0.3s;
                }
                .broker-actions .btn-primary {
                    background: #667eea;
                    color: white;
                    border: none;
                }
                .broker-actions .btn-primary:hover {
                    background: #5a6fd8;
                }
            `;
            document.head.appendChild(style);
        }
        
        container.innerHTML = html;
    }

    renderArticles(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        const articles = this.getPublishedArticles();
        
        // If no published articles, show sample articles or let main.js handle it
        if (articles.length === 0) {
            console.log('AdminIntegration: No published articles found, keeping existing content or showing sample articles');
            // Don't override existing content if no admin articles are published
            if (container.children.length === 0) {
                // Only show "no articles" message if container is completely empty
                container.innerHTML = '<p class="no-articles">Nessun articolo pubblicato al momento.</p>';
            }
            return;
        }
        
        // Clear container and show admin articles
        container.innerHTML = '';
        
        articles.forEach(article => {
            const blogCard = this.createBlogCard(article);
            container.appendChild(blogCard);
        });
    }
    
    createBlogCard(article) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        
        // Get category emoji
        const categoryEmojis = {
            'analisi': '📊',
            'guida': '📚',
            'strategia': '🎯',
            'news': '📰',
            'tutorial': '🔧'
        };
        
        const emoji = categoryEmojis[article.category] || '📄';
        
        card.innerHTML = `
            <div class="blog-image">${emoji}</div>
            <div class="blog-content">
                <h3 class="blog-title">${article.title}</h3>
                <p class="blog-excerpt">${article.excerpt}</p>
                <div class="blog-meta">
                    <span class="blog-category">${article.category || 'Articolo'}</span>
                    <span class="blog-date">${article.date}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            // Create URL-friendly slug from title
            const slug = this.createSlug(article.title);
            const articleId = article.id || this.hashCode(article.title).toString();
            
            // Store article data in sessionStorage for the article page
            sessionStorage.setItem(`article_${articleId}`, JSON.stringify(article));
            
            // Navigate to article page
            window.location.href = `article.html?id=${articleId}&slug=${slug}`;
        });
        
        return card;
    }
    


    initializeContent() {
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            this.renderBrokers('brokersContainer');
            this.renderArticles('blogGrid');
        }, 100);
    }

    // Initialize blog page with all articles
    initializeBlogPage() {
        this.loadAdminData();
        // Don't apply section visibility on blog page
        // Don't call initializeContent as blog page has its own loading logic
    }

    // Method to refresh data when admin panel updates
    refresh() {
        this.loadAdminData();
        this.applySectionVisibility();
        this.initializeContent();
    }
    
    showSection(sectionKey) {
        const sectionElement = document.getElementById(sectionKey);
        const navElement = document.querySelector(`[href="#${sectionKey}"]`);
        
        if (sectionElement) {
            sectionElement.style.display = 'block';
            sectionElement.style.visibility = 'visible';
            sectionElement.style.opacity = '1';
            console.log(`AdminIntegration: Showing section ${sectionKey}`);
        }
        
        if (navElement) {
            const navParent = navElement.closest('li');
            if (navParent) {
                navParent.style.display = 'block';
            }
        }
    }
    
    hideSection(sectionKey) {
        const sectionElement = document.getElementById(sectionKey);
        const navElement = document.querySelector(`[href="#${sectionKey}"]`);
        
        if (sectionElement) {
            sectionElement.style.display = 'none';
            sectionElement.style.visibility = 'hidden';
            sectionElement.style.opacity = '0';
            console.log(`AdminIntegration: Hiding section ${sectionKey}`);
        }
        
        if (navElement) {
            const navParent = navElement.closest('li');
            if (navParent) {
                navParent.style.display = 'none';
            }
        }
    }
    
    reorderSection(sectionKey, order) {
        const sectionElement = document.getElementById(sectionKey);
        if (sectionElement && sectionElement.parentNode) {
            sectionElement.style.order = order;
            console.log(`AdminIntegration: Set order ${order} for section ${sectionKey}`);
        }
    }
    
    forceRefresh() {
        console.log('AdminIntegration: Force refreshing...');
        this.loadAdminData();
        this.applySectionVisibility();
    }
    
    checkForUpdates() {
        const currentData = localStorage.getItem('adminData');
        const currentHash = currentData ? this.hashCode(currentData) : null;
        
        if (currentHash !== this.lastDataHash) {
            console.log('AdminIntegration: Data changed, updating...');
            this.lastDataHash = currentHash;
            this.refreshAttempts++;
            
            if (currentData) {
                try {
                    const newData = JSON.parse(currentData);
                    console.log('AdminIntegration: New sections data:', newData?.sections);
                    this.adminData = newData;
                    this.applySectionVisibility();
                    
                    // Force a visual update
                    this.forceVisualUpdate();
                    
                    // If too many refresh attempts, force page reload to clear cache
                    if (this.refreshAttempts >= this.maxRefreshAttempts) {
                        console.log('AdminIntegration: Too many refresh attempts, forcing page reload to clear cache');
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 1000);
                    }
                } catch (error) {
                    console.error('AdminIntegration: Error parsing updated data:', error);
                }
            }
        }
    }
    
    forceVisualUpdate() {
        // Force browser to recalculate layout
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        // Add timestamp to force cache invalidation
        const timestamp = Date.now();
        document.body.setAttribute('data-cache-bust', timestamp);
        document.documentElement.setAttribute('data-cache-bust', timestamp);
        
        // Force CSS cache invalidation
        const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
        styleSheets.forEach(link => {
            const href = link.href.split('?')[0];
            link.href = href + '?v=' + timestamp;
        });
        
        // Force style recalculation
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.transform = 'translateZ(0)';
            setTimeout(() => {
                el.style.transform = '';
            }, 1);
        });
        
        // Force repaint by changing a CSS property
        document.body.style.opacity = '0.99';
        setTimeout(() => {
            document.body.style.opacity = '';
        }, 10);
        
        // Scroll to top to make changes more visible
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('AdminIntegration: Forced visual update with aggressive cache bust:', timestamp);
    }
    
    createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}

// Initialize admin integration when DOM is loaded
let adminIntegration;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        adminIntegration = new AdminIntegration();
    });
} else {
    adminIntegration = new AdminIntegration();
}

// Listen for storage changes to update when admin panel modifies data
window.addEventListener('storage', (e) => {
    if (e.key === 'adminData' && adminIntegration) {
        adminIntegration.refresh();
    }
});

// Export for global access
window.adminIntegration = adminIntegration;