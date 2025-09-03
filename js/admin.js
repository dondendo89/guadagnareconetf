// Admin Panel Management System
class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.currentSection = 'dashboard';
        this.adminData = {
            sections: {
                'home': { name: 'Home/Hero', visible: true, order: 1 },
                'ricerca': { name: 'Ricerca ETF', visible: true, order: 2 },
                'comparatore': { name: 'Comparatore', visible: true, order: 3 },
                'simulatore': { name: 'Simulatore', visible: true, order: 4 },
                'portafoglio': { name: 'Portfolio', visible: true, order: 5 },
                'fire': { name: 'Calcolatore FIRE', visible: true, order: 6 },
                'brokers': { name: 'Brokers', visible: true, order: 7 },
                'blog': { name: 'Blog', visible: true, order: 8 }
            },
            brokers: [],
            articles: [],
            settings: {
                siteName: 'GuadagnareConETF',
                adminUsername: '',
                adminPassword: ''
            }
        };
        this.loadData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
        this.loadDefaultData();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
    }

    handleLogin(e) {
        e.preventDefault();
        
        // AUTHENTICATION DISABLED - Auto login
        console.log('Admin: Login attempted but authentication is disabled - auto-login');
        this.isAuthenticated = true;
        this.showAdminPanel();
        
        // Original login logic (commented out):
        // const username = document.getElementById('username').value;
        // const password = document.getElementById('password').value;
        // const errorMessage = document.getElementById('errorMessage');
        //
        // if (username === this.adminData.settings.adminUsername && 
        //     password === this.adminData.settings.adminPassword) {
        //     this.isAuthenticated = true;
        //     localStorage.setItem('adminAuth', 'true');
        //     this.showAdminPanel();
        //     errorMessage.style.display = 'none';
        // } else {
        //     errorMessage.style.display = 'block';
        //     setTimeout(() => {
        //         errorMessage.style.display = 'none';
        //     }, 3000);
        // }
    }

    handleLogout() {
        // AUTHENTICATION DISABLED - Logout disabled
        console.log('Admin: Logout attempted but authentication is disabled');
        alert('Autenticazione disabilitata - Logout non disponibile');
        
        // Original logout logic (commented out):
        // this.isAuthenticated = false;
        // localStorage.removeItem('adminAuth');
        // this.showLoginForm();
    }

    checkAuthentication() {
        // AUTHENTICATION DISABLED - Direct access to admin panel
        console.log('Admin: Authentication disabled - showing admin panel directly');
        this.isAuthenticated = true;
        this.showAdminPanel();
        
        // Comment out original authentication logic:
        // const isLoggedIn = localStorage.getItem('adminLoggedIn');
        // if (isLoggedIn === 'true') {
        //     this.isAuthenticated = true;
        //     this.showAdminPanel();
        // } else {
        //     this.showLoginForm();
        // }
    }

    showLoginForm() {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        this.loadDashboard();
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.target.dataset.section;
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');

        // Show section
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
        this.loadSectionContent(section);
    }

    loadSectionContent(section) {
        switch(section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'sections':
                this.loadSectionsManager();
                break;
            case 'brokers':
                this.loadBrokersManager();
                break;
            case 'blog':
                this.loadBlogManager();
                break;
            case 'backup':
                this.loadBackupManager();
                break;
            case 'settings':
                this.loadSettingsManager();
                break;
        }
    }

    loadDashboard() {
        const activeSections = Object.values(this.adminData.sections)
            .filter(section => section.visible).length;
        
        document.getElementById('activeSections').textContent = activeSections;
        document.getElementById('totalBrokers').textContent = this.adminData.brokers.length;
        document.getElementById('totalArticles').textContent = this.adminData.articles.length;
    }

    loadSectionsManager() {
        const container = document.getElementById('sectionsManager');
        const sections = this.adminData.sections;
        
        let html = `
            <div class="sections-list">
                <h3>Gestione Visibilità Sezioni</h3>
                <div class="sections-grid">
        `;
        
        Object.entries(sections).forEach(([key, section]) => {
            html += `
                <div class="section-item">
                    <div class="section-info">
                        <h4>${section.name}</h4>
                        <span class="section-order">Ordine: ${section.order}</span>
                    </div>
                    <div class="section-controls">
                        <label class="toggle-switch">
                            <input type="checkbox" ${section.visible ? 'checked' : ''} 
                                   onchange="adminPanel.toggleSection('${key}')">
                            <span class="toggle-slider"></span>
                        </label>
                        <button class="btn btn-sm" onclick="adminPanel.moveSection('${key}', 'up')">↑</button>
                        <button class="btn btn-sm" onclick="adminPanel.moveSection('${key}', 'down')">↓</button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            <style>
                .sections-grid {
                    display: grid;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .section-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border: 1px solid #e1e5e9;
                    border-radius: 5px;
                    background: #f8f9fa;
                }
                .section-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .toggle-slider {
                    background-color: #667eea;
                }
                input:checked + .toggle-slider:before {
                    transform: translateX(26px);
                }
                .btn-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.8rem;
                }
            </style>
        `;
        
        container.innerHTML = html;
    }

    loadBrokersManager() {
        const container = document.getElementById('brokersManager');
        const brokers = this.adminData.brokers;
        
        let html = `
            <div class="brokers-list">
                <div class="brokers-grid">
        `;
        
        brokers.forEach((broker, index) => {
            html += `
                <div class="broker-card">
                    <div class="broker-info">
                        <h4>${broker.name}</h4>
                        <p>${broker.description}</p>
                        <div class="broker-details">
                            <span class="commission">Commissioni: ${broker.commission}</span>
                            <span class="rating">Rating: ${broker.rating}/5</span>
                        </div>
                    </div>
                    <div class="broker-actions">
                        <button class="btn btn-primary" onclick="adminPanel.editBroker(${index})">Modifica</button>
                        <button class="btn btn-danger" onclick="adminPanel.deleteBroker(${index})">Elimina</button>
                    </div>
                </div>
            `;
        });
        
        if (brokers.length === 0) {
            html += '<p class="no-data">Nessun broker configurato. Clicca "Aggiungi Broker" per iniziare.</p>';
        }
        
        html += `
                </div>
            </div>
            <style>
                .brokers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .broker-card {
                    border: 1px solid #e1e5e9;
                    border-radius: 8px;
                    padding: 1rem;
                    background: white;
                }
                .broker-info h4 {
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }
                .broker-info p {
                    color: #666;
                    font-size: 0.9rem;
                    margin: 0 0 1rem 0;
                }
                .broker-details {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: #888;
                    margin-bottom: 1rem;
                }
                .broker-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .no-data {
                    text-align: center;
                    color: #666;
                    font-style: italic;
                    padding: 2rem;
                }
            </style>
        `;
        
        container.innerHTML = html;
    }

    loadBlogManager() {
        const container = document.getElementById('blogManager');
        const articles = this.adminData.articles;
        
        let html = `
            <div class="articles-list">
                <div class="articles-grid">
        `;
        
        articles.forEach((article, index) => {
            html += `
                <div class="article-card">
                    <div class="article-info">
                        <h4>${article.title}</h4>
                        <p>${article.excerpt}</p>
                        <div class="article-meta">
                            <span class="date">Data: ${article.date}</span>
                            <span class="status ${article.published ? 'published' : 'draft'}">
                                ${article.published ? 'Pubblicato' : 'Bozza'}
                            </span>
                        </div>
                    </div>
                    <div class="article-actions">
                        <button class="btn btn-primary" onclick="editArticleAdvanced(${index})">Modifica</button>
                        <button class="btn btn-success" onclick="adminPanel.toggleArticleStatus(${index})">
                            ${article.published ? 'Nascondi' : 'Pubblica'}
                        </button>
                        <button class="btn btn-danger" onclick="adminPanel.deleteArticle(${index})">Elimina</button>
                    </div>
                </div>
            `;
        });
        
        if (articles.length === 0) {
            html += '<p class="no-data">Nessun articolo presente. Clicca "Nuovo Articolo" per iniziare.</p>';
        }
        
        html += `
                </div>
            </div>
            <style>
                .articles-grid {
                    display: grid;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .article-card {
                    border: 1px solid #e1e5e9;
                    border-radius: 8px;
                    padding: 1rem;
                    background: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .article-info {
                    flex: 1;
                }
                .article-info h4 {
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }
                .article-info p {
                    color: #666;
                    font-size: 0.9rem;
                    margin: 0 0 1rem 0;
                }
                .article-meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.8rem;
                }
                .status {
                    padding: 0.2rem 0.5rem;
                    border-radius: 3px;
                    color: white;
                }
                .status.published {
                    background: #27ae60;
                }
                .status.draft {
                    background: #f39c12;
                }
                .article-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-shrink: 0;
                }
            </style>
        `;
        
        container.innerHTML = html;
    }

    loadBackupManager() {
        const container = document.getElementById('backupManager');
        
        const html = `
            <div class="backup-controls">
                <div class="backup-group">
                    <h3>Backup Manuale</h3>
                    <button class="btn btn-primary" onclick="adminPanel.downloadBackup()">Scarica Backup</button>
                    <p class="help-text">Scarica un backup completo di tutti i dati admin</p>
                </div>
                
                <div class="backup-group">
                    <h3>Ripristino da File</h3>
                    <input type="file" id="backup-file-input" accept=".json" onchange="adminPanel.handleFileUpload(event)" style="display: none;">
                    <button class="btn btn-warning" onclick="document.getElementById('backup-file-input').click()">Carica Backup</button>
                    <p class="help-text">Ripristina i dati da un file di backup</p>
                </div>
                
                <div class="backup-group">
                    <h3>Backup Automatici</h3>
                    <div id="auto-backups-list"></div>
                    <button class="btn btn-info" onclick="adminPanel.loadAutoBackups()">Aggiorna Lista</button>
                    <p class="help-text">Backup creati automaticamente ogni 30 minuti</p>
                </div>
            </div>
            <style>
                .backup-controls {
                    max-width: 600px;
                }
                .backup-group {
                    margin-bottom: 2rem;
                    padding: 1rem;
                    border: 1px solid #e1e5e9;
                    border-radius: 8px;
                    background: #f8f9fa;
                }
                .backup-group h3 {
                    margin-top: 0;
                    color: #333;
                }
                .help-text {
                    font-size: 0.9rem;
                    color: #666;
                    margin-top: 0.5rem;
                }
            </style>
        `;
        
        container.innerHTML = html;
        this.loadAutoBackups();
    }

    loadSettingsManager() {
        const container = document.getElementById('settingsManager');
        const settings = this.adminData.settings;
        
        const html = `
            <div class="settings-form">
                <h3>Configurazioni Generali</h3>
                <form id="settingsForm">
                    <div class="form-group">
                        <label for="siteName">Nome Sito</label>
                        <input type="text" id="siteName" value="${settings.siteName}">
                    </div>
                    <div class="form-group">
                        <label for="adminUsername">Username Admin</label>
                        <input type="text" id="adminUsername" value="${settings.adminUsername}">
                    </div>
                    <div class="form-group">
                        <label for="adminPassword">Nuova Password Admin (lascia vuoto per non modificare)</label>
                        <input type="password" id="adminPassword" placeholder="Inserisci nuova password">
                        <small class="text-muted">La password attuale non viene mostrata per sicurezza</small>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-warning" onclick="adminPanel.generateNewPassword()">Genera Password Sicura</button>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-success" onclick="adminPanel.saveSettings()">Salva Impostazioni</button>
                        <button type="button" class="btn btn-primary" onclick="adminPanel.exportData()">Esporta Dati</button>
                        <button type="button" class="btn btn-danger" onclick="adminPanel.resetData()">Reset Dati</button>
                    </div>
                </form>
            </div>
            <style>
                .settings-form {
                    max-width: 500px;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }
            </style>
        `;
        
        container.innerHTML = html;
    }

    // Section Management
    toggleSection(sectionKey) {
        console.log(`Admin: Toggling section ${sectionKey} from ${this.adminData.sections[sectionKey].visible} to ${!this.adminData.sections[sectionKey].visible}`);
        this.adminData.sections[sectionKey].visible = !this.adminData.sections[sectionKey].visible;
        console.log('Admin: Updated sections data:', this.adminData.sections);
        
        // Force immediate save and update
        this.saveData();
        console.log('Admin: Data saved to localStorage');
        
        // Wait a bit then force update
        setTimeout(() => {
            this.updateMainSiteVisibility();
            this.forceMainSiteRefresh();
        }, 100);
        
        this.loadSectionsManager();
        this.loadDashboard();
    }

    moveSection(sectionKey, direction) {
        const sections = this.adminData.sections;
        const currentOrder = sections[sectionKey].order;
        
        if (direction === 'up' && currentOrder > 1) {
            // Find section with order - 1 and swap
            const targetSection = Object.keys(sections).find(key => 
                sections[key].order === currentOrder - 1
            );
            if (targetSection) {
                sections[targetSection].order = currentOrder;
                sections[sectionKey].order = currentOrder - 1;
            }
        } else if (direction === 'down') {
            const maxOrder = Math.max(...Object.values(sections).map(s => s.order));
            if (currentOrder < maxOrder) {
                const targetSection = Object.keys(sections).find(key => 
                    sections[key].order === currentOrder + 1
                );
                if (targetSection) {
                    sections[targetSection].order = currentOrder;
                    sections[sectionKey].order = currentOrder + 1;
                }
            }
        }
        
        this.saveData();
        this.loadSectionsManager();
    }

    // Broker Management
    addBroker() {
        const name = prompt('Nome del broker:');
        if (!name) return;
        
        const description = prompt('Descrizione:') || '';
        const commission = prompt('Commissioni:') || 'N/A';
        const rating = parseFloat(prompt('Rating (1-5):')) || 0;
        const affiliateLink = prompt('Link di affiliazione:') || '';
        
        const brokerData = {
            name,
            description,
            commission,
            rating,
            affiliateLink,
            active: true
        };
        
        // Validate broker data if security module is available
        if (window.adminSecurity) {
            const validation = window.adminSecurity.validateBroker(brokerData);
            if (!validation.isValid) {
                window.adminSecurity.showSecurityAlert('Errori di validazione: ' + validation.errors.join(', '));
                return;
            }
            // Use sanitized data
            Object.assign(brokerData, validation.sanitized);
        }
        
        this.adminData.brokers.push(brokerData);
        this.saveData();
        this.loadBrokersManager();
    }

    editBroker(index) {
        const broker = this.adminData.brokers[index];
        
        const name = prompt('Nome del broker:', broker.name);
        if (name === null) return;
        
        const description = prompt('Descrizione:', broker.description);
        const commission = prompt('Commissioni:', broker.commission);
        const rating = parseFloat(prompt('Rating (1-5):', broker.rating));
        const affiliateLink = prompt('Link di affiliazione:', broker.affiliateLink);
        
        const brokerData = {
            ...broker,
            name: name || broker.name,
            description: description || broker.description,
            commission: commission || broker.commission,
            rating: rating || broker.rating,
            affiliateLink: affiliateLink || broker.affiliateLink
        };
        
        // Validate broker data if security module is available
        if (window.adminSecurity) {
            const validation = window.adminSecurity.validateBroker(brokerData);
            if (!validation.isValid) {
                window.adminSecurity.showSecurityAlert('Errori di validazione: ' + validation.errors.join(', '));
                return;
            }
            // Use sanitized data
            Object.assign(brokerData, validation.sanitized);
        }
        
        this.adminData.brokers[index] = brokerData;
        this.saveData();
        this.loadBrokersManager();
    }

    deleteBroker(index) {
        if (confirm('Sei sicuro di voler eliminare questo broker?')) {
            this.adminData.brokers.splice(index, 1);
            this.saveData();
            this.loadBrokersManager();
        }
    }

    // Blog Management
    addArticle() {
        if (window.blogEditor) {
            window.blogEditor.openEditor();
        } else {
            // Fallback to simple prompt
            const title = prompt('Titolo dell\'articolo:');
            if (!title) return;
            
            const excerpt = prompt('Estratto (breve descrizione):') || '';
            const content = prompt('Contenuto dell\'articolo:') || '';
            
            const article = {
                title,
                excerpt,
                content,
                date: new Date().toLocaleDateString('it-IT'),
                published: false
            };
            
            this.adminData.articles.push(article);
            this.saveData();
            this.loadBlogManager();
        }
    }

    editArticle(index) {
        const article = this.adminData.articles[index];
        
        const title = prompt('Titolo dell\'articolo:', article.title);
        if (title === null) return;
        
        const excerpt = prompt('Estratto:', article.excerpt);
        const content = prompt('Contenuto:', article.content);
        
        this.adminData.articles[index] = {
            ...article,
            title: title || article.title,
            excerpt: excerpt || article.excerpt,
            content: content || article.content
        };
        
        this.saveData();
        this.loadBlogManager();
    }

    toggleArticleStatus(index) {
        this.adminData.articles[index].published = !this.adminData.articles[index].published;
        this.saveData();
        this.loadBlogManager();
    }

    deleteArticle(index) {
        if (confirm('Sei sicuro di voler eliminare questo articolo?')) {
            this.adminData.articles.splice(index, 1);
            this.saveData();
            this.loadBlogManager();
        }
    }

    // Settings Management
    saveSettings() {
        const siteName = document.getElementById('siteName').value;
        const adminUsername = document.getElementById('adminUsername').value;
        const adminPassword = document.getElementById('adminPassword').value;
        
        // Update settings
        this.adminData.settings.siteName = siteName;
        this.adminData.settings.adminUsername = adminUsername;
        
        // Only update password if a new one is provided
        if (adminPassword && adminPassword.trim() !== '') {
            this.adminData.settings.adminPassword = adminPassword;
            alert('Impostazioni salvate con successo! Password aggiornata.');
        } else {
            alert('Impostazioni salvate con successo!');
        }
        
        this.saveData();
        
        // Clear password field for security
        document.getElementById('adminPassword').value = '';
    }

    exportData() {
        const dataStr = JSON.stringify(this.adminData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'admin-data-backup.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }

    resetData() {
        if (confirm('Sei sicuro di voler resettare tutti i dati? Questa azione non può essere annullata.')) {
            localStorage.removeItem('adminData');
            location.reload();
        }
    }

    // Backup Management
    downloadBackup() {
        const backupData = {
            adminData: this.adminData,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `admin-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        // Save auto backup
        this.saveAutoBackup();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                
                if (backupData.adminData) {
                    if (confirm('Sei sicuro di voler ripristinare i dati dal backup? I dati attuali verranno sovrascritti.')) {
                        this.adminData = backupData.adminData;
                        this.saveData();
                        alert('Backup ripristinato con successo!');
                        location.reload();
                    }
                } else {
                    alert('File di backup non valido.');
                }
            } catch (error) {
                alert('Errore nel leggere il file di backup: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    saveAutoBackup() {
        const autoBackups = JSON.parse(localStorage.getItem('adminAutoBackups') || '[]');
        const backup = {
            timestamp: new Date().toISOString(),
            data: this.adminData
        };
        
        autoBackups.unshift(backup);
        
        // Keep only last 10 auto backups
        if (autoBackups.length > 10) {
            autoBackups.splice(10);
        }
        
        localStorage.setItem('adminAutoBackups', JSON.stringify(autoBackups));
    }

    loadAutoBackups() {
        const autoBackups = JSON.parse(localStorage.getItem('adminAutoBackups') || '[]');
        const container = document.getElementById('auto-backups-list');
        
        if (autoBackups.length === 0) {
            container.innerHTML = '<p class="no-data">Nessun backup automatico disponibile</p>';
            return;
        }
        
        let html = '<div class="auto-backups">';
        autoBackups.forEach((backup, index) => {
            const date = new Date(backup.timestamp).toLocaleString('it-IT');
            html += `
                <div class="backup-item">
                    <span class="backup-date">${date}</span>
                    <div class="backup-actions">
                        <button class="btn btn-sm btn-primary" onclick="adminPanel.restoreAutoBackup(${index})">Ripristina</button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteAutoBackup(${index})">Elimina</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        html += `
            <style>
                .auto-backups {
                    margin-top: 1rem;
                }
                .backup-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                    background: white;
                }
                .backup-date {
                    font-size: 0.9rem;
                }
                .backup-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .btn-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.8rem;
                }
            </style>
        `;
        
        container.innerHTML = html;
    }

    restoreAutoBackup(index) {
        const autoBackups = JSON.parse(localStorage.getItem('adminAutoBackups') || '[]');
        const backup = autoBackups[index];
        
        if (backup && confirm('Sei sicuro di voler ripristinare questo backup?')) {
            this.adminData = backup.data;
            this.saveData();
            alert('Backup ripristinato con successo!');
            location.reload();
        }
    }

    deleteAutoBackup(index) {
        if (confirm('Sei sicuro di voler eliminare questo backup?')) {
            const autoBackups = JSON.parse(localStorage.getItem('adminAutoBackups') || '[]');
            autoBackups.splice(index, 1);
            localStorage.setItem('adminAutoBackups', JSON.stringify(autoBackups));
            this.loadAutoBackups();
        }
    }

    // Data Management
    saveData() {
        try {
            const dataToSave = JSON.stringify(this.adminData);
            console.log('Admin: Saving data to localStorage:', dataToSave);
            localStorage.setItem('adminData', dataToSave);
            console.log('Admin: Data saved successfully to localStorage');
            
            // Verify the save
            const savedData = localStorage.getItem('adminData');
            console.log('Admin: Verification - data in localStorage:', savedData);
            
            // Auto backup every 30 minutes
            const lastAutoBackup = localStorage.getItem('lastAutoBackup');
            const now = Date.now();
            
            if (!lastAutoBackup || (now - parseInt(lastAutoBackup)) > 30 * 60 * 1000) {
                this.saveAutoBackup();
                localStorage.setItem('lastAutoBackup', now.toString());
            }
        } catch (error) {
            console.error('Error saving admin data:', error);
        }
    }

    loadData() {
        const savedData = localStorage.getItem('adminData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.adminData = { ...this.adminData, ...parsed };
        } else {
            // First time setup - save default data
            this.saveData();
        }
        
        // Initialize credentials if not set
        if (!this.adminData.settings.adminUsername || !this.adminData.settings.adminPassword) {
            this.initializeCredentials();
        }
    }

    initializeCredentials() {
        // Generate secure random credentials on first setup
        const randomPassword = this.generateSecurePassword();
        
        this.adminData.settings.adminUsername = 'admin';
        this.adminData.settings.adminPassword = randomPassword;
        
        // Show setup dialog to user
        this.showCredentialsSetup(randomPassword);
        
        this.saveData();
    }
    
    generateSecurePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    
    showCredentialsSetup(password) {
        const message = `IMPORTANTE: Credenziali admin generate automaticamente per sicurezza:\n\nUsername: admin\nPassword: ${password}\n\nSalva queste credenziali in un posto sicuro! Questa è l'unica volta che verranno mostrate.`;
        alert(message);
        
        // Also log to console for development
        console.log('Admin Credentials Generated:', {
            username: 'admin',
            password: password
        });
    }
    
    generateNewPassword() {
        const newPassword = this.generateSecurePassword();
        document.getElementById('adminPassword').value = newPassword;
        alert(`Nuova password generata: ${newPassword}\n\nSalva questa password in un posto sicuro!`);
    }

    loadDefaultData() {
        // Load some default brokers if none exist
        if (this.adminData.brokers.length === 0) {
            this.adminData.brokers = [
                {
                    name: 'Degiro',
                    description: 'Broker europeo con commissioni competitive',
                    commission: '€2 per transazione',
                    rating: 4.5,
                    affiliateLink: 'https://degiro.com',
                    active: true
                },
                {
                    name: 'Interactive Brokers',
                    description: 'Broker professionale con accesso globale',
                    commission: '0.05% min €1.25',
                    rating: 4.8,
                    affiliateLink: 'https://interactivebrokers.com',
                    active: true
                }
            ];
        }

        // Load some default articles if none exist
        if (this.adminData.articles.length === 0) {
            this.adminData.articles = [
                {
                    title: 'Come iniziare con gli ETF',
                    excerpt: 'Guida completa per principianti agli investimenti in ETF',
                    content: 'Gli ETF (Exchange Traded Funds) sono strumenti di investimento...',
                    date: new Date().toLocaleDateString('it-IT'),
                    published: true
                },
                {
                    title: 'Diversificazione del portafoglio',
                    excerpt: 'Strategie per diversificare efficacemente i tuoi investimenti',
                    content: 'La diversificazione è fondamentale per ridurre il rischio...',
                    date: new Date().toLocaleDateString('it-IT'),
                    published: false
                }
            ];
        }

        this.saveData();
    }

    updateMainSiteVisibility() {
        console.log('Admin: Updating main site visibility...');
        
        // Trigger storage event to notify main site of changes
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'adminData',
            newValue: JSON.stringify(this.adminData),
            storageArea: localStorage
        }));
        
        // Also try to directly update if adminIntegration is available
        if (window.parent && window.parent.adminIntegration) {
            console.log('Admin: Calling parent adminIntegration.refresh()');
            window.parent.adminIntegration.refresh();
        }
        
        console.log('Updated main site visibility:', this.adminData.sections);
    }
    
    forceMainSiteRefresh() {
        console.log('Admin: Force refreshing main site...');
        
        // Try multiple methods to ensure the main site updates
        if (window.opener && window.opener.adminIntegration) {
            console.log('Admin: Calling opener adminIntegration.forceRefresh()');
            window.opener.adminIntegration.forceRefresh();
        }
        
        // Also try postMessage for cross-frame communication
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'adminUpdate',
                data: this.adminData
            }, '*');
        }
        
        // Broadcast to all windows
        localStorage.setItem('adminData', JSON.stringify(this.adminData));
        localStorage.setItem('adminUpdate', Date.now().toString());
    }
}

