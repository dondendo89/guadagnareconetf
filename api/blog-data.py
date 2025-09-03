from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Read blog-data.js file
            # Try multiple possible paths for blog-data.js
            possible_paths = [
                os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'js', 'blog-data.js'),
                os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'blog-data.js'),
                os.path.join('/var/task', 'js', 'blog-data.js'),
                os.path.join('/var/task', 'blog-data.js')
            ]
            
            blog_data_path = None
            for path in possible_paths:
                if os.path.exists(path):
                    blog_data_path = path
                    break
            
            if blog_data_path and os.path.exists(blog_data_path):
                with open(blog_data_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Extract JSON from JavaScript file
                # Remove 'const blogArticles = ' and ';' to get pure JSON
                start_idx = content.find('[')
                end_idx = content.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_content = content[start_idx:end_idx]
                    articles = json.loads(json_content)
                    
                    response = {
                        'status': 'success',
                        'articles': articles,
                        'count': len(articles),
                        'timestamp': datetime.now().isoformat()
                    }
                else:
                    response = {
                        'status': 'error',
                        'message': 'Invalid blog-data.js format',
                        'articles': [],
                        'count': 0,
                        'timestamp': datetime.now().isoformat()
                    }
            else:
                # Debug information for troubleshooting
                debug_info = {
                    'checked_paths': possible_paths,
                    'current_dir': os.getcwd(),
                    'file_path': os.path.abspath(__file__),
                    'parent_dir': os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                }
                
                response = {
                    'status': 'error',
                    'message': 'blog-data.js file not found',
                    'debug': debug_info,
                    'articles': [],
                    'count': 0,
                    'timestamp': datetime.now().isoformat()
                }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'status': 'error',
                'message': str(e),
                'articles': [],
                'count': 0,
                'timestamp': datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_POST(self):
        try:
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            action = data.get('action')
            
            if action == 'update_articles':
                # Update blog-data.js with new articles
                articles = data.get('articles', [])
                
                blog_data_path = os.path.join(
                    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                    'blog-data.js'
                )
                
                # Create JavaScript content
                js_content = f"const blogArticles = {json.dumps(articles, ensure_ascii=False, indent=2)};"
                
                with open(blog_data_path, 'w', encoding='utf-8') as f:
                    f.write(js_content)
                
                response = {
                    'status': 'success',
                    'message': f'Updated {len(articles)} articles',
                    'timestamp': datetime.now().isoformat()
                }
                
            elif action == 'add_article':
                # Add a single article to blog-data.js
                article = data.get('article')
                
                if not article:
                    raise ValueError('Article data is required')
                
                # Read existing articles
                blog_data_path = os.path.join(
                    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                    'blog-data.js'
                )
                
                articles = []
                if os.path.exists(blog_data_path):
                    with open(blog_data_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        start_idx = content.find('[')
                        end_idx = content.rfind(']') + 1
                        
                        if start_idx != -1 and end_idx != -1:
                            json_content = content[start_idx:end_idx]
                            articles = json.loads(json_content)
                
                # Add new article
                articles.append(article)
                
                # Write back to file
                js_content = f"const blogArticles = {json.dumps(articles, ensure_ascii=False, indent=2)};"
                
                with open(blog_data_path, 'w', encoding='utf-8') as f:
                    f.write(js_content)
                
                response = {
                    'status': 'success',
                    'message': 'Article added successfully',
                    'timestamp': datetime.now().isoformat()
                }
                
            else:
                response = {
                    'status': 'error',
                    'message': 'Invalid action',
                    'timestamp': datetime.now().isoformat()
                }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()