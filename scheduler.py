#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scheduler per Generazione Automatica Articoli ETF
Esegue la generazione di articoli a orari prestabiliti
"""

import schedule
import time
import logging
import datetime
import os
import sys
from ai_article_generator import ETFArticleGenerator

# Configurazione logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scheduler.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ArticleScheduler:
    def __init__(self):
        """Inizializza lo scheduler"""
        self.generator = ETFArticleGenerator()
        self.is_running = False
        
    def generate_morning_articles(self):
        """Genera articoli del mattino (2 articoli)"""
        try:
            logger.info("🌅 Inizio generazione articoli del mattino")
            articles = self.generator.generate_daily_articles(2)
            
            if articles:
                logger.info(f"✅ Generati {len(articles)} articoli del mattino")
                self.log_generated_articles(articles, "mattino")
            else:
                logger.warning("⚠️ Nessun articolo generato al mattino")
                
        except Exception as e:
            logger.error(f"❌ Errore nella generazione mattutina: {e}")
    
    def generate_evening_articles(self):
        """Genera articoli della sera (1 articolo)"""
        try:
            logger.info("🌆 Inizio generazione articoli della sera")
            articles = self.generator.generate_daily_articles(1)
            
            if articles:
                logger.info(f"✅ Generati {len(articles)} articoli della sera")
                self.log_generated_articles(articles, "sera")
            else:
                logger.warning("⚠️ Nessun articolo generato alla sera")
                
        except Exception as e:
            logger.error(f"❌ Errore nella generazione serale: {e}")
    
    def log_generated_articles(self, articles, time_period):
        """Registra gli articoli generati"""
        logger.info(f"📝 Articoli generati ({time_period}):")
        for i, article in enumerate(articles, 1):
            logger.info(f"  {i}. {article['title']}")
            logger.info(f"     ID: {article['id']}")
            logger.info(f"     Categoria: {article['category']}")
    
    def setup_schedule(self):
        """Configura gli orari di generazione"""
        # Articoli del mattino alle 8:00
        schedule.every().day.at("08:00").do(self.generate_morning_articles)
        
        # Articolo della sera alle 18:00
        schedule.every().day.at("18:00").do(self.generate_evening_articles)
        
        # Opzionale: generazione di test ogni 5 minuti (per testing)
        # schedule.every(5).minutes.do(self.test_generation)
        
        logger.info("⏰ Schedule configurato:")
        logger.info("   - 08:00: 2 articoli del mattino")
        logger.info("   - 18:00: 1 articolo della sera")
    
    def test_generation(self):
        """Generazione di test (per debugging)"""
        logger.info("🧪 Test generazione articolo")
        try:
            articles = self.generator.generate_daily_articles(1)
            if articles:
                logger.info(f"✅ Test completato: {articles[0]['title']}")
            else:
                logger.warning("⚠️ Test fallito")
        except Exception as e:
            logger.error(f"❌ Errore nel test: {e}")
    
    def run_scheduler(self):
        """Avvia lo scheduler"""
        self.is_running = True
        logger.info("🚀 Scheduler avviato")
        
        # Carica il modello all'avvio
        logger.info("📥 Caricamento modello AI...")
        if not self.generator.load_model():
            logger.error("❌ Errore nel caricamento del modello")
            return
        
        logger.info("✅ Modello caricato, scheduler attivo")
        
        try:
            while self.is_running:
                schedule.run_pending()
                time.sleep(60)  # Controlla ogni minuto
                
        except KeyboardInterrupt:
            logger.info("⏹️ Scheduler fermato dall'utente")
            self.is_running = False
        except Exception as e:
            logger.error(f"❌ Errore nello scheduler: {e}")
            self.is_running = False
    
    def stop_scheduler(self):
        """Ferma lo scheduler"""
        self.is_running = False
        logger.info("⏹️ Scheduler fermato")
    
    def get_next_runs(self):
        """Mostra i prossimi job programmati"""
        jobs = schedule.get_jobs()
        logger.info("📅 Prossimi job programmati:")
        for job in jobs:
            logger.info(f"   - {job.next_run}: {job.job_func.__name__}")

def run_manual_generation():
    """Esegue una generazione manuale"""
    print("🤖 Generazione Manuale Articoli ETF")
    print("===================================\n")
    
    generator = ETFArticleGenerator()
    
    # Chiedi quanti articoli generare
    try:
        num_articles = int(input("Quanti articoli vuoi generare? (default: 2): ") or "2")
    except ValueError:
        num_articles = 2
    
    print(f"\n📝 Generazione di {num_articles} articoli...\n")
    
    articles = generator.generate_daily_articles(num_articles)
    
    if articles:
        print(f"\n🎉 Generati {len(articles)} articoli con successo!")
        print("\nArticoli generati:")
        for i, article in enumerate(articles, 1):
            print(f"{i}. {article['title']}")
            print(f"   File: generated_articles/article_{article['id']}.json")
    else:
        print("❌ Nessun articolo generato")

def main():
    """Funzione principale"""
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "manual":
            run_manual_generation()
            return
        elif command == "test":
            scheduler = ArticleScheduler()
            scheduler.test_generation()
            return
        elif command == "schedule":
            pass  # Continua con lo scheduler
        else:
            print("Comandi disponibili:")
            print("  python scheduler.py manual    - Generazione manuale")
            print("  python scheduler.py test      - Test generazione")
            print("  python scheduler.py schedule  - Avvia scheduler")
            return
    
    # Avvia lo scheduler automatico
    print("⏰ Scheduler Automatico Articoli ETF")
    print("===================================\n")
    
    scheduler = ArticleScheduler()
    scheduler.setup_schedule()
    scheduler.get_next_runs()
    
    print("\n🚀 Avvio scheduler...")
    print("Premi Ctrl+C per fermare\n")
    
    scheduler.run_scheduler()

if __name__ == "__main__":
    main()