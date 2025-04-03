# Rilevamento oggetti con YOLOv8

Questo programma utilizza YOLOv8 per rilevare oggetti nelle immagini e salva i risultati in un file JSON.

### Prerequisiti

1. Python 3.8 o superiore installato sul computer
2. Ambiente virtuale Python con le dipendenze installate

### Configurazione

1. Aprire il terminale nella cartella del progetto
2. Creare e attivare l'ambiente virtuale:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Su macOS/Linux
   # oppure
   .\venv\Scripts\activate  # Su Windows
   ```
3. Installare i pacchetti necessari:
   ```bash
   pip install -r requirements.txt
   ```

### Utilizzo

1. Eseguire il programma:
   ```bash
   # Utilizzo base (solo rilevamento):
   python detect.py /percorso/alla/cartella/immagini

   # Con ritaglio (salva gli oggetti rilevati come immagini separate):
   python detect.py -c /percorso/alla/cartella/immagini
   ```

### Output

Il programma:
- Processa tutte le immagini nella directory specificata
- Rileva gli oggetti in ogni immagine usando YOLOv8
- Salva i risultati del rilevamento in `data_yolo.json` nella cartella precedente dello script
- Se il ritaglio è abilitato (-c), salva le immagini degli oggetti individuali in una cartella `yolo_crops`

### Formato Output

L'output JSON è un array di oggetti, dove ogni oggetto rappresenta un'immagine analizzata. La struttura è la seguente:

```json
[
	{
		"FileName": "street_scene",
		"FileExtension": ".jpg",
		"Detections": [
			{
				"class": "person",
				"confidence": 0.95,
				"box": {
					"x": 120.5,
					"y": 80.2,
					"width": 150.8,
					"height": 180.3
				}
			},
			{
				"class": "car",
				"confidence": 0.92,
				"box": {
					"x": 320.1,
					"y": 200.5,
					"width": 180.2,
					"height": 90.7
				}
			},
			{
				"class": "traffic light",
				"confidence": 0.88,
				"box": {
					"x": 450.3,
					"y": 50.1,
					"width": 30.5,
					"height": 60.2
				}
			}
		],
		"Crops": [
			"street_scene_0.jpg",
			"street_scene_1.jpg",
			"street_scene_2.jpg"
		]
	}
]
```

Dove:
- `FileName`: Nome del file immagine (senza estensione)
- `FileExtension`: Estensione del file immagine
- `Detections`: Array di oggetti rilevati, ciascuno contenente:
  - `class`: Nome della classe dell'oggetto rilevato (es. "person", "car", "chair")
  - `confidence`: Punteggio di confidenza del rilevamento (0-1)
  - `box`: Coordinate del rettangolo di delimitazione
    - `x`: Coordinata sinistra in pixel
    - `y`: Coordinata superiore in pixel
    - `width`: Larghezza del rettangolo in pixel
    - `height`: Altezza del rettangolo in pixel
- `Crops`: Array di nomi dei file dei ritagli (presente solo se l'opzione -c è attiva)

