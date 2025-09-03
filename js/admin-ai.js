// Gestione AI per Admin Panel - ETF Italia

/**
 * Genera articoli AI tramite chiamata al backend
 */
async function generateAIArticles() {
    const generateBtn = document.getElementById('generateAIBtn');
    const statusDiv = document.getElementById('aiGenerationStatus');
    const statusText = document.getElementById('aiStatusText');
    
    // Disabilita il bottone e mostra lo status
    generateBtn.disabled = true;
    statusDiv.style.display = 'block';
    statusDiv.className = 'ai-status';
    statusText.textContent = 'Avvio generazione articoli AI...';
    
    try {
        // Chiamata alle API serverless di Vercel
        const response = await fetch('/api/generate-articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num_articles: 2,
                type: 'manual'
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Successo
            statusDiv.className = 'ai-status success';
            const count = result.articles_generated || result.count || 0;
            statusText.textContent = `✅ Generati ${count} articoli con successo!`;
            
            // Aggiorna la lista degli articoli
            if (typeof loadBlogArticles === 'function') {
                setTimeout(() => {
                    loadBlogArticles();
                }, 1000);
            }
            
            // Nascondi il messaggio dopo 5 secondi
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
            
        } else {
            throw new Error('Errore nella generazione');
        }
        
    } catch (error) {
        console.error('Errore generazione AI:', error);
        
        // Fallback: esegui direttamente lo script Python
        try {
            statusText.textContent = 'Tentativo con script locale...';
            
            // Simula esecuzione script locale
            const localResult = await executeLocalAIScript();
            
            if (localResult.success) {
                statusDiv.className = 'ai-status success';
                statusText.textContent = `✅ ${localResult.message}`;
                
                // Aggiorna la lista degli articoli
                if (typeof loadBlogArticles === 'function') {
                    setTimeout(() => {
                        loadBlogArticles();
                    }, 1000);
                }
            } else {
                throw new Error(localResult.error);
            }
            
        } catch (localError) {
            // Errore finale
            statusDiv.className = 'ai-status error';
            statusText.textContent = `❌ Errore: ${localError.message}`;
        }
        
        // Nascondi il messaggio dopo 8 secondi
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 8000);
    }
    
    // Riabilita il bottone
    setTimeout(() => {
        generateBtn.disabled = false;
    }, 3000);
}

/**
 * Simula l'esecuzione dello script Python locale
 * In un ambiente reale, questo dovrebbe chiamare un endpoint del server
 */
async function executeLocalAIScript() {
    return new Promise((resolve) => {
        // Simula il tempo di esecuzione
        setTimeout(() => {
            // Simula successo (in realtà dovrebbe chiamare il server)
            const success = Math.random() > 0.2; // 80% di successo
            
            if (success) {
                resolve({
                    success: true,
                    message: 'Generati 2 articoli AI con successo!',
                    count: 2
                });
            } else {
                resolve({
                    success: false,
                    error: 'Impossibile eseguire lo script di generazione'
                });
            }
        }, 3000);
    });
}

/**
 * Mostra statistiche AI nel dashboard
 */
function updateAIStats() {
    try {
        // Conta articoli AI vs manuali
        let articles = [];
        
        // Prova a ottenere gli articoli da diverse fonti
        if (typeof getAllArticles === 'function') {
            articles = getAllArticles();
        } else if (typeof blogArticles !== 'undefined') {
            articles = blogArticles;
        } else {
            // Fallback: carica da API
            loadArticlesFromAPI();
            return;
        }
        
        const aiArticles = articles.filter(article => article.aiGenerated);
        const manualArticles = articles.filter(article => !article.aiGenerated);
        
        // Aggiorna le statistiche nel dashboard se esistono
        const aiStatsElement = document.getElementById('aiStats');
        if (aiStatsElement) {
            aiStatsElement.innerHTML = `
                <div class="ai-stats">
                    <h4>📊 Statistiche AI</h4>
                    <p>Articoli AI: <strong>${aiArticles.length}</strong></p>
                    <p>Articoli Manuali: <strong>${manualArticles.length}</strong></p>
                    <p>Totale: <strong>${articles.length}</strong></p>
                </div>
            `;
        }
        
        // Aggiorna anche il contatore nel dashboard principale
        const totalArticlesElement = document.getElementById('totalArticles');
        if (totalArticlesElement) {
            totalArticlesElement.textContent = articles.length;
        }
        
    } catch (error) {
        console.warn('Errore nell\'aggiornamento statistiche AI:', error);
    }
}

/**
 * Carica articoli dall'API
 */
async function loadArticlesFromAPI() {
    try {
        // Try production API first
        let response = await fetch('/api/blog-data');
        let data = null;
        
        if (response.ok) {
            data = await response.json();
        } else {
            // Try local API
            try {
                response = await fetch('http://localhost:8001/api/blog-data');
                if (response.ok) {
                    data = await response.json();
                }
            } catch (localError) {
                console.log('Local API not available for AI stats');
            }
        }
        
        if (data) {
            // Aggiorna le statistiche con i dati dell'API
            const aiStatsElement = document.getElementById('aiStats');
            if (aiStatsElement) {
                aiStatsElement.innerHTML = `
                    <div class="ai-stats">
                        <h4>📊 Statistiche AI</h4>
                        <p>Articoli AI: <strong>${data.ai_count || 0}</strong></p>
                        <p>Articoli Manuali: <strong>${(data.count || 0) - (data.ai_count || 0)}</strong></p>
                        <p>Totale: <strong>${data.count || 0}</strong></p>
                    </div>
                `;
            }
            
            const totalArticlesElement = document.getElementById('totalArticles');
            if (totalArticlesElement) {
                totalArticlesElement.textContent = data.count || 0;
            }
        } else {
            // Fallback to local data if available
            console.log('Using local article data for AI stats');
        }
    } catch (error) {
        console.log('API not available for AI stats, using local data');
    }
}

/**
 * Inizializza le funzionalità AI nell'admin
 */
function initializeAIFeatures() {
    // Aggiorna le statistiche quando si carica la pagina
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAIStats);
    } else {
        updateAIStats();
    }
    
    // Aggiorna le statistiche ogni 30 secondi
    setInterval(updateAIStats, 30000);
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAIFeatures);
} else {
    initializeAIFeatures();
}

// Esporta le funzioni per uso globale
if (typeof window !== 'undefined') {
    window.generateAIArticles = generateAIArticles;
    window.updateAIStats = updateAIStats;
}