# Estrazione di volti dalle immagini tramite Face-API

Questo programma utilizza Face-API per rilevare volti nelle immagini, analizzare età, genere ed espressioni, e salva i risultati in file JSON.

### Prerequisiti

1. Node.js installato sul computer
	- **IMPORTANTE**: Utilizzare Node.js versione 22, non funzionerà con versioni successive a causa di problemi di compatibilità con TensorFlow
2. Modelli Face-API nella cartella `model/`

### Configurazione

1. Aprire il terminale nella cartella del progetto
2. Installare i pacchetti necessari:
	```bash
	npm install
	```
3. Configurare il percorso delle immagini:
	- Creare un file `image_path.cfg` nella directory precedente
	- Inserire il percorso completo alla cartella delle immagini

### Utilizzo

1. Eseguire il programma:
	```bash
	# Utilizzo base (solo rilevamento):
	npm start
	# oppure
	node index.js

	# Con ritaglio (salva i volti rilevati come immagini separate):
	npm run crop
	# oppure
	node index.js -c
	```

### Output

Il programma:
- Processa tutte le immagini nella directory specificata
- Rileva i volti in ogni immagine usando Face-API
- Analizza età, genere ed espressioni dei volti rilevati
- Salva i risultati del rilevamento in `data_faces.json` nella directory padre dello script
- Se il ritaglio è abilitato (-c), salva le immagini dei volti individuali in una cartella `face_crops`

### Formato Output

L'output JSON è un array di oggetti, dove ogni oggetto rappresenta un'immagine analizzata. La struttura è la seguente:

```json
[
	{
		"FileName": "group_photo",
		"FileExtension": ".jpg",
		"Faces": [
			{
				"box": {
					"x": 120,
					"y": 80,
					"width": 150,
					"height": 180
				},
				"confidence": 98.5,
				"gender": "maschio",
				"genderConfidence": 95.2,
				"age": 35,
				"expression": "felice",
				"expressionConfidence": 92.3
			},
			{
				"box": {
					"x": 320,
					"y": 90,
					"width": 140,
					"height": 170
				},
				"confidence": 97.8,
				"gender": "femmina",
				"genderConfidence": 96.5,
				"age": 28,
				"expression": "neutra",
				"expressionConfidence": 88.7
			}
		]
	},
	{
		"FileName": "portrait",
		"FileExtension": ".jpg",
		"Faces": [
			{
				"box": {
					"x": 200,
					"y": 150,
					"width": 300,
					"height": 400
				},
				"confidence": 99.1,
				"gender": "maschio",
				"genderConfidence": 98.7,
				"age": 45,
				"expression": "serio",
				"expressionConfidence": 94.2
			}
		]
	}
]
```

Dove:
- `FileName`: Nome del file immagine (senza estensione)
- `FileExtension`: Estensione del file immagine
- `Faces`: Array di volti rilevati, ciascuno contenente:
	- `box`: Coordinate del rettangolo di delimitazione
		- `x`: Coordinata sinistra in pixel
		- `y`: Coordinata superiore in pixel
		- `width`: Larghezza del rettangolo in pixel
		- `height`: Altezza del rettangolo in pixel
	- `confidence`: Punteggio di confidenza del rilevamento (0-100%)
	- `gender`: Genere rilevato (maschio/femmina)
	- `genderConfidence`: Punteggio di confidenza del genere (0-100%)
	- `age`: Età stimata in anni
	- `expression`: Espressione dominante (felice, triste, arrabbiato, sorpreso, disgustato, spaventato, neutra)
	- `expressionConfidence`: Punteggio di confidenza dell'espressione (0-100%)

### Links

Basato sullo script: [vladmandic/face-api](https://github.com/vladmandic/face-api)
