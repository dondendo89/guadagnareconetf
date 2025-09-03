// Admin Backup and Restore Module
class AdminBackup {
    constructor() {
        this.backupVersion = '1.0';
    }

    // Create backup of all admin data
    createBackup() {
        if (!window.adminPanel) {
            console.error('Admin panel not available');
            return null;
        }

        const backupData = {
            version: this.backupVersion,
            timestamp: new Date().toISOString(),
            data: {
                sections: window.adminPanel.adminData.sections || [],
                brokers: window.adminPanel.adminData.brokers || [],
                articles: window.adminPanel.adminData.articles || []
            }
        };

        return JSON.stringify(backupData, null, 2);
    }

    // Download backup file
    downloadBackup() {
        try {
            const backupContent = this.createBackup();
            if (!backupContent) {
                throw new Error('Impossibile creare il backup');
            }

            const blob = new Blob([backupContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `etf-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Backup scaricato con successo', 'success');
            }
        } catch (error) {
            console.error('Errore durante il download del backup:', error);
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Errore durante il download del backup: ' + error.message);
            }
        }
    }

    // Restore from backup data
    restoreFromBackup(backupData) {
        try {
            if (!window.adminPanel) {
                throw new Error('Admin panel non disponibile');
            }

            // Validate backup data
            let validation;
            if (window.adminSecurity) {
                validation = window.adminSecurity.validateBackupData(backupData);
                if (!validation.isValid) {
                    throw new Error(validation.error);
                }
                backupData = validation.data;
            }

            // Confirm restore operation
            if (!confirm('Sei sicuro di voler ripristinare il backup? Tutti i dati attuali verranno sovrascritti.')) {
                return;
            }

            // Backup current data before restore
            const currentBackup = this.createBackup();
            localStorage.setItem('etf_admin_pre_restore_backup', currentBackup);

            // Restore data
            window.adminPanel.adminData = {
                sections: backupData.data.sections || [],
                brokers: backupData.data.brokers || [],
                articles: backupData.data.articles || []
            };

            // Save restored data
            window.adminPanel.saveData();

            // Refresh all admin panels
            window.adminPanel.loadSectionManager();
            window.adminPanel.loadBrokerManager();
            window.adminPanel.loadBlogManager();

            // Refresh main site if integration is available
            if (window.adminIntegration) {
                window.adminIntegration.refresh();
            }

            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Backup ripristinato con successo', 'success');
            }

        } catch (error) {
            console.error('Errore durante il ripristino:', error);
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Errore durante il ripristino: ' + error.message);
            }
        }
    }

    // Handle file upload for restore
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Seleziona un file JSON valido');
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                this.restoreFromBackup(backupData);
            } catch (error) {
                if (window.adminSecurity) {
                    window.adminSecurity.showSecurityAlert('File backup non valido: ' + error.message);
                }
            }
        };
        reader.readAsText(file);
    }

    // Restore previous backup (undo last restore)
    restorePreviousBackup() {
        const previousBackup = localStorage.getItem('etf_admin_pre_restore_backup');
        if (!previousBackup) {
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Nessun backup precedente disponibile');
            }
            return;
        }

        try {
            const backupData = JSON.parse(previousBackup);
            this.restoreFromBackup(backupData);
            localStorage.removeItem('etf_admin_pre_restore_backup');
        } catch (error) {
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Errore nel ripristino del backup precedente: ' + error.message);
            }
        }
    }

    // Auto backup (called periodically)
    createAutoBackup() {
        try {
            const backupContent = this.createBackup();
            if (backupContent) {
                const autoBackups = JSON.parse(localStorage.getItem('etf_admin_auto_backups') || '[]');
                
                // Keep only last 5 auto backups
                autoBackups.push({
                    timestamp: new Date().toISOString(),
                    data: backupContent
                });
                
                if (autoBackups.length > 5) {
                    autoBackups.shift();
                }
                
                localStorage.setItem('etf_admin_auto_backups', JSON.stringify(autoBackups));
            }
        } catch (error) {
            console.error('Errore durante il backup automatico:', error);
        }
    }

    // Get list of auto backups
    getAutoBackups() {
        try {
            return JSON.parse(localStorage.getItem('etf_admin_auto_backups') || '[]');
        } catch (error) {
            return [];
        }
    }

    // Restore from auto backup
    restoreAutoBackup(index) {
        const autoBackups = this.getAutoBackups();
        if (index < 0 || index >= autoBackups.length) {
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Backup automatico non trovato');
            }
            return;
        }

        try {
            const backupData = JSON.parse(autoBackups[index].data);
            this.restoreFromBackup(backupData);
        } catch (error) {
            if (window.adminSecurity) {
                window.adminSecurity.showSecurityAlert('Errore nel ripristino del backup automatico: ' + error.message);
            }
        }
    }

    // Initialize backup system
    init() {
        // Create auto backup every 30 minutes
        setInterval(() => {
            this.createAutoBackup();
        }, 30 * 60 * 1000);

        // Create initial auto backup
        setTimeout(() => {
            this.createAutoBackup();
        }, 5000);
    }
}

// Initialize backup system
window.adminBackup = new AdminBackup();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adminBackup.init();
    });
} else {
    window.adminBackup.init();
}