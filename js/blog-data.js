// Dati degli articoli del blog - ETF Italia
// Aggiornato automaticamente: 2025-09-03T16:07:20.605262

const blogArticles = [
  {
    "id": "confronto-etf-sostenibili-esg-i-migliori-etf-del-2025-1756908436",
    "title": "Confronto ETF sostenibili ESG: I Migliori ETF del 2025",
    "content": "Investire in ETF può essere una strategia efficace per costruire un portafoglio diversificato. È importante comprendere i rischi e le opportunità di ogni tipologia di ETF.\n\nQuesto articolo fornisce informazioni generali sugli ETF e non costituisce consulenza finanziaria. È sempre consigliabile consultare un consulente finanziario qualificato prima di prendere decisioni di investimento.",
    "excerpt": "Investire in ETF può essere una strategia efficace per costruire un portafoglio diversificato. È importante comprendere i rischi e le opportunità di ogni tipologia di ETF.\n\nQuesto articolo fornisce in...",
    "author": "ETF Italia AI",
    "date": "2025-09-03T16:07:16.068908",
    "category": "Confronti ETF",
    "tags": [
      "ETF",
      "Investimenti",
      "Finanza",
      "ESG"
    ],
    "featured": false,
    "published": true,
    "image": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800",
    "readTime": 1,
    "views": 0,
    "likes": 0,
    "aiGenerated": true
  }
];

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