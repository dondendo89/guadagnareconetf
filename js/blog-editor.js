// Advanced Blog Editor with Preview and Image Management
class BlogEditor {
    constructor() {
        this.currentArticle = null;
        this.isEditing = false;
        this.images = [];
        this.init();
    }

    init() {
        this.createEditorModal();
        this.setupEventListeners();
    }

    createEditorModal() {
        const modal = document.createElement('div');
        modal.id = 'blogEditorModal';
        modal.className = 'blog-editor-modal';
        modal.innerHTML = `
            <div class="editor-overlay" onclick="blogEditor.closeEditor()"></div>
            <div class="editor-container">
                <div class="editor-header">
                    <h2 id="editorTitle">Nuovo Articolo</h2>
                    <button class="close-btn" onclick="blogEditor.closeEditor()">×</button>
                </div>
                
                <div class="editor-content">
                    <div class="editor-tabs">
                        <button class="tab-btn active" data-tab="edit">Modifica</button>
                        <button class="tab-btn" data-tab="preview">Anteprima</button>
                        <button class="tab-btn" data-tab="images">Immagini</button>
                    </div>
                    
                    <div class="tab-content">
                        <!-- Edit Tab -->
                        <div id="editTab" class="tab-panel active">
                            <form id="articleForm">
                                <div class="form-group">
                                    <label for="articleTitle">Titolo</label>
                                    <input type="text" id="articleTitle" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="articleExcerpt">Estratto</label>
                                    <textarea id="articleExcerpt" rows="3" placeholder="Breve descrizione dell'articolo..."></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="articleContent">Contenuto</label>
                                    <div class="editor-toolbar">
                                        <button type="button" onclick="blogEditor.formatText('bold')"><b>B</b></button>
                                        <button type="button" onclick="blogEditor.formatText('italic')"><i>I</i></button>
                                        <button type="button" onclick="blogEditor.formatText('underline')"><u>U</u></button>
                                        <button type="button" onclick="blogEditor.insertHeading()">H1</button>
                                        <button type="button" onclick="blogEditor.insertList()">Lista</button>
                                        <button type="button" onclick="blogEditor.insertLink()">Link</button>
                                        <button type="button" onclick="blogEditor.insertImage()">Img</button>
                                    </div>
                                    <textarea id="articleContent" rows="15" placeholder="Scrivi il contenuto dell'articolo qui..."></textarea>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="articleCategory">Categoria</label>
                                        <select id="articleCategory">
                                            <option value="analisi">Analisi ETF</option>
                                            <option value="guida">Guide</option>
                                            <option value="mercati">Mercati</option>
                                            <option value="strategia">Strategie</option>
                                            <option value="news">News</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="articleTags">Tag (separati da virgola)</label>
                                        <input type="text" id="articleTags" placeholder="ETF, investimenti, borsa">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label>
                                        <input type="checkbox" id="articlePublished">
                                        Pubblica immediatamente
                                    </label>
                                </div>
                            </form>
                        </div>
                        
                        <!-- Preview Tab -->
                        <div id="previewTab" class="tab-panel">
                            <div class="article-preview">
                                <div id="previewContent">
                                    <p class="preview-placeholder">Scrivi qualcosa nell'editor per vedere l'anteprima...</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Images Tab -->
                        <div id="imagesTab" class="tab-panel">
                            <div class="image-manager">
                                <div class="image-upload">
                                    <input type="file" id="imageUpload" accept="image/*" multiple>
                                    <button type="button" onclick="document.getElementById('imageUpload').click()" class="btn btn-primary">
                                        Carica Immagini
                                    </button>
                                </div>
                                
                                <div class="image-gallery" id="imageGallery">
                                    <!-- Images will be displayed here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="editor-footer">
                    <button type="button" class="btn btn-secondary" onclick="blogEditor.closeEditor()">Annulla</button>
                    <button type="button" class="btn btn-primary" onclick="blogEditor.saveArticle()">Salva Articolo</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.addEditorStyles();
    }

    addEditorStyles() {
        if (document.getElementById('blog-editor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'blog-editor-styles';
        style.textContent = `
            .blog-editor-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
            }
            
