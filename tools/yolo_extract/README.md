# Estrazione di oggetti comuni dalle immagini tramite YOLO

Questo programma utilizza YOLOv8 per rilevare oggetti nelle immagini e salva i risultati in file JSON.

### Prerequisiti

1. Python 3.8 o superiore installato sul computer

### Configurazione

1. Aprire il terminale nella cartella ```yolo_extract```
2. Creare e attivare un ambiente virtuale:
   ```bash
   # Su Windows:
   python -m venv venv
   venv\Scripts\activate

   # Su macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Installare i pacchetti necessari:
   ```bash
   pip install -r requirements.txt
   ```

### Utilizzo

1. Le immagini si trovano in /percorso/alle/immagini
2. Eseguire il programma:
   ```bash
   # Utilizzo base (solo rilevamento):
   python detect.py /percorso/alle/immagini

   # Con ritaglio (salva gli oggetti rilevati come immagini separate):
   python detect.py -c /percorso/alle/immagini
   ```

### Output

Il programma:
- Processa tutte le immagini nella directory specificata
- Rileva gli oggetti in ogni immagine usando YOLOv8
- Salva i risultati del rilevamento in `data_yolo.json` nella directory padre dello script
- Se il ritaglio è abilitato (-c), salva le immagini degli oggetti individuali in una cartella `crops`

### Formato Output

L'output JSON contiene:
- `FileName`: Nome del file immagine (senza estensione)
- `FileExtension`: Estensione del file immagine
- `Detections`: Array di oggetti rilevati, ciascuno contenente:
  - `class`: Nome dell'oggetto rilevato
  - `confidence`: Punteggio di confidenza del rilevamento (0-1)
  - `bbox`: Coordinate del rettangolo di delimitazione
    - `x`: Coordinata sinistra
    - `y`: Coordinata superiore
    - `width`: Larghezza del rettangolo
    - `height`: Altezza del rettangolo
- `Crops`: (se il ritaglio è abilitato) Array di nomi file delle immagini ritagliate

