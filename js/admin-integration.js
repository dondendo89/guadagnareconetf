// Admin Integration - Controls main site sections visibility
class AdminIntegration {
    constructor() {
        this.adminData = null;
        this.loadAdminData();
        this.applySectionVisibility();
        this.initializeContent();
    }

    loadAdminData() {
        const savedData = localStorage.getItem('adminData');
        if (savedData) {
            this.adminData = JSON.parse(savedData);
        }
    }

    applySectionVisibility() {
        if (!this.adminData || !this.adminData.sections) {
            return;
        }

        const sections = this.adminData.sections;
        
        // Apply visibility settings to each section
        Object.entries(sections).forEach(([sectionKey, sectionData]) => {
            const sectionElement = document.getElementById(sectionKey);
            const navElement = document.querySelector(`[href="#${sectionKey}"]`);
            
            if (sectionElement) {
                if (sectionData.visible) {
                    sectionElement.style.display = '';
                } else {
                    sectionElement.style.display = 'none';
                }
            }
            
            if (navElement) {
                const navItem = navElement.closest('li') || navElement.closest('.nav-item');
                if (navItem) {
                    if (sectionData.visible) {
                        navItem.style.display = '';
                    } else {
                        navItem.style.display = 'none';
                    }
                }
            }
        });

        // Reorder sections based on admin settings
        this.reorderSections();
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
        
        let html = '<div class="articles-list">';
        
        if (articles.length === 0) {
            html += '<p class="no-articles">Nessun articolo pubblicato al momento.</p>';
        } else {
            articles.forEach(article => {
                html += `
                    <article class="article-item">
                        <div class="article-header">
                            <h3>${article.title}</h3>
                            <span class="article-date">${article.date}</span>
                        </div>
                        <div class="article-excerpt">
                            <p>${article.excerpt}</p>
                        </div>
                        <div class="article-content">
                            <p>${article.content.substring(0, 200)}${article.content.length > 200 ? '...' : ''}</p>
                        </div>
                    </article>
                `;
            });
        }
        
        html += '</div>';
        
        // Add CSS if not already present
        if (!document.getElementById('article-styles')) {
            const style = document.createElement('style');
            style.id = 'article-styles';
            style.textContent = `
                .articles-list {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    margin: 1rem 0;
                }
                .article-item {
                    border: 1px solid #e1e5e9;
                    border-radius: 8px;
                    padding: 2rem;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .article-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #f0f0f0;
                }
                .article-header h3 {
                    margin: 0;
                    color: #333;
                    font-size: 1.3rem;
                }
                .article-date {
                    color: #888;
                    font-size: 0.9rem;
                }
                .article-excerpt {
                    margin-bottom: 1rem;
                }
                .article-excerpt p {
                    font-weight: 600;
                    color: #555;
                    font-style: italic;
                    margin: 0;
                }
                .article-content p {
                    color: #666;
                    line-height: 1.6;
                    margin: 0;
                }
                .no-articles {
                    text-align: center;
                    color: #888;
                    font-style: italic;
                    padding: 2rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        container.innerHTML = html;
    }

    initializeContent() {
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            this.renderBrokers('brokersContainer');
            this.renderArticles('blogGrid');
        }, 100);
    }

    // Method to refresh data when admin panel updates
    refresh() {
        this.loadAdminData();
        this.applySectionVisibility();
        this.initializeContent();
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