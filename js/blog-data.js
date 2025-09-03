// Dati degli articoli del blog - ETF Italia
// Aggiornato automaticamente: 2025-09-03T17:34:45.303930

const blogArticles = [
  {
    "id": "analisi-etf-obbligazionari-opportunità-e-rischi-nel-2025-1756913682",
    "title": "Analisi ETF obbligazionari: Opportunità e Rischi nel 2025",
    "content": "Investire in ETF può essere una strategia efficace per costruire un portafoglio diversificato. È importante comprendere i rischi e le opportunità di ogni tipologia di ETF. Gli ETF obbligazionari possono fornire stabilità e reddito al portafoglio.\n\nQuesto articolo fornisce informazioni generali sugli ETF e non costituisce consulenza finanziaria. È sempre consigliabile consultare un consulente finanziario qualificato prima di prendere decisioni di investimento.",
    "excerpt": "Investire in ETF può essere una strategia efficace per costruire un portafoglio diversificato. È importante comprendere i rischi e le opportunità di ogni tipologia di ETF. Gli ETF obbligazionari posso...",
    "author": "ETF Italia AI",
    "date": "2025-09-03T17:34:42.279492",
    "category": "Analisi di Mercato",
    "tags": [
      "ETF",
      "Investimenti",
      "Finanza",
      "ETF Azionari",
      "ETF Obbligazionari"
    ],
    "featured": false,
    "published": true,
    "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    "readTime": 1,
    "views": 0,
    "likes": 0,
    "aiGenerated": true
  },
  {
    "id": "analisi-etf-settoriali-tecnologia-opportunità-e-rischi-nel-2025-1756913681",
    "title": "Analisi ETF settoriali tecnologia: Opportunità e Rischi nel 2025",
    "content": "Il mercato degli ETF continua a crescere, offrendo agli investitori nuove opportunità di investimento in diversi settori e asset class. Il settore tecnologico offre opportunità di crescita interessanti per gli investitori.\n\nQuesto articolo fornisce informazioni generali sugli ETF e non costituisce consulenza finanziaria. È sempre consigliabile consultare un consulente finanziario qualificato prima di prendere decisioni di investimento.",
    "excerpt": "Il mercato degli ETF continua a crescere, offrendo agli investitori nuove opportunità di investimento in diversi settori e asset class. Il settore tecnologico offre opportunità di crescita interessant...",
    "author": "ETF Italia AI",
    "date": "2025-09-03T17:34:41.549587",
    "category": "Analisi di Mercato",
    "tags": [
      "ETF",
      "Investimenti",
      "Finanza",
      "Tecnologia"
    ],
    "featured": false,
    "published": true,
    "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    "readTime": 1,
    "views": 0,
    "likes": 0,
    "aiGenerated": true
  },
  {
    "id": "guida-completa-agli-etf-azionari-europei-come-investire-nel-2025-1756911212",
    "title": "Guida Completa agli ETF azionari europei: Come Investire nel 2025",
    "content": "Gli ETF rappresentano uno strumento di investimento sempre più popolare tra gli investitori italiani. Questi fondi offrono diversificazione, bassi costi e facilità di accesso ai mercati finanziari.\n\nQuesto articolo fornisce informazioni generali sugli ETF e non costituisce consulenza finanziaria. È sempre consigliabile consultare un consulente finanziario qualificato prima di prendere decisioni di investimento.",
    "excerpt": "Gli ETF rappresentano uno strumento di investimento sempre più popolare tra gli investitori italiani. Questi fondi offrono diversificazione, bassi costi e facilità di accesso ai mercati finanziari.\n\nQ...",
    "author": "ETF Italia AI",
    "date": "2025-09-03T16:53:32.912171",
    "category": "Guide agli Investimenti",
    "tags": [
      "ETF",
      "Investimenti",
      "Finanza",
      "ETF Azionari",
      "Mercati Europei"
    ],
    "featured": false,
    "published": true,
    "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    "readTime": 1,
    "views": 0,
    "likes": 0,
    "aiGenerated": true
  },
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