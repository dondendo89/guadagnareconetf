// Admin Security and Validation Module
class AdminSecurity {
    constructor() {
        this.maxTitleLength = 200;
        this.maxExcerptLength = 500;
        this.maxContentLength = 50000;
        this.maxBrokerNameLength = 100;
        this.maxBrokerDescLength = 1000;
        this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.maxImageSize = 5 * 1024 * 1024; // 5MB
    }

    // Sanitize HTML content to prevent XSS
    sanitizeHTML(str) {
        if (typeof str !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Sanitize content but allow basic HTML tags
    sanitizeContent(content) {
        if (typeof content !== 'string') return '';
        
        // Allow basic HTML tags for blog content
        const allowedTags = /<\/?(?:p|br|strong|b|em|i|u|h[1-6]|ul|ol|li|a|img|blockquote|code|pre)(?:\s[^>]*)?>|/gi;
        
        // Remove script tags and event handlers
        content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        content = content.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        content = content.replace(/javascript:/gi, '');
        
        return content;
    }

    // Validate article data
    validateArticle(article) {
        const errors = [];
        
        if (!article.title || typeof article.title !== 'string') {
            errors.push('Il titolo è obbligatorio');
        } else if (article.title.length > this.maxTitleLength) {
            errors.push(`Il titolo non può superare ${this.maxTitleLength} caratteri`);
        }
        
        if (article.excerpt && article.excerpt.length > this.maxExcerptLength) {
            errors.push(`L'estratto non può superare ${this.maxExcerptLength} caratteri`);
        }
        
        if (article.content && article.content.length > this.maxContentLength) {
            errors.push(`Il contenuto non può superare ${this.maxContentLength} caratteri`);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            sanitized: {
                title: this.sanitizeHTML(article.title || ''),
                excerpt: this.sanitizeHTML(article.excerpt || ''),
                content: this.sanitizeContent(article.content || '')
            }
        };
    }

    // Validate broker data
    validateBroker(broker) {
        const errors = [];
        
        if (!broker.name || typeof broker.name !== 'string') {
            errors.push('Il nome del broker è obbligatorio');
        } else if (broker.name.length > this.maxBrokerNameLength) {
            errors.push(`Il nome del broker non può superare ${this.maxBrokerNameLength} caratteri`);
        }
        
        if (broker.description && broker.description.length > this.maxBrokerDescLength) {
            errors.push(`La descrizione non può superare ${this.maxBrokerDescLength} caratteri`);
        }
        
        if (broker.website && !this.isValidURL(broker.website)) {
            errors.push('L\'URL del sito web non è valido');
        }
        
        if (broker.rating && (isNaN(broker.rating) || broker.rating < 0 || broker.rating > 5)) {
            errors.push('La valutazione deve essere un numero tra 0 e 5');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            sanitized: {
                name: this.sanitizeHTML(broker.name || ''),
                description: this.sanitizeHTML(broker.description || ''),
                website: broker.website || '',
                rating: parseFloat(broker.rating) || 0,
                features: Array.isArray(broker.features) ? broker.features.map(f => this.sanitizeHTML(f)) : []
            }
        };
    }

    // Validate URL format
    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Validate image file
    validateImage(file) {
        const errors = [];
        
        if (!this.allowedImageTypes.includes(file.type)) {
            errors.push('Tipo di file non supportato. Usa JPG, PNG, GIF o WebP');
        }
        
        if (file.size > this.maxImageSize) {
            errors.push(`Il file è troppo grande. Massimo ${this.maxImageSize / (1024 * 1024)}MB`);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Rate limiting for admin actions
    checkRateLimit(action, maxActions = 10, timeWindow = 60000) {
        const now = Date.now();
        const key = `rateLimit_${action}`;
        
        let actions = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Remove old actions outside time window
        actions = actions.filter(timestamp => now - timestamp < timeWindow);
        
        if (actions.length >= maxActions) {
            return {
                allowed: false,
                message: `Troppi tentativi. Riprova tra ${Math.ceil(timeWindow / 1000)} secondi.`
            };
        }
        
        // Add current action
        actions.push(now);
        localStorage.setItem(key, JSON.stringify(actions));
        
        return { allowed: true };
    }

    // Backup validation
    validateBackupData(data) {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            
            if (!parsed || typeof parsed !== 'object') {
                return { isValid: false, error: 'Formato backup non valido' };
            }
            
            // Check required structure
            if (!parsed.hasOwnProperty('sections') || !parsed.hasOwnProperty('brokers') || !parsed.hasOwnProperty('articles')) {
                return { isValid: false, error: 'Struttura backup incompleta' };
            }
            
            // Validate arrays
            if (!Array.isArray(parsed.sections) || !Array.isArray(parsed.brokers) || !Array.isArray(parsed.articles)) {
                return { isValid: false, error: 'Formato dati non valido' };
            }
            
            return { isValid: true, data: parsed };
        } catch (e) {
            return { isValid: false, error: 'Errore nel parsing del backup' };
        }
    }

    // Show security alert
    showSecurityAlert(message, type = 'error') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'warning'}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            padding: 15px;
            border-radius: 5px;
            background: ${type === 'error' ? '#f8d7da' : '#fff3cd'};
            border: 1px solid ${type === 'error' ? '#f5c6cb' : '#ffeaa7'};
            color: ${type === 'error' ? '#721c24' : '#856404'};
        `;
        alertDiv.innerHTML = `
            <strong>${type === 'error' ? 'Errore di Sicurezza:' : 'Avviso:'}</strong> ${message}
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize security module
window.adminSecurity = new AdminSecurity();

// Add security checks to existing admin functions
if (window.adminPanel) {
    // Override the original saveData method to add validation
    const originalSaveData = window.adminPanel.saveData;
    window.adminPanel.saveData = function() {
        // Rate limiting check
        const rateCheck = window.adminSecurity.checkRateLimit('save_data', 20, 60000);
        if (!rateCheck.allowed) {
            window.adminSecurity.showSecurityAlert(rateCheck.message);
            return;
        }
        
        // Call original method
        originalSaveData.call(this);
    };
}