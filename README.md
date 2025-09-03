# GuadagnareConETF - Piattaforma ETF Italiana

🇮🇹 **Sito web moderno, responsive e SEO-friendly per analizzare, confrontare e monitorare ETF quotati su Borsa Italiana.**

## 🎯 Caratteristiche Principali

### 🔍 Strumenti di Analisi
- **Motore di ricerca ETF** con filtri avanzati (ISIN, settore, TER, distribuzione)
- **Schede ETF dettagliate** con grafici, performance storiche e composizione
- **Simulatore ETF** per calcoli di rendimento personalizzati
- **Comparatore ETF** per confrontare fino a 5 prodotti simultaneamente
- **Costruttore di portafoglio** con allocazioni personalizzate
- **Calcolatore FIRE** per l'indipendenza finanziaria

### 💰 Sistema di Affiliazione
- Integrazione con i principali broker italiani:
  - eToro (Social Trading)
  - Scalable Capital (Commissioni basse)
  - Trade Republic (Mobile-first)
  - DEGIRO (Ampia selezione)
  - Freedom24 (Mercati internazionali)

### 📊 Integrazione API
- **IEX Cloud API** - Prezzi in tempo reale e dati storici
- **Tradefeeds ETF Holdings API** - Composizione e dati tecnici
- **Cbonds API** - NAV, benchmark e analisi rischio
- **Borsa Italiana** - Dati ufficiali ETF quotati

## 🚀 Installazione

### Prerequisiti
- Browser moderno (Chrome, Firefox, Safari, Edge)
- Server web locale (opzionale per sviluppo)

### Setup Rapido

1. **Clona o scarica il progetto**
   ```bash
   git clone [repository-url]
   cd guadagnareconetf
   ```

2. **Configura le API Keys**
   
   Modifica il file `js/api-integration.js` e sostituisci i placeholder:
   ```javascript
   const apiConfig = {
       iexCloud: {
           token: 'YOUR_IEX_CLOUD_TOKEN', // Sostituisci con il tuo token
       },
       tradefeeds: {
           apiKey: 'YOUR_TRADEFEEDS_API_KEY', // Sostituisci con la tua chiave
       },
       cbonds: {
           apiKey: 'YOUR_CBONDS_API_KEY', // Sostituisci con la tua chiave
       }
   };
   ```

3. **Avvia il server locale** (opzionale)
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con PHP
   php -S localhost:8000
   ```

4. **Apri nel browser**
   ```
   http://localhost:8000
   ```

## 🔧 Configurazione API

### IEX Cloud (Prezzi e Dati Storici)
1. Registrati su [IEX Cloud](https://iexcloud.io/)
2. Ottieni il token API gratuito
3. Sostituisci `YOUR_IEX_CLOUD_TOKEN` nel file di configurazione

### Tradefeeds (Holdings ETF)
1. Registrati su [Tradefeeds](https://tradefeeds.com/)
2. Ottieni la chiave API
3. Sostituisci `YOUR_TRADEFEEDS_API_KEY` nel file di configurazione

### Cbonds (Analisi Rischio)
1. Registrati su [Cbonds](https://cbonds.com/)
2. Ottieni la chiave API
3. Sostituisci `YOUR_CBONDS_API_KEY` nel file di configurazione

## 📁 Struttura del Progetto

```
guadagnareconetf/
├── index.html              # Pagina principale
├── style.css              # Stili principali
├── main.js                # JavaScript principale
├── js/
│   ├── etf-search.js      # Motore di ricerca ETF
│   ├── simulator.js       # Simulatore investimenti
│   ├── comparator.js      # Comparatore ETF
│   ├── portfolio.js       # Costruttore portafoglio
│   ├── etf-details.js     # Schede dettagliate ETF
│   ├── fire-calculator.js # Calcolatore FIRE
│   ├── affiliate-system.js # Sistema affiliazione
│   └── api-integration.js # Integrazione API
└── README.md              # Questo file
```

## 🎨 Personalizzazione

### Colori e Tema
Modifica le variabili CSS in `style.css`:
```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... altre variabili */
}
```

### Logo e Branding
1. Sostituisci il logo nel file `index.html`
2. Aggiorna i meta tag per SEO
3. Modifica i colori del brand

### Broker di Affiliazione
Modifica la configurazione in `js/affiliate-system.js`:
```javascript
const affiliateConfig = {
    brokers: {
        etoro: {
            affiliateUrl: 'https://etoro.tw/YOUR_AFFILIATE_LINK',
            // ... altre configurazioni
        }
    }
};
```

## 📱 Responsive Design

Il sito è ottimizzato per:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🔍 SEO e Performance

### Ottimizzazioni Incluse
- Meta tags dinamici per ogni ETF
- Structured data (Schema.org)
- Open Graph e Twitter Cards
- Sitemap automatica
- Lazy loading delle immagini
- Minificazione CSS/JS

### Google Analytics
Aggiungi il tuo tracking ID in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🚀 Deploy su Vercel

1. **Installa Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configura il dominio personalizzato**
   - Vai su Vercel Dashboard
   - Aggiungi il dominio (es. finanzometro.it)
   - Configura i DNS

### Configurazione Vercel (vercel.json)
```json
{
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/etf/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🔒 Sicurezza

### Best Practices Implementate
- Validazione input utente
- Sanitizzazione dati API
- Rate limiting per le chiamate API
- HTTPS obbligatorio in produzione
- Content Security Policy

### Variabili d'Ambiente
Per la produzione, usa variabili d'ambiente:
```bash
# .env
IEX_CLOUD_TOKEN=your_token_here
TRADEFEEDS_API_KEY=your_key_here
CBONDS_API_KEY=your_key_here
```

## 📊 Analytics e Monitoraggio

### Metriche Tracciate
- Visualizzazioni pagina
- Click sui link affiliati
- Utilizzo degli strumenti
- Performance API
- Errori JavaScript

### Dashboard Analytics
Accedi ai dati tramite:
- Google Analytics
- Console del browser (localStorage)
- API di monitoraggio personalizzate

## 🐛 Troubleshooting

### Problemi Comuni

**1. API non funzionano**
- Verifica le chiavi API
- Controlla i limiti di rate
- Verifica la connessione internet

**2. Grafici non si caricano**
- Controlla che Chart.js sia caricato
- Verifica la console per errori
- Assicurati che i dati siano validi

**3. Responsive non funziona**
- Verifica il viewport meta tag
- Controlla i media queries CSS
- Testa su dispositivi reali

### Debug Mode
Attiva il debug aggiungendo `?debug=true` all'URL:
```
http://localhost:8000?debug=true
```

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 📞 Supporto

Per supporto e domande:
- 📧 Email: support@guadagnareconetf.it
- 💬 Telegram: @GuadagnareConETF
- 🐦 Twitter: @GuadagnareETF

## 🙏 Ringraziamenti

- [Chart.js](https://www.chartjs.org/) per i grafici
- [IEX Cloud](https://iexcloud.io/) per i dati finanziari
- [Vercel](https://vercel.com/) per l'hosting
- Community italiana degli investitori ETF

---

**Made with ❤️ for Italian ETF investors**

*Disclaimer: Questo sito è solo a scopo informativo. Non costituisce consulenza finanziaria. Investi sempre responsabilmente.*