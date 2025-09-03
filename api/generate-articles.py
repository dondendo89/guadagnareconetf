from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import subprocess
import threading
import time
from datetime import datetime

# Add the parent directory to the path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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
            
            # Start article generation in background
            def generate_articles():
                try:
                    # Run the AI article generator
                    result = subprocess.run([
                        'python3', 'ai_article_generator.py', 
                        '--num-articles', str(num_articles)
                    ], 
                    cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    capture_output=True, 
                    text=True, 
                    timeout=600  # 10 minutes timeout
                    )
                    
                    if result.returncode == 0:
                        # Run blog integration
                        integration_result = subprocess.run([
                            'python3', 'ai_blog_integration.py'
                        ], 
                        cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                        capture_output=True, 
                        text=True, 
                        timeout=60
                        )
                        
                        print(f"Articles generated and integrated successfully")
                    else:
                        print(f"Error generating articles: {result.stderr}")
                        
                except subprocess.TimeoutExpired:
                    print("Article generation timed out")
                except Exception as e:
                    print(f"Error in article generation: {str(e)}")
            
            # Start generation in background thread
            thread = threading.Thread(target=generate_articles)
            thread.daemon = True
            thread.start()
            
            # Return immediate response
            response = {
                'status': 'success',
                'message': f'Article generation started for {num_articles} articles',
                'timestamp': datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'status': 'error',
                'message': str(e),
                'timestamp': datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
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