            .blog-editor-modal.active {
                display: block;
            }
            
            .editor-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .editor-container {
                position: relative;
                width: 90%;
                max-width: 1200px;
                height: 90%;
                margin: 5% auto;
                background: white;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 2rem;
                border-bottom: 1px solid #e1e5e9;
                background: #f8f9fa;
                border-radius: 8px 8px 0 0;
            }
            
            .editor-header h2 {
                margin: 0;
                color: #333;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 2rem;
                color: #666;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s;
            }
            
            .close-btn:hover {
                background: #e9ecef;
            }
            
            .editor-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .editor-tabs {
                display: flex;
                border-bottom: 1px solid #e1e5e9;
                background: #f8f9fa;
            }
            
            .tab-btn {
                padding: 1rem 2rem;
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
                font-weight: 500;
                transition: all 0.3s;
            }
            
            .tab-btn.active {
                color: #667eea;
                background: white;
                border-bottom: 2px solid #667eea;
            }
            
            .tab-content {
                flex: 1;
                overflow: auto;
            }
            
            .tab-panel {
                display: none;
                padding: 2rem;
                height: 100%;
                overflow: auto;
            }
            
            .tab-panel.active {
                display: block;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #333;
            }
            
            .form-group input,
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #e1e5e9;
                border-radius: 5px;
                font-size: 1rem;
                transition: border-color 0.3s;
            }
            
            .form-group input:focus,
            .form-group textarea:focus,
            .form-group select:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .editor-toolbar {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                padding: 0.5rem;
                background: #f8f9fa;
                border: 1px solid #e1e5e9;
                border-radius: 5px 5px 0 0;
            }
            
            .editor-toolbar button {
                padding: 0.5rem;
                background: white;
                border: 1px solid #e1e5e9;
                border-radius: 3px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s;
            }
            
            .editor-toolbar button:hover {
                background: #e9ecef;
            }
            
            .article-preview {
                background: white;
                border: 1px solid #e1e5e9;
                border-radius: 5px;
                padding: 2rem;
                min-height: 400px;
            }
            
            .preview-placeholder {
                color: #888;
                font-style: italic;
                text-align: center;
                margin-top: 2rem;
            }
            
            .image-manager {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            
            .image-upload {
                text-align: center;
                padding: 2rem;
                border: 2px dashed #e1e5e9;
                border-radius: 5px;
            }
            
            .image-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
            }
            
            .image-item {
                position: relative;
                border: 1px solid #e1e5e9;
                border-radius: 5px;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s;
            }
            
            .image-item:hover {
                transform: scale(1.05);
            }
            
            .image-item img {
                width: 100%;
                height: 120px;
                object-fit: cover;
            }
            
            .image-item .image-actions {
                position: absolute;
                top: 5px;
                right: 5px;
                display: flex;
                gap: 5px;
            }
            
            .image-item .image-actions button {
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 3px;
                padding: 5px;
                cursor: pointer;
                font-size: 0.8rem;
            }
            
            .editor-footer {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                padding: 1rem 2rem;
                border-top: 1px solid #e1e5e9;
                background: #f8f9fa;
            }
            
            .btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                transition: background-color 0.3s;
            }
            
            .btn-primary {
                background: #667eea;
                color: white;
            }
            
            .btn-primary:hover {
                background: #5a6fd8;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #5a6268;
            }
        `;
        
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });
        
        // Image upload
        document.addEventListener('change', (e) => {
            if (e.target.id === 'imageUpload') {
                this.handleImageUpload(e);
            }
        });
        
        // Real-time preview update
        document.addEventListener('input', (e) => {
            if (e.target.closest('#articleForm')) {
                this.updatePreview();
            }
        });
    }

    openEditor(article = null) {
        this.currentArticle = article;
        this.isEditing = !!article;
        
        const modal = document.getElementById('blogEditorModal');
        const title = document.getElementById('editorTitle');
        
        title.textContent = this.isEditing ? 'Modifica Articolo' : 'Nuovo Articolo';
        
        if (article) {
            this.populateForm(article);
        } else {
            this.clearForm();
        }
        
        modal.classList.add('active');
        this.switchTab('edit');
    }

    closeEditor() {
        const modal = document.getElementById('blogEditorModal');
        modal.classList.remove('active');
        this.clearForm();
        this.currentArticle = null;
        this.isEditing = false;
    }

    populateForm(article) {
        document.getElementById('articleTitle').value = article.title || '';
        document.getElementById('articleExcerpt').value = article.excerpt || '';
        document.getElementById('articleContent').value = article.content || '';
        document.getElementById('articleCategory').value = article.category || 'analisi';
        document.getElementById('articleTags').value = article.tags ? article.tags.join(', ') : '';
        document.getElementById('articlePublished').checked = article.published || false;
        
        this.updatePreview();
    }

    clearForm() {
        document.getElementById('articleForm').reset();
        document.getElementById('previewContent').innerHTML = '<p class="preview-placeholder">Scrivi qualcosa nell\'editor per vedere l\'anteprima...</p>';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        if (tabName === 'preview') {
            this.updatePreview();
        } else if (tabName === 'images') {
            this.updateImageGallery();
        }
    }

    updatePreview() {
        const title = document.getElementById('articleTitle').value;
        const excerpt = document.getElementById('articleExcerpt').value;
        const content = document.getElementById('articleContent').value;
        const category = document.getElementById('articleCategory').value;
        const tags = document.getElementById('articleTags').value;
        
        const previewContent = document.getElementById('previewContent');
        
        if (!title && !excerpt && !content) {
            previewContent.innerHTML = '<p class="preview-placeholder">Scrivi qualcosa nell\'editor per vedere l\'anteprima...</p>';
            return;
        }
        
        let html = '';
        
        if (title) {
            html += `<h1>${title}</h1>`;
        }
        
        if (category || tags) {
            html += '<div class="article-meta">';
            if (category) {
                html += `<span class="category">${category}</span>`;
            }
            if (tags) {
                const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                html += tagList.map(tag => `<span class="tag">${tag}</span>`).join('');
            }
            html += '</div>';
        }
        
        if (excerpt) {
            html += `<div class="excerpt"><strong>${excerpt}</strong></div>`;
        }
        
        if (content) {
            // Simple markdown-like formatting
            let formattedContent = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/\n/g, '<br>');
            
            html += `<div class="content">${formattedContent}</div>`;
        }
        
        previewContent.innerHTML = html;
    }

    handleImageUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        data: e.target.result,
                        size: file.size
                    };
                    
                    this.images.push(imageData);
                    this.updateImageGallery();
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Clear the input
        event.target.value = '';
    }

    updateImageGallery() {
        const gallery = document.getElementById('imageGallery');
        
        if (this.images.length === 0) {
            gallery.innerHTML = '<p class="no-images">Nessuna immagine caricata.</p>';
            return;
        }
        
        let html = '';
        
        this.images.forEach(image => {
            html += `
                <div class="image-item" data-id="${image.id}">
                    <img src="${image.data}" alt="${image.name}">
                    <div class="image-actions">
                        <button onclick="blogEditor.insertImageIntoContent('${image.id}')">Inserisci</button>
                        <button onclick="blogEditor.removeImage('${image.id}')">×</button>
                    </div>
                </div>
            `;
        });
        
        gallery.innerHTML = html;
    }

    insertImageIntoContent(imageId) {
        const image = this.images.find(img => img.id == imageId);
        if (!image) return;
        
        const textarea = document.getElementById('articleContent');
        const imageMarkdown = `\n![${image.name}](${image.data})\n`;
        
        const cursorPos = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPos);
        const textAfter = textarea.value.substring(cursorPos);
        
        textarea.value = textBefore + imageMarkdown + textAfter;
        textarea.focus();
        textarea.setSelectionRange(cursorPos + imageMarkdown.length, cursorPos + imageMarkdown.length);
        
        this.updatePreview();
    }

    removeImage(imageId) {
        this.images = this.images.filter(img => img.id != imageId);
        this.updateImageGallery();
    }

    // Text formatting functions
    formatText(command) {
        const textarea = document.getElementById('articleContent');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let formattedText = '';
        
        switch(command) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `<u>${selectedText}</u>`;
                break;
        }
        
        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
        
        this.updatePreview();
    }

    insertHeading() {
        const textarea = document.getElementById('articleContent');
        const cursorPos = textarea.selectionStart;
        const heading = '\n## Titolo\n';
        
        textarea.value = textarea.value.substring(0, cursorPos) + heading + textarea.value.substring(cursorPos);
        textarea.focus();
        textarea.setSelectionRange(cursorPos + heading.length, cursorPos + heading.length);
        
        this.updatePreview();
    }

    insertList() {
        const textarea = document.getElementById('articleContent');
        const cursorPos = textarea.selectionStart;
        const list = '\n- Elemento 1\n- Elemento 2\n- Elemento 3\n';
        
        textarea.value = textarea.value.substring(0, cursorPos) + list + textarea.value.substring(cursorPos);
        textarea.focus();
        textarea.setSelectionRange(cursorPos + list.length, cursorPos + list.length);
        
        this.updatePreview();
    }

    insertLink() {
        const url = prompt('Inserisci URL:');
        if (!url) return;
        
        const text = prompt('Testo del link:', url);
        const textarea = document.getElementById('articleContent');
        const cursorPos = textarea.selectionStart;
        const link = `[${text || url}](${url})`;
        
        textarea.value = textarea.value.substring(0, cursorPos) + link + textarea.value.substring(cursorPos);
        textarea.focus();
        textarea.setSelectionRange(cursorPos + link.length, cursorPos + link.length);
        
        this.updatePreview();
    }

    insertImage() {
        this.switchTab('images');
    }

    saveArticle() {
        const title = document.getElementById('articleTitle').value.trim();
        const excerpt = document.getElementById('articleExcerpt').value.trim();
        const content = document.getElementById('articleContent').value.trim();
        const category = document.getElementById('articleCategory').value;
        const tags = document.getElementById('articleTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const published = document.getElementById('articlePublished').checked;
        
        if (!title) {
            alert('Il titolo è obbligatorio!');
            return;
        }
        
        const article = {
            title,
            excerpt,
            content,
            category,
            tags,
            published,
            date: new Date().toLocaleDateString('it-IT'),
            images: this.images
        };
        
        if (this.isEditing && this.currentArticle) {
            // Update existing article
            Object.assign(this.currentArticle, article);
        } else {
            // Add new article
            if (window.adminPanel) {
                window.adminPanel.adminData.articles.push(article);
            }
        }
        
        // Save to localStorage
        if (window.adminPanel) {
            window.adminPanel.saveData();
            window.adminPanel.loadBlogManager();
        }
        
        // Update main site
        if (window.adminIntegration) {
            window.adminIntegration.refresh();
        }
        
        this.closeEditor();
        alert('Articolo salvato con successo!');
    }
}

// Initialize blog editor
const blogEditor = new BlogEditor();

// Global functions for admin panel integration
window.blogEditor = blogEditor;

// Override the addArticle function in admin panel
if (typeof addArticle !== 'undefined') {
    window.addArticle = function() {
        blogEditor.openEditor();
    };
}

// Add edit function to admin panel
window.editArticleAdvanced = function(index) {
    if (window.adminPanel && window.adminPanel.adminData.articles[index]) {
        const article = window.adminPanel.adminData.articles[index];
        blogEditor.openEditor(article);
    }
};