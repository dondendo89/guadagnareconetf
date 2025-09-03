#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generatore Automatico di Articoli ETF
Utilizza modelli gratuiti di Hugging Face per creare contenuti per il blog
"""

import os
import json
import random
import datetime
import time
import logging
from typing import List, Dict, Any

try:
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
    import torch
except ImportError:
    print("ERRORE: Installa le dipendenze con: pip install -r requirements.txt")
    exit(1)

# Configurazione logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_generator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ETFArticleGenerator:
    def __init__(self):
        """Inizializza il generatore di articoli ETF"""
        self.model_name = "microsoft/DialoGPT-medium"  # Modello gratuito e leggero
        self.generator = None
        self.topics = [
            "ETF azionari europei",
            "ETF obbligazionari", 
            "ETF settoriali tecnologia",
            "ETF mercati emergenti",
            "ETF sostenibili ESG",
            "ETF commodities",
            "ETF immobiliari REIT",
            "ETF small cap",
            "ETF dividend yield",
            "ETF value investing"
        ]
        
        self.article_templates = {
            "analisi": "Analisi {topic}: Opportunità e Rischi nel {year}",
            "guida": "Guida Completa agli {topic}: Come Investire nel {year}", 
            "confronto": "Confronto {topic}: I Migliori ETF del {year}",
            "trend": "Trend {topic}: Previsioni per il {year}",
            "strategia": "Strategie di Investimento con {topic} nel {year}"
        }
        
    def load_model(self):
        """Carica il modello di generazione testo"""
        try:
            logger.info(f"Caricamento modello: {self.model_name}")
            
            # Usa un modello più semplice e gratuito per iniziare
            self.generator = pipeline(
                "text-generation",
                model="gpt2",  # Modello completamente gratuito
                tokenizer="gpt2",
                device=-1,  # CPU (cambia a 0 per GPU)
                max_length=512,
                framework="pt",  # Specifica PyTorch
                trust_remote_code=False
            )
            
            logger.info("Modello caricato con successo")
            return True
            
        except Exception as e:
            logger.error(f"Errore nel caricamento del modello: {e}")
            # Fallback: crea un generatore semplificato
            try:
                logger.info("Tentativo con configurazione semplificata...")
                from transformers import GPT2LMHeadModel, GPT2Tokenizer
                
                self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
                self.model = GPT2LMHeadModel.from_pretrained('gpt2')
                self.generator = "manual"  # Flag per generazione manuale
                
                logger.info("Modello semplificato caricato con successo")
                return True
            except Exception as e2:
                logger.error(f"Errore anche con configurazione semplificata: {e2}")
                return False
    
    def generate_article_title(self) -> str:
        """Genera un titolo per l'articolo"""
        topic = random.choice(self.topics)
        template_type = random.choice(list(self.article_templates.keys()))
        template = self.article_templates[template_type]
        
        current_year = datetime.datetime.now().year
        title = template.format(topic=topic, year=current_year)
        
        return title
    
    def create_article_prompt(self, title: str) -> str:
        """Crea il prompt per la generazione dell'articolo"""
        prompts = [
            f"Scrivi un articolo professionale su: {title}. L'articolo deve essere informativo e utile per investitori italiani interessati agli ETF.",
            f"Articolo finanziario: {title}. Includi analisi di mercato, vantaggi, rischi e consigli pratici per investitori.",
            f"Guida agli investimenti: {title}. Spiega in modo chiaro e professionale le opportunità di investimento."
        ]
        
        return random.choice(prompts)
    
    def generate_article_content(self, title: str) -> Dict[str, Any]:
        """Genera il contenuto completo dell'articolo"""
        if not self.generator:
            if not self.load_model():
                return None
        
        try:
            # Crea il prompt
            prompt = self.create_article_prompt(title)
            
            # Genera il contenuto
            logger.info(f"Generazione articolo: {title}")
            
            if self.generator == "manual":
                # Generazione manuale con modello semplificato
                content = self.generate_with_manual_model(prompt)
            else:
                # Generazione con pipeline
                result = self.generator(
                    prompt,
                    max_length=400,
                    num_return_sequences=1,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.generator.tokenizer.eos_token_id
                )
                content = result[0]['generated_text']
            
            # Pulisci e formatta il contenuto
            content = self.clean_content(content, prompt)
            
            # Crea l'articolo strutturato
            article = {
                "id": self.generate_article_id(title),
                "title": title,
                "content": content,
                "excerpt": content[:200] + "...",
                "author": "ETF Italia AI",
                "date": datetime.datetime.now().isoformat(),
                "category": self.get_category_from_title(title),
                "tags": self.generate_tags(title),
                "featured": False,
                "published": True
            }
            
            logger.info(f"Articolo generato con successo: {title}")
            return article
            
        except Exception as e:
            logger.error(f"Errore nella generazione dell'articolo: {e}")
            # Fallback: crea articolo con contenuto predefinito
            return self.create_fallback_article(title)
    
    def generate_with_manual_model(self, prompt: str) -> str:
        """Genera contenuto usando il modello manuale"""
        try:
            import torch
            
            # Tokenizza il prompt
            inputs = self.tokenizer.encode(prompt, return_tensors='pt')
            
            # Genera il testo
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    max_length=400,
                    num_return_sequences=1,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            # Decodifica il risultato
            generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return generated_text
            
        except Exception as e:
            logger.error(f"Errore nella generazione manuale: {e}")
            # Fallback estremo: usa template predefinito
            return self.get_template_content(prompt)
    
    def get_template_content(self, prompt: str) -> str:
        """Genera contenuto usando template predefiniti"""
        templates = [
            "Gli ETF rappresentano uno strumento di investimento sempre più popolare tra gli investitori italiani. Questi fondi offrono diversificazione, bassi costi e facilità di accesso ai mercati finanziari.",
            "Investire in ETF può essere una strategia efficace per costruire un portafoglio diversificato. È importante comprendere i rischi e le opportunità di ogni tipologia di ETF.",
            "Il mercato degli ETF continua a crescere, offrendo agli investitori nuove opportunità di investimento in diversi settori e asset class."
        ]
        
        import random
        base_content = random.choice(templates)
        
        # Aggiungi contenuto specifico basato sul prompt
        if "commodities" in prompt.lower():
            base_content += " Le materie prime rappresentano un'asset class importante per la diversificazione del portafoglio."
        elif "tecnologia" in prompt.lower():
            base_content += " Il settore tecnologico offre opportunità di crescita interessanti per gli investitori."
        elif "obbligazionari" in prompt.lower():
            base_content += " Gli ETF obbligazionari possono fornire stabilità e reddito al portafoglio."
        
        return base_content
    
    def create_fallback_article(self, title: str) -> Dict[str, Any]:
        """Crea un articolo di fallback con contenuto predefinito"""
        try:
            # Contenuto di fallback basato sul titolo
            content = self.get_template_content(title)
            
            # Espandi il contenuto
            content += "\n\nQuesto articolo fornisce informazioni generali sugli ETF e non costituisce consulenza finanziaria. È sempre consigliabile consultare un consulente finanziario qualificato prima di prendere decisioni di investimento."
            
            article = {
                "id": self.generate_article_id(title),
                "title": title,
                "content": content,
                "excerpt": content[:200] + "...",
                "author": "ETF Italia AI",
                "date": datetime.datetime.now().isoformat(),
                "category": self.get_category_from_title(title),
                "tags": self.generate_tags(title),
                "featured": False,
                "published": True
            }
            
            logger.info(f"Articolo di fallback creato: {title}")
            return article
            
        except Exception as e:
            logger.error(f"Errore nella creazione dell'articolo di fallback: {e}")
            return None
    
    def clean_content(self, content: str, prompt: str) -> str:
        """Pulisce e formatta il contenuto generato"""
        # Rimuovi il prompt iniziale
        content = content.replace(prompt, "").strip()
        
        # Aggiungi struttura base se manca
        if len(content) < 100:
            content = self.create_fallback_content()
        
        # Formatta in paragrafi
        paragraphs = content.split('. ')
        formatted_content = ""
        
        for i, paragraph in enumerate(paragraphs):
            if paragraph.strip():
                if i == 0:
                    formatted_content += f"<p><strong>{paragraph.strip()}.</strong></p>\n\n"
                else:
                    formatted_content += f"<p>{paragraph.strip()}.</p>\n\n"
        
        return formatted_content
    
    def create_fallback_content(self) -> str:
        """Crea contenuto di fallback se la generazione fallisce"""
        fallback_contents = [
            "Gli ETF rappresentano uno strumento di investimento sempre più popolare tra gli investitori italiani. Offrono diversificazione, costi contenuti e facilità di accesso ai mercati globali. È importante valutare attentamente i rischi e le opportunità prima di investire.",
            "Il mercato degli ETF continua a crescere, offrendo nuove opportunità di investimento. Gli investitori dovrebbero considerare la propria strategia di investimento e i propri obiettivi finanziari prima di scegliere gli ETF più adatti.",
            "L'investimento in ETF richiede una strategia ben definita e una comprensione dei mercati finanziari. È consigliabile diversificare il portafoglio e monitorare regolarmente le performance degli investimenti."
        ]
        
        return random.choice(fallback_contents)
    
    def generate_article_id(self, title: str) -> str:
        """Genera un ID univoco per l'articolo"""
        # Converti il titolo in slug
        slug = title.lower()
        slug = slug.replace(" ", "-")
        slug = slug.replace(":", "")
        slug = slug.replace(",", "")
        slug = slug.replace(".", "")
        
        # Aggiungi timestamp per unicità
        timestamp = int(time.time())
        
        return f"{slug}-{timestamp}"
    
    def get_category_from_title(self, title: str) -> str:
        """Determina la categoria dall'titolo"""
        title_lower = title.lower()
        
        if "analisi" in title_lower:
            return "Analisi di Mercato"
        elif "guida" in title_lower:
            return "Guide agli Investimenti"
        elif "confronto" in title_lower:
            return "Confronti ETF"
        elif "trend" in title_lower or "previsioni" in title_lower:
            return "Trend e Previsioni"
        elif "strategia" in title_lower or "strategie" in title_lower:
            return "Strategie di Investimento"
        else:
            return "ETF News"
    
    def generate_tags(self, title: str) -> List[str]:
        """Genera tag basati sul titolo"""
        base_tags = ["ETF", "Investimenti", "Finanza"]
        
        title_lower = title.lower()
        
        if "azionari" in title_lower or "azioni" in title_lower:
            base_tags.append("ETF Azionari")
        if "obbligazionari" in title_lower or "obbligazioni" in title_lower:
            base_tags.append("ETF Obbligazionari")
        if "europei" in title_lower or "europa" in title_lower:
            base_tags.append("Mercati Europei")
        if "emergenti" in title_lower:
            base_tags.append("Mercati Emergenti")
        if "esg" in title_lower or "sostenibili" in title_lower:
            base_tags.append("ESG")
        if "tecnologia" in title_lower or "tech" in title_lower:
            base_tags.append("Tecnologia")
        if "dividend" in title_lower or "dividendi" in title_lower:
            base_tags.append("Dividendi")
        
        return base_tags
    
    def save_article(self, article: Dict[str, Any], filename: str = None) -> str:
        """Salva l'articolo in formato JSON"""
        if not filename:
            filename = f"article_{article['id']}.json"
        
        filepath = os.path.join("generated_articles", filename)
        
        # Crea la directory se non esiste
        os.makedirs("generated_articles", exist_ok=True)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(article, f, ensure_ascii=False, indent=2)
            
            logger.info(f"Articolo salvato: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Errore nel salvataggio dell'articolo: {e}")
            return None
    
    def generate_daily_articles(self, num_articles: int = 2) -> List[Dict[str, Any]]:
        """Genera il numero specificato di articoli giornalieri"""
        articles = []
        
        logger.info(f"Inizio generazione di {num_articles} articoli")
        
        for i in range(num_articles):
            try:
                # Genera titolo
                title = self.generate_article_title()
                
                # Genera articolo
                article = self.generate_article_content(title)
                
                if article:
                    # Salva articolo
                    filepath = self.save_article(article)
                    if filepath:
                        articles.append(article)
                        logger.info(f"Articolo {i+1}/{num_articles} completato")
                    
                    # Pausa tra le generazioni
                    time.sleep(2)
                else:
                    logger.warning(f"Fallita generazione articolo {i+1}")
                    
            except Exception as e:
                logger.error(f"Errore nella generazione dell'articolo {i+1}: {e}")
        
        logger.info(f"Generazione completata: {len(articles)} articoli creati")
        return articles

def main():
    """Funzione principale"""
    print("🤖 Generatore Automatico Articoli ETF")
    print("=====================================\n")
    
    # Inizializza il generatore
    generator = ETFArticleGenerator()
    
    # Carica il modello
    if not generator.load_model():
        print("❌ Errore nel caricamento del modello")
        return
    
    print("✅ Modello caricato con successo\n")
    
    # Genera articoli
    print("📝 Generazione articoli in corso...\n")
    articles = generator.generate_daily_articles(2)
    
    if articles:
        print(f"\n🎉 Generati {len(articles)} articoli con successo!")
        print("\nArticoli generati:")
        for i, article in enumerate(articles, 1):
            print(f"{i}. {article['title']}")
            print(f"   ID: {article['id']}")
            print(f"   Categoria: {article['category']}")
            print(f"   Tags: {', '.join(article['tags'])}\n")
    else:
        print("❌ Nessun articolo generato")

if __name__ == "__main__":
    main()