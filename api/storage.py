from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime
from typing import List, Dict, Any

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Parse query parameters
            from urllib.parse import urlparse, parse_qs
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            
            action = query_params.get('action', [''])[0]
            
            if action == 'get_articles':
                # Get all articles from storage
                articles = self._get_articles_from_storage()
                
                response = {
                    'status': 'success',
                    'articles': articles,
                    'count': len(articles),
                    'timestamp': datetime.now().isoformat()
                }
                
            elif action == 'get_stats':
                # Get storage statistics
                articles = self._get_articles_from_storage()
                ai_articles = [a for a in articles if a.get('aiGenerated', False)]
                
                response = {
                    'status': 'success',
                    'stats': {
                        'total_articles': len(articles),
                        'ai_articles': len(ai_articles),
                        'manual_articles': len(articles) - len(ai_articles),
                        'last_updated': datetime.now().isoformat()
                    },
                    'timestamp': datetime.now().isoformat()
                }
                
            else:
                response = {
                    'status': 'error',
                    'message': 'Invalid action parameter',
                    'timestamp': datetime.now().isoformat()
                }
            
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self._send_error_response(str(e))
    
    def do_POST(self):
        try:
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            action = data.get('action')
            
            if action == 'save_article':
                # Save a single article
                article = data.get('article')
                if not article:
                    raise ValueError('Article data is required')
                
                success = self._save_article_to_storage(article)
                
                response = {
                    'status': 'success' if success else 'error',
                    'message': 'Article saved successfully' if success else 'Failed to save article',
                    'timestamp': datetime.now().isoformat()
                }
                
            elif action == 'save_articles':
                # Save multiple articles
                articles = data.get('articles', [])
                
                success_count = 0
                for article in articles:
                    if self._save_article_to_storage(article):
                        success_count += 1
                
                response = {
                    'status': 'success',
                    'message': f'Saved {success_count}/{len(articles)} articles',
                    'saved_count': success_count,
                    'total_count': len(articles),
                    'timestamp': datetime.now().isoformat()
                }
                
            elif action == 'delete_article':
                # Delete an article
                article_id = data.get('article_id')
                if not article_id:
                    raise ValueError('Article ID is required')
                
                success = self._delete_article_from_storage(article_id)
                
                response = {
                    'status': 'success' if success else 'error',
                    'message': 'Article deleted successfully' if success else 'Failed to delete article',
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
            self._send_error_response(str(e))
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def _get_articles_from_storage(self) -> List[Dict[str, Any]]:
        """Get articles from storage (file-based for now, can be extended to database)"""
        try:
            # Try to read from blog-data.js first
            blog_data_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'blog-data.js'
            )
            
            if os.path.exists(blog_data_path):
                with open(blog_data_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Extract JSON from JavaScript file
                start_idx = content.find('[')
                end_idx = content.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_content = content[start_idx:end_idx]
                    return json.loads(json_content)
            
            return []
            
        except Exception as e:
            print(f"Error reading articles: {str(e)}")
            return []
    
    def _save_article_to_storage(self, article: Dict[str, Any]) -> bool:
        """Save article to storage"""
        try:
            # Get existing articles
            articles = self._get_articles_from_storage()
            
            # Check if article already exists (by ID)
            article_id = article.get('id')
            existing_index = -1
            
            for i, existing_article in enumerate(articles):
                if existing_article.get('id') == article_id:
                    existing_index = i
                    break
            
            # Update existing or add new
            if existing_index >= 0:
                articles[existing_index] = article
            else:
                articles.append(article)
            
            # Save back to file
            return self._save_articles_to_file(articles)
            
        except Exception as e:
            print(f"Error saving article: {str(e)}")
            return False
    
    def _delete_article_from_storage(self, article_id: str) -> bool:
        """Delete article from storage"""
        try:
            articles = self._get_articles_from_storage()
            
            # Filter out the article to delete
            filtered_articles = [a for a in articles if a.get('id') != article_id]
            
            if len(filtered_articles) < len(articles):
                return self._save_articles_to_file(filtered_articles)
            
            return False  # Article not found
            
        except Exception as e:
            print(f"Error deleting article: {str(e)}")
            return False
    
    def _save_articles_to_file(self, articles: List[Dict[str, Any]]) -> bool:
        """Save articles array to blog-data.js file"""
        try:
            blog_data_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'blog-data.js'
            )
            
            # Create JavaScript content
            js_content = f"const blogArticles = {json.dumps(articles, ensure_ascii=False, indent=2)};"
            
            with open(blog_data_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            
            return True
            
        except Exception as e:
            print(f"Error saving articles to file: {str(e)}")
            return False
    
    def _send_error_response(self, error_message: str):
        """Send error response"""
        self.send_response(500)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {
            'status': 'error',
            'message': error_message,
            'timestamp': datetime.now().isoformat()
        }
        
        self.wfile.write(json.dumps(error_response).encode('utf-8'))