from ultralytics import YOLO
import os
import json
from pathlib import Path
import cv2
import argparse

def ensure_crops_directory():
	"""Crea la directory crops se non esiste"""
	# Ottiene la directory padre dello script
	script_dir = Path(__file__).parent
	crops_dir = script_dir.parent / 'yolo_crops'
	if not crops_dir.exists():
		crops_dir.mkdir()
	return crops_dir

def crop_detection(image_path, bbox, output_path):
	"""Ritaglia il rilevamento dall'immagine e lo salva"""
	# Legge l'immagine
	img = cv2.imread(image_path)
	if img is None:
		raise ValueError(f"Impossibile leggere l'immagine: {image_path}")

	# Estrae le coordinate
	x, y, w, h = map(int, [bbox['x'], bbox['y'], bbox['width'], bbox['height']])

	# Assicura che le coordinate siano all'interno dei limiti dell'immagine
	x = max(0, x)
	y = max(0, y)
	w = min(w, img.shape[1] - x)
	h = min(h, img.shape[0] - y)

	# Ritaglia l'immagine
	crop = img[y:y+h, x:x+w]

	# Salva il ritaglio
	cv2.imwrite(output_path, crop)
	return True

def detect_objects(image_path, save_crops=False, crops_dir=None):
	# Carica il modello YOLOv8
	model = YOLO('yolov8n.pt')

	# Esegue l'inferenza sull'immagine
	results = model(image_path)

	# Elabora i risultati
	detections = []
	crops = []
	for idx, result in enumerate(results[0].boxes.data):
		x1, y1, x2, y2, conf, cls = result.tolist()
		# Ottiene il nome della classe
		class_name = results[0].names[int(cls)]
		detection = {
			'class': class_name,
			'confidence': float(conf),
			'box': {
				'x': float(x1),
				'y': float(y1),
				'width': float(x2 - x1),
				'height': float(y2 - y1)
			}
		}
		detections.append(detection)

		# Se save_crops è True, ritaglia e salva il rilevamento
		if save_crops and crops_dir:
			file_path = Path(image_path)
			crop_filename = f"{file_path.stem}_{idx}.jpg"
			crop_path = crops_dir / crop_filename
			try:
				if crop_detection(image_path, detection['box'], str(crop_path)):
					crops.append(crop_filename)
			except Exception as e:
				print(f"Errore nel ritagliare il rilevamento {idx} da {image_path}: {str(e)}")

	# Ottiene le informazioni del file
	file_path = Path(image_path)
	file_name = file_path.stem
	file_extension = file_path.suffix

	result = {
		"FileName": file_name,
		"FileExtension": file_extension,
		"Detections": detections
	}

	# Aggiunge le informazioni sui ritagli se disponibili
	if save_crops and crops:
		result["Crops"] = crops

	return result

def main():
	# Configura il parser degli argomenti
	parser = argparse.ArgumentParser(description='Rilevamento oggetti YOLO con ritaglio opzionale')
	parser.add_argument('-c', '--crop', action='store_true', help='Salva i rilevamenti ritagliati')
	parser.add_argument('images_dir', help='Percorso alla directory contenente le immagini (assoluto o relativo)')
	args = parser.parse_args()

	# Converte la directory delle immagini in percorso assoluto
	images_dir = Path(args.images_dir).resolve()
	if not images_dir.exists():
		print(f"Errore: La directory {images_dir} non esiste")
		return
	if not images_dir.is_dir():
		print(f"Errore: {images_dir} non è una directory")
		return

	# Crea la directory crops se necessario
	crops_dir = None
	if args.crop:
		crops_dir = ensure_crops_directory()

	# Elabora tutte le immagini nella directory delle immagini
	image_extensions = ('.jpg', '.jpeg', '.png')
	all_detections = []

	for image_file in images_dir.glob('*'):
		if image_file.suffix.lower() in image_extensions:
			print(f"Elaborazione di {image_file.name}...")
			detection = detect_objects(str(image_file), args.crop, crops_dir)
			all_detections.append(detection)

	# Salva tutti i rilevamenti in un unico file JSON nella directory padre dello script
	script_dir = Path(__file__).parent
	output_filename = script_dir.parent / 'data_yolo.json'
	with open(output_filename, 'w') as f:
		json.dump(all_detections, f, indent=4)

	print(f"Tutti i risultati dei rilevamenti sono stati salvati in {output_filename}")

if __name__ == '__main__':
	main()