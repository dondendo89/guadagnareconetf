#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Integrazione AI Blog - ETF Italia
Importa automaticamente gli articoli generati dall'AI nel sistema del blog
"""

import os
import json
import glob
import logging
import datetime
from typing import List, Dict, Any

# Configurazione logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AIBlogIntegration:
    def __init__(self):
        """Inizializza l'integrazione AI-Blog"""
        self.generated_articles_dir = "generated_articles"
        self.processed_articles_dir = "processed_articles"
        self.blog_data_file = "js/blog-data.js"
        
        # Crea le directory se non esistono
        os.makedirs(self.processed_articles_dir, exist_ok=True)
    
    def get_new_articles(self) -> List[str]:
        """Trova nuovi articoli da processare"""
        if not os.path.exists(self.generated_articles_dir):
            logger.warning(f"Directory {self.generated_articles_dir} non trovata")
            return []
        
        # Trova tutti i file JSON nella directory degli articoli generati
        pattern = os.path.join(self.generated_articles_dir, "article_*.json")
        article_files = glob.glob(pattern)
        
        # Filtra solo i file non ancora processati
        new_articles = []
        for file_path in article_files:
            filename = os.path.basename(file_path)
            processed_path = os.path.join(self.processed_articles_dir, filename)
            
            if not os.path.exists(processed_path):
                new_articles.append(file_path)
        
        logger.info(f"Trovati {len(new_articles)} nuovi articoli da processare")
        return new_articles
    
    def load_article(self, file_path: str) -> Dict[str, Any]:
        """Carica un articolo dal file JSON"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                article = json.load(f)
            return article
        except Exception as e:
            logger.error(f"Errore nel caricamento dell'articolo {file_path}: {e}")
            return None
    
    def format_article_for_blog(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Formatta l'articolo per il sistema del blog"""
        # Converti il formato AI in formato blog
        blog_article = {
            "id": article.get("id"),
            "title": article.get("title"),
            "content": article.get("content"),
            "excerpt": article.get("excerpt"),
            "author": article.get("author", "ETF Italia AI"),
            "date": article.get("date"),
            "category": article.get("category"),
            "tags": article.get("tags", []),
            "featured": article.get("featured", False),
            "published": article.get("published", True),
            "image": self.get_default_image(article.get("category")),
            "readTime": self.calculate_read_time(article.get("content", "")),
            "views": 0,
            "likes": 0,
            "aiGenerated": True  # Flag per identificare articoli AI
        }
        
        return blog_article
    
    def get_default_image(self, category: str) -> str:
        """Restituisce un'immagine di default basata sulla categoria"""
        category_images = {
            "Analisi di Mercato": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
            "Guide agli Investimenti": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
            "Confronti ETF": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800",
            "Trend e Previsioni": "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800",
            "Strategie di Investimento": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800",
            "ETF News": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
        }
        
        return category_images.get(category, "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800")
    
    def calculate_read_time(self, content: str) -> int:
        """Calcola il tempo di lettura stimato"""
        # Rimuovi tag HTML per contare solo il testo
        import re
        text_content = re.sub(r'<[^>]+>', '', content)
        
        # Conta le parole (media 200 parole al minuto)
        word_count = len(text_content.split())
        read_time = max(1, round(word_count / 200))
        
        return read_time
    
    def load_existing_blog_data(self) -> List[Dict[str, Any]]:
        """Carica i dati del blog esistenti"""
        if not os.path.exists(self.blog_data_file):
            logger.warning(f"File {self.blog_data_file} non trovato, creando nuovo")
            return []
        
        try:
            with open(self.blog_data_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Estrai il JSON dal file JavaScript
            start_marker = "const blogArticles = "
            end_marker = ";\n\n// Funzioni"
            
            start_idx = content.find(start_marker)
            if start_idx == -1:
                logger.warning("Marker di inizio non trovato nel file blog-data.js")
                return []
            
            start_idx += len(start_marker)
            end_idx = content.find(end_marker, start_idx)
            
            if end_idx == -1:
                # Prova con un marker alternativo
                end_idx = content.rfind("];")
                if end_idx != -1:
                    end_idx += 1
                else:
                    logger.warning("Marker di fine non trovato nel file blog-data.js")
                    return []
            
            json_str = content[start_idx:end_idx].strip()
            if json_str.endswith(';'):
                json_str = json_str[:-1]
            
            articles = json.loads(json_str)
            logger.info(f"Caricati {len(articles)} articoli esistenti")
            return articles
            
        except Exception as e:
            logger.error(f"Errore nel caricamento dei dati del blog: {e}")
            return []
    
    def save_blog_data(self, articles: List[Dict[str, Any]]) -> bool:
        """Salva i dati del blog aggiornati"""
        try:
            # Crea il contenuto JavaScript
            js_content = f"""// Dati degli articoli del blog - ETF Italia
// Aggiornato automaticamente: {datetime.datetime.now().isoformat()}

const blogArticles = {json.dumps(articles, ensure_ascii=False, indent=2)};

// Funzioni per la gestione degli articoli
function getAllArticles() {{
    return blogArticles;
}}

function getArticleById(id) {{
    return blogArticles.find(article => article.id === id);
}}

function getArticlesByCategory(category) {{
    return blogArticles.filter(article => article.category === category);
}}

function getFeaturedArticles() {{
    return blogArticles.filter(article => article.featured);
}}

function getPublishedArticles() {{
    return blogArticles.filter(article => article.published);
}}

function getAIGeneratedArticles() {{
    return blogArticles.filter(article => article.aiGenerated);
}}

// Esporta per uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{
        blogArticles,
        getAllArticles,
        getArticleById,
        getArticlesByCategory,
        getFeaturedArticles,
        getPublishedArticles,
        getAIGeneratedArticles
    }};
}}"""
            
            # Salva il file
            with open(self.blog_data_file, 'w', encoding='utf-8') as f:
                f.write(js_content)
            
            logger.info(f"Dati del blog salvati: {len(articles)} articoli totali")
            return True
            
        except Exception as e:
            logger.error(f"Errore nel salvataggio dei dati del blog: {e}")
            return False
    
    def mark_article_as_processed(self, file_path: str) -> bool:
        """Marca un articolo come processato"""
        try:
            filename = os.path.basename(file_path)
            processed_path = os.path.join(self.processed_articles_dir, filename)
            
            # Copia il file nella directory dei processati
            import shutil
            shutil.copy2(file_path, processed_path)
            
            logger.info(f"Articolo marcato come processato: {filename}")
            return True
            
        except Exception as e:
            logger.error(f"Errore nel marcare l'articolo come processato: {e}")
            return False
    
    def process_new_articles(self) -> int:
        """Processa tutti i nuovi articoli"""
        new_article_files = self.get_new_articles()
        
        if not new_article_files:
            logger.info("Nessun nuovo articolo da processare")
            return 0
        
        # Carica articoli esistenti
        existing_articles = self.load_existing_blog_data()
        
        processed_count = 0
        
        for file_path in new_article_files:
            try:
                # Carica l'articolo AI
                ai_article = self.load_article(file_path)
                if not ai_article:
                    continue
                
                # Formatta per il blog
                blog_article = self.format_article_for_blog(ai_article)
                
                # Verifica che non esista già
                if any(art['id'] == blog_article['id'] for art in existing_articles):
                    logger.warning(f"Articolo già esistente: {blog_article['id']}")
                    continue
                
                # Aggiungi agli articoli esistenti
                existing_articles.append(blog_article)
                
                # Marca come processato
                if self.mark_article_as_processed(file_path):
                    processed_count += 1
                    logger.info(f"Processato: {blog_article['title']}")
                
            except Exception as e:
                logger.error(f"Errore nel processare {file_path}: {e}")
        
        # Salva i dati aggiornati
        if processed_count > 0:
            # Ordina per data (più recenti prima)
            existing_articles.sort(key=lambda x: x['date'], reverse=True)
            
            if self.save_blog_data(existing_articles):
                logger.info(f"✅ Processati {processed_count} nuovi articoli")
            else:
                logger.error("❌ Errore nel salvataggio dei dati del blog")
        
        return processed_count
    
    def get_statistics(self) -> Dict[str, Any]:
        """Restituisce statistiche sugli articoli"""
        articles = self.load_existing_blog_data()
        
        ai_articles = [art for art in articles if art.get('aiGenerated', False)]
        
        stats = {
            "total_articles": len(articles),
            "ai_generated": len(ai_articles),
            "human_written": len(articles) - len(ai_articles),
            "categories": {},
            "last_update": datetime.datetime.now().isoformat()
        }
        
        # Conta per categoria
        for article in articles:
            category = article.get('category', 'Senza Categoria')
            if category not in stats['categories']:
                stats['categories'][category] = {'total': 0, 'ai': 0}
            
            stats['categories'][category]['total'] += 1
            if article.get('aiGenerated', False):
                stats['categories'][category]['ai'] += 1
        
        return stats

def main():
    """Funzione principale"""
    print("🤖 Integrazione AI Blog - ETF Italia")
    print("===================================\n")
    
    integration = AIBlogIntegration()
    
    # Processa nuovi articoli
    processed = integration.process_new_articles()
    
    if processed > 0:
        print(f"✅ Processati {processed} nuovi articoli")
    else:
        print("ℹ️ Nessun nuovo articolo da processare")
    
    # Mostra statistiche
    stats = integration.get_statistics()
    print("\n📊 Statistiche Blog:")
    print(f"   Articoli totali: {stats['total_articles']}")
    print(f"   Generati da AI: {stats['ai_generated']}")
    print(f"   Scritti manualmente: {stats['human_written']}")
    
    print("\n📂 Per categoria:")
    for category, data in stats['categories'].items():
        print(f"   {category}: {data['total']} totali ({data['ai']} AI)")

if __name__ == "__main__":
    main()