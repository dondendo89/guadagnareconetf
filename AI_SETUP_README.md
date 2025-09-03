# 🤖 Sistema di Generazione Automatica Articoli ETF

## Panoramica

Questo sistema utilizza modelli AI gratuiti di Hugging Face per generare automaticamente articoli di qualità per il blog ETF Italia. Il sistema è completamente **gratuito** e funziona offline.

## 🚀 Installazione Rapida

### 1. Installa Python (se non già installato)
```bash
# Verifica se Python è installato
python3 --version

# Se non installato, scarica da: https://www.python.org/downloads/
```

### 2. Installa le Dipendenze
```bash
# Naviga nella directory del progetto
cd /Users/dev1/Desktop/dev/dev/guadagnareconetf

# Installa le dipendenze AI
pip3 install -r requirements.txt
```

### 3. Test del Sistema
```bash
# Test generazione manuale (1 articolo)
python3 scheduler.py manual

# Test veloce
python3 scheduler.py test
```

## 📝 Utilizzo

### Generazione Manuale
```bash
# Genera articoli manualmente
python3 scheduler.py manual

# Integra gli articoli nel blog
python3 ai_blog_integration.py
```

### Generazione Automatica
```bash
# Avvia lo scheduler automatico
python3 scheduler.py schedule

# Lo scheduler genererà:
# - 2 articoli alle 08:00
# - 1 articolo alle 18:00
```

### Integrazione nel Blog
```bash
# Importa automaticamente gli articoli generati
python3 ai_blog_integration.py
```

## 📁 Struttura File

```
guadagnareconetf/
├── ai_article_generator.py    # Generatore principale
├── scheduler.py               # Scheduler automatico
├── ai_blog_integration.py     # Integrazione con il blog
├── requirements.txt           # Dipendenze Python
├── generated_articles/        # Articoli generati (creata automaticamente)
├── processed_articles/        # Articoli processati
└── js/blog-data.js           # Dati del blog (aggiornato automaticamente)
```

## ⚙️ Configurazione

### Modifica Orari di Generazione
Modifica il file `scheduler.py` alle righe 65-70:
```python
# Cambia gli orari qui
schedule.every().day.at("08:00").do(self.generate_morning_articles)
schedule.every().day.at("18:00").do(self.generate_evening_articles)
```

### Personalizza Argomenti ETF
Modifica il file `ai_article_generator.py` alle righe 25-36:
```python
self.topics = [
    "ETF azionari europei",
    "ETF obbligazionari",
    # Aggiungi i tuoi argomenti qui
]
```

### Cambia Modello AI
Modifica il file `ai_article_generator.py` alla riga 24:
```python
# Modelli gratuiti disponibili:
self.model_name = "gpt2"                    # Veloce, leggero
# self.model_name = "microsoft/DialoGPT-medium"  # Più conversazionale
# self.model_name = "EleutherAI/gpt-neo-1.3B"    # Più potente (richiede più RAM)
```

## 🔧 Risoluzione Problemi

### Errore: "ModuleNotFoundError"
```bash
# Reinstalla le dipendenze
pip3 install --upgrade -r requirements.txt
```

### Errore: "Out of Memory"
```bash
# Usa un modello più leggero
# Modifica ai_article_generator.py riga 24:
self.model_name = "gpt2"  # Modello più leggero
```

### Articoli di Bassa Qualità
```bash
# Prova modelli diversi o aumenta max_length
# Modifica ai_article_generator.py riga 85:
max_length=800,  # Aumenta per articoli più lunghi
```

### Lo Scheduler Non Funziona
```bash
# Verifica che lo scheduler sia in esecuzione
ps aux | grep scheduler.py

# Riavvia lo scheduler
python3 scheduler.py schedule
```

## 📊 Monitoraggio

### Log del Sistema
```bash
# Visualizza log del generatore
tail -f ai_generator.log

# Visualizza log dello scheduler
tail -f scheduler.log
```

### Statistiche Articoli
```bash
# Mostra statistiche del blog
python3 ai_blog_integration.py
```

## 🔄 Automazione Completa

### Setup Automatico Giornaliero

1. **Avvia lo scheduler**:
```bash
nohup python3 scheduler.py schedule > scheduler_output.log 2>&1 &
```

2. **Crea script di integrazione automatica** (crontab):
```bash
# Apri crontab
crontab -e

# Aggiungi questa riga per integrare ogni ora
0 * * * * cd /Users/dev1/Desktop/dev/dev/guadagnareconetf && python3 ai_blog_integration.py
```

### Script di Avvio Completo
Crea `start_ai_system.sh`:
```bash
#!/bin/bash
cd /Users/dev1/Desktop/dev/dev/guadagnareconetf

# Avvia scheduler in background
nohup python3 scheduler.py schedule > scheduler.log 2>&1 &
echo "Scheduler avviato (PID: $!)")

# Avvia integrazione automatica ogni ora
echo "Sistema AI avviato con successo!"
echo "Log: tail -f scheduler.log"
```

## 💡 Suggerimenti

### Migliorare la Qualità
1. **Usa modelli più grandi** (se hai RAM sufficiente)
2. **Personalizza i prompt** in `ai_article_generator.py`
3. **Aggiungi dati di mercato reali** tramite API finanziarie

### Ottimizzazione Performance
1. **Usa GPU** se disponibile (cambia `device=-1` a `device=0`)
2. **Cache del modello** per evitare ricaricamenti
3. **Batch processing** per più articoli contemporaneamente

### Sicurezza
1. **Non esporre le API key** nei file
2. **Usa `.env` file** per configurazioni sensibili
3. **Backup regolari** degli articoli generati

## 🆘 Supporto

### Comandi Utili
```bash
# Stato del sistema
python3 -c "from ai_article_generator import ETFArticleGenerator; g=ETFArticleGenerator(); print('✅ Sistema OK' if g.load_model() else '❌ Errore')"

# Pulisci cache
rm -rf ~/.cache/huggingface/

# Reset completo
rm -rf generated_articles/ processed_articles/
```

### Log Importanti
- `ai_generator.log` - Log del generatore
- `scheduler.log` - Log dello scheduler
- `generated_articles/` - Articoli generati
- `processed_articles/` - Articoli integrati

## 🎯 Risultati Attesi

- **2-3 articoli al giorno** generati automaticamente
- **Contenuti SEO-friendly** con titoli ottimizzati
- **Categorizzazione automatica** degli articoli
- **Integrazione seamless** con il blog esistente
- **Costo zero** di operazione

---

**🚀 Il tuo sistema di generazione automatica articoli ETF è pronto!**

Per iniziare subito:
```bash
python3 scheduler.py manual
python3 ai_blog_integration.py
```