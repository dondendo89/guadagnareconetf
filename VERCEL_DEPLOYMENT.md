# Deployment su Vercel - Guadagnare con ETF

Questa guida spiega come deployare il sistema AI per la generazione automatica di articoli ETF su Vercel.

## 🚀 Setup Rapido

### 1. Preparazione del Repository

```bash
# Clona o prepara il repository
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2. Configurazione Vercel

1. **Installa Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login a Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy il progetto**:
   ```bash
   vercel
   ```

### 3. Configurazione Variabili d'Ambiente

Nel dashboard di Vercel, aggiungi queste variabili d'ambiente:

```
AI_MODEL_NAME=gpt-3.5-turbo
AI_MAX_TOKENS=2000
AI_TEMPERATURE=0.7
STORAGE_TYPE=file
API_TIMEOUT=600
MAX_ARTICLES_PER_REQUEST=5
BLOG_TITLE=Guadagnare con ETF
BLOG_DESCRIPTION=Il tuo portale per investimenti ETF intelligenti
DEBUG=false
LOG_LEVEL=info
```

## 📁 Struttura del Progetto

```
.
├── api/                          # Vercel Serverless Functions
│   ├── generate-articles.py      # Generazione articoli AI
│   ├── blog-data.py              # Gestione dati blog
│   └── storage.py                # Sistema storage
├── js/                           # JavaScript frontend
├── css/                          # Stili CSS
├── vercel.json                   # Configurazione Vercel
├── requirements.txt              # Dipendenze Python
├── .vercelignore                 # File da escludere
└── .env.example                  # Template variabili d'ambiente
```

## 🔧 API Endpoints

### Generazione Articoli
- **POST** `/api/generate-articles`
  - Genera articoli AI in background
  - Parametri: `{"num_articles": 2}`

### Gestione Blog
- **GET** `/api/blog-data`
  - Recupera tutti gli articoli
- **POST** `/api/blog-data`
  - Aggiorna articoli del blog

### Storage
- **GET** `/api/storage?action=get_articles`
  - Recupera articoli dallo storage
- **POST** `/api/storage`
  - Salva/elimina articoli

## 🛠️ Funzionalità

### ✅ Implementato
- ✅ Serverless functions per generazione AI
- ✅ Sistema storage basato su file
- ✅ Admin panel funzionante
- ✅ Blog pubblico
- ✅ Integrazione automatica articoli
- ✅ CORS configurato
- ✅ Gestione errori

### 🔄 Miglioramenti Futuri
- 🔄 Database esterno (PostgreSQL/MongoDB)
- 🔄 Autenticazione JWT
- 🔄 Cache Redis
- 🔄 CDN per immagini
- 🔄 Analytics

## 🚨 Limitazioni Vercel

1. **Timeout**: 10 secondi per Hobby plan, 60s per Pro
2. **Storage**: Temporaneo, si resetta ad ogni deploy
3. **File Size**: Max 50MB per function
4. **Memory**: 1024MB per Hobby plan

## 🔒 Sicurezza

### Produzione
1. Abilita autenticazione nell'admin panel
2. Configura CORS specifico
3. Usa HTTPS sempre
4. Monitora i log

### Variabili Sensibili
```
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-domain.vercel.app
```

## 📊 Monitoraggio

### Vercel Dashboard
- Visualizza deployment
- Monitora performance
- Controlla log errori
- Analytics traffico

### Log delle Functions
```bash
vercel logs your-project-name
```

## 🐛 Troubleshooting

### Errori Comuni

1. **Timeout durante generazione AI**:
   - Riduci `num_articles`
   - Ottimizza algoritmo AI
   - Considera background jobs

2. **Errori di import Python**:
   - Verifica `requirements.txt`
   - Controlla `PYTHONPATH`

3. **CORS errors**:
   - Verifica headers nelle API
   - Controlla `vercel.json`

4. **Storage non persistente**:
   - Normale su Vercel
   - Considera database esterno

### Debug

```bash
# Test locale
vercel dev

# Deploy di test
vercel --prod

# Visualizza log
vercel logs
```

## 🚀 Deploy Automatico

### GitHub Integration
1. Connetti repository a Vercel
2. Ogni push su `main` triggera deploy
3. Preview deployments per PR

### Comandi Utili
```bash
# Deploy production
vercel --prod

# Deploy preview
vercel

# Rollback
vercel rollback

# Alias custom domain
vercel alias set deployment-url your-domain.com
```

## 📈 Performance

### Ottimizzazioni
1. **Cold Start**: Mantieni functions "calde"
2. **Caching**: Implementa cache per articoli
3. **CDN**: Usa Vercel Edge Network
4. **Compression**: Abilita gzip

### Metriche
- Response time < 2s
- Cold start < 5s
- Uptime > 99.9%

## 🎯 Prossimi Passi

1. **Test completo del deployment**
2. **Configurazione dominio custom**
3. **Setup monitoring avanzato**
4. **Implementazione database esterno**
5. **Ottimizzazione performance**

---

**Nota**: Questo sistema è ottimizzato per Vercel ma può essere adattato per altri provider serverless come Netlify Functions o AWS Lambda.