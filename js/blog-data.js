// Dati degli articoli del blog - ETF Italia
// Aggiornato automaticamente: 2025-09-03T12:31:56.903166

const blogArticles = [];

// Funzioni per la gestione degli articoli
function getAllArticles() {
    return blogArticles;
}

function getArticleById(id) {
    return blogArticles.find(article => article.id === id);
}

function getArticlesByCategory(category) {
    return blogArticles.filter(article => article.category === category);
}

function getFeaturedArticles() {
    return blogArticles.filter(article => article.featured);
}

function getPublishedArticles() {
    return blogArticles.filter(article => article.published);
}

function getAIGeneratedArticles() {
    return blogArticles.filter(article => article.aiGenerated);
}

// Esporta per uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        blogArticles,
        getAllArticles,
        getArticleById,
        getArticlesByCategory,
        getFeaturedArticles,
        getPublishedArticles,
        getAIGeneratedArticles
    };
}