// Global functions for onclick handlers
function addBroker() {
    adminPanel.addBroker();
}

function addArticle() {
    adminPanel.addArticle();
}

// Global functions for blog editor integration
function editArticleAdvanced(index) {
    if (window.blogEditor && window.adminPanel) {
        const article = window.adminPanel.adminData.articles[index];
        window.blogEditor.openEditor(article, index);
    } else {
        // Fallback to existing edit function
        window.adminPanel.editArticle(index);
    }
}

function saveArticleFromEditor(articleData, index = null) {
    if (!window.adminPanel || !window.adminSecurity) return;
    
    // Validate article data
    const validation = window.adminSecurity.validateArticle(articleData);
    if (!validation.isValid) {
        window.adminSecurity.showSecurityAlert('Errori di validazione: ' + validation.errors.join(', '));
        return;
    }
    
    // Use sanitized data
    const sanitizedData = validation.sanitized;
    
    if (index !== null) {
        // Update existing article
        window.adminPanel.adminData.articles[index] = {
            ...window.adminPanel.adminData.articles[index],
            ...sanitizedData,
            date: window.adminPanel.adminData.articles[index].date // Keep original date
        };
    } else {
        // Add new article
        const article = {
            ...sanitizedData,
            date: new Date().toLocaleDateString('it-IT'),
            published: false
        };
        window.adminPanel.adminData.articles.push(article);
    }
    
    window.adminPanel.saveData();
    window.adminPanel.loadBlogManager();
    
    // Refresh main site articles if admin integration is available
    if (window.adminIntegration) {
        window.adminIntegration.renderArticles();
    }
}

// Initialize admin panel when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
    
    // Initialize blog editor after a short delay
    setTimeout(() => {
        if (window.BlogEditor) {
            window.blogEditor = new BlogEditor();
        }
    }, 100);
});