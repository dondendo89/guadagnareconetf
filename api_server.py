#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Server API per ETF Italia - Gestione Generazione AI
Questo server gestisce le chiamate API per la generazione di articoli AI
"""

import os
import sys
import json
import subprocess
import logging
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

# Configurazione logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ETFAPIHandler(BaseHTTPRequestHandler):
    """Handler per le richieste API"""
    
    def do_OPTIONS(self):
        """Gestisce le richieste OPTIONS per CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Gestisce le richieste POST"""
        try:
            parsed_path = urlparse(self.path)
            
            if parsed_path.path == '/api/generate-articles':
                self.handle_generate_articles()
            else:
                self.send_error(404, 'Endpoint non trovato')
                
        except Exception as e:
            logger.error(f"Errore nella richiesta POST: {e}")
            self.send_error(500, str(e))
    
    def do_GET(self):
        """Gestisce le richieste GET"""
        try:
            parsed_path = urlparse(self.path)
            
            if parsed_path.path == '/api/status':
                self.handle_status()
            elif parsed_path.path == '/api/articles':
                self.handle_get_articles()
            else:
                self.send_error(404, 'Endpoint non trovato')
                
        except Exception as e:
            logger.error(f"Errore nella richiesta GET: {e}")
            self.send_error(500, str(e))
    
    def handle_generate_articles(self):
        """Gestisce la generazione di articoli AI"""
        try:
            # Leggi i dati della richiesta
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            count = data.get('count', 2)
            generation_type = data.get('type', 'manual')
            
            logger.info(f"Richiesta generazione: {count} articoli, tipo: {generation_type}")
            
            # Esegui la generazione in background
            def generate_async():
                try:
                    logger.info(f"Avvio generazione {generation_type} di {count} articoli...")
                    
                    if generation_type == 'test':
                        result = subprocess.run(
                            [sys.executable, 'scheduler.py', 'test'],
                            capture_output=True,
                            text=True,
                            timeout=600  # 10 minuti timeout
                        )
                    else:
                        result = subprocess.run(
                            [sys.executable, 'scheduler.py', 'manual'],
                            capture_output=True,
                            text=True,
                            timeout=600  # 10 minuti timeout
                        )
                    
                    logger.info(f"Scheduler terminato con codice: {result.returncode}")
                    if result.stdout:
                        logger.info(f"Output scheduler: {result.stdout[-500:]}")
                    if result.stderr:
                        logger.warning(f"Errori scheduler: {result.stderr[-500:]}")
                    
                    if result.returncode == 0:
                        logger.info("Generazione completata con successo, avvio integrazione...")
                        # Esegui integrazione automatica
                        integration_result = subprocess.run(
                            [sys.executable, 'ai_blog_integration.py'],
                            capture_output=True,
                            text=True,
                            timeout=60
                        )
                        
                        logger.info(f"Integrazione terminata con codice: {integration_result.returncode}")
                        if integration_result.stdout:
                            logger.info(f"Output integrazione: {integration_result.stdout[-500:]}")
                        if integration_result.stderr:
                            logger.warning(f"Errori integrazione: {integration_result.stderr[-500:]}")
                        
                        if integration_result.returncode == 0:
                            logger.info("🎉 Processo completo: generazione e integrazione completate con successo!")
                        else:
                            logger.error(f"❌ Errore nell'integrazione: {integration_result.stderr}")
                    else:
                        logger.error(f"❌ Errore nella generazione: {result.stderr}")
                        
                except subprocess.TimeoutExpired:
                    logger.error("⏰ Timeout nella generazione degli articoli")
                except Exception as e:
                    logger.error(f"💥 Errore nella generazione asincrona: {e}")
            
            # Avvia la generazione in background
            thread = threading.Thread(target=generate_async)
            thread.daemon = True
            thread.start()
            
            # Risposta immediata
            response = {
                'success': True,
                'message': f'Generazione di {count} articoli avviata',
                'count': count,
                'timestamp': datetime.now().isoformat()
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            logger.error(f"Errore nella generazione articoli: {e}")
            self.send_error(500, str(e))
    
    def handle_status(self):
        """Restituisce lo status del sistema"""
        try:
            # Controlla se i file necessari esistono
            files_status = {
                'ai_generator': os.path.exists('ai_article_generator.py'),
                'scheduler': os.path.exists('scheduler.py'),
                'integration': os.path.exists('ai_blog_integration.py'),
                'blog_data': os.path.exists('js/blog-data.js')
            }
            
            # Conta gli articoli generati
            generated_dir = 'generated_articles'
            generated_count = 0
            if os.path.exists(generated_dir):
                generated_count = len([f for f in os.listdir(generated_dir) if f.endswith('.json')])
            
            response = {
                'status': 'online',
                'timestamp': datetime.now().isoformat(),
                'files': files_status,
                'generated_articles': generated_count,
                'system_ready': all(files_status.values())
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            logger.error(f"Errore nel controllo status: {e}")
            self.send_error(500, str(e))
    
    def handle_get_articles(self):
        """Restituisce la lista degli articoli"""
        try:
            articles = []
            
            # Leggi gli articoli dal blog-data.js se esiste
            blog_data_path = 'js/blog-data.js'
            if os.path.exists(blog_data_path):
                with open(blog_data_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Estrai il JSON dal file JavaScript (semplificato)
                    start = content.find('const blogArticles = [')
                    if start != -1:
                        start += len('const blogArticles = ')
                        end = content.find('];', start)
                        if end != -1:
                            try:
                                articles_json = content[start:end+1]
                                articles = json.loads(articles_json)
                            except json.JSONDecodeError:
                                logger.warning("Errore nel parsing del blog-data.js")
            
            response = {
                'articles': articles,
                'count': len(articles),
                'ai_count': len([a for a in articles if a.get('aiGenerated', False)]),
                'timestamp': datetime.now().isoformat()
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            logger.error(f"Errore nel recupero articoli: {e}")
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        """Override per logging personalizzato"""
        logger.info(f"{self.address_string()} - {format % args}")

def run_server(port=8001):
    """Avvia il server API"""
    try:
        server_address = ('', port)
        httpd = HTTPServer(server_address, ETFAPIHandler)
        
        logger.info(f"🚀 Server API ETF Italia avviato su porta {port}")
        logger.info(f"📡 Endpoints disponibili:")
        logger.info(f"   POST /api/generate-articles - Genera articoli AI")
        logger.info(f"   GET  /api/status - Status del sistema")
        logger.info(f"   GET  /api/articles - Lista articoli")
        
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        logger.info("\n🛑 Server fermato dall'utente")
        httpd.shutdown()
    except Exception as e:
        logger.error(f"Errore nel server: {e}")

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Server API ETF Italia')
    parser.add_argument('--port', type=int, default=8001, help='Porta del server (default: 8001)')
    
    args = parser.parse_args()
    
    # Cambia nella directory corretta
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    run_server(args.port)