from http.server import BaseHTTPRequestHandler
import json
import os
import requests
import time
from datetime import datetime
import random

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Get number of articles to generate (default 1)
            num_articles = data.get('num_articles', 1)
            
            # Generate articles using lightweight approach
            generated_articles = self.generate_lightweight_articles(num_articles)
            
            # Save articles to blog-data.js
            save_success = self.save_articles_to_blog(generated_articles)
            
            # Return success response
            response = {
                'success': True,
                'message': f'Generati {len(generated_articles)} articoli con successo',
                'articles_generated': len(generated_articles),
                'articles': generated_articles,
                'saved_to_blog': save_success
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            # Return error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': False,
                'error': str(e),
                'message': 'Errore durante la generazione degli articoli'
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def generate_lightweight_articles(self, num_articles):
        """Generate articles using a lightweight approach without heavy ML dependencies"""
        articles = []
        
        # Sample topics for ETF articles
        topics = [
            "Strategie di investimento con ETF nel 2025",
            "Analisi dei migliori ETF tecnologici",
            "ETF sostenibili: opportunità e rischi",
            "Come diversificare il portafoglio con ETF",
            "ETF a dividendo: guida completa",
            "Trend emergenti negli ETF commodities",
            "ETF immobiliari: analisi di mercato",
            "Confronto ETF azionari vs obbligazionari"
        ]
        
        categories = ["Strategie di Investimento", "Analisi di Mercato", "Guide agli Investimenti", "Trend e Previsioni"]
        
        for i in range(num_articles):
            topic = random.choice(topics)
            category = random.choice(categories)
            
            article = {
                'id': f'article_{int(time.time())}_{i}',
                'title': topic,
                'content': self.generate_article_content(topic),
                'author': 'AI Assistant',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'category': category,
                'tags': ['ETF', 'Investimenti', 'Finanza'],
                'image': '/images/etf-default.jpg'
            }
            
            articles.append(article)
        
        return articles
    
    def generate_article_content(self, topic):
        """Generate basic article content without heavy AI models"""
        # This is a simplified content generation
        # In production, you would integrate with OpenAI API or similar service
        content = f"""
        <h2>{topic}</h2>
        
        <p>Gli ETF (Exchange-Traded Funds) rappresentano uno strumento di investimento sempre più popolare tra gli investitori moderni. In questo articolo, esploreremo le principali caratteristiche e opportunità legate a {topic.lower()}.</p>
        
        <h3>Introduzione</h3>
        <p>Il mercato degli ETF ha registrato una crescita significativa negli ultimi anni, offrendo agli investitori un modo efficiente e diversificato per accedere a vari settori e mercati.</p>
        
        <h3>Analisi di Mercato</h3>
        <p>Le tendenze attuali mostrano un interesse crescente verso soluzioni di investimento passive e a basso costo, rendendo gli ETF una scelta attraente per molti portafogli.</p>
        
        <h3>Considerazioni per gli Investitori</h3>
        <p>È importante valutare attentamente i propri obiettivi di investimento, l'orizzonte temporale e la tolleranza al rischio prima di investire in ETF.</p>
        
        <h3>Conclusioni</h3>
        <p>Gli ETF continuano a rappresentare un'opzione valida per la diversificazione del portafoglio, offrendo trasparenza, liquidità e costi contenuti.</p>
        """
        
        return content.strip()
    
    def save_articles_to_blog(self, articles):
        """Save generated articles to blog-data.js via API call"""
        try:
            # Get the host from the current request
            host = self.headers.get('Host', 'guadagnareconetf.vercel.app')
            
            # Prepare API call to blog-data
            blog_api_url = f'https://{host}/api/blog-data'
            
            for article in articles:
                payload = {
                    'action': 'add_article',
                    'article': article
                }
                
                response = requests.post(
                    blog_api_url,
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code != 200:
                    print(f"Failed to save article {article['id']}: {response.text}")
                    return False
            
            return True
            
        except Exception as e:
            print(f"Error saving articles to blog: {str(e)}")
            return False
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        # Return API info
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'status': 'active',
            'message': 'AI Article Generation API',
            'endpoints': {
                'POST /api/generate-articles': 'Generate AI articles',
                'GET /api/generate-articles': 'API status'
            },
            'timestamp': datetime.now().isoformat()
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))