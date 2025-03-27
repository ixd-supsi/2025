from ultralytics import YOLO
import os
import json
from pathlib import Path
import cv2
import argparse

def ensure_crops_directory():
    """Create crops directory if it doesn't exist"""
    # Get the parent directory of the script
    script_dir = Path(__file__).parent
    crops_dir = script_dir / 'crops'
    if not crops_dir.exists():
        crops_dir.mkdir()
    return crops_dir

def crop_detection(image_path, bbox, output_path):
    """Crop the detection from the image and save it"""
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")

    # Extract coordinates
    x, y, w, h = map(int, [bbox['x'], bbox['y'], bbox['width'], bbox['height']])

    # Ensure coordinates are within image bounds
    x = max(0, x)
    y = max(0, y)
    w = min(w, img.shape[1] - x)
    h = min(h, img.shape[0] - y)

    # Crop the image
    crop = img[y:y+h, x:x+w]

    # Save the crop
    cv2.imwrite(output_path, crop)
    return True

def detect_objects(image_path, save_crops=False, crops_dir=None):
    # Load the YOLOv8 model
    model = YOLO('yolov8n.pt')

    # Run inference on the image
    results = model(image_path)

    # Process results
    detections = []
    crops = []
    for idx, result in enumerate(results[0].boxes.data):
        x1, y1, x2, y2, conf, cls = result.tolist()
        # Get the class name
        class_name = results[0].names[int(cls)]
        detection = {
            'class': class_name,
            'confidence': float(conf),
            'bbox': {
                'x': float(x1),
                'y': float(y1),
                'width': float(x2 - x1),
                'height': float(y2 - y1)
            }
        }
        detections.append(detection)

        # If save_crops is True, crop and save the detection
        if save_crops and crops_dir:
            file_path = Path(image_path)
            crop_filename = f"{file_path.stem}_{idx}.jpg"
            crop_path = crops_dir / crop_filename
            try:
                if crop_detection(image_path, detection['bbox'], str(crop_path)):
                    crops.append(crop_filename)
            except Exception as e:
                print(f"Error cropping detection {idx} from {image_path}: {str(e)}")

    # Get file information
    file_path = Path(image_path)
    file_name = file_path.stem
    file_extension = file_path.suffix

    result = {
        "FileName": file_name,
        "FileExtension": file_extension,
        "Detections": detections
    }

    # Add crops information if available
    if save_crops and crops:
        result["Crops"] = crops

    return result

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='YOLO Object Detection with optional cropping')
    parser.add_argument('-c', '--crop', action='store_true', help='Save cropped detections')
    parser.add_argument('images_dir', help='Path to directory containing images (absolute or relative)')
    args = parser.parse_args()

    # Convert images directory to absolute path
    images_dir = Path(args.images_dir).resolve()
    if not images_dir.exists():
        print(f"Error: Directory {images_dir} does not exist")
        return
    if not images_dir.is_dir():
        print(f"Error: {images_dir} is not a directory")
        return

    # Create crops directory if needed
    crops_dir = None
    if args.crop:
        crops_dir = ensure_crops_directory()

    # Process all images in the images directory
    image_extensions = ('.jpg', '.jpeg', '.png')
    all_detections = []

    for image_file in images_dir.glob('*'):
        if image_file.suffix.lower() in image_extensions:
            print(f"Processing {image_file.name}...")
            detection = detect_objects(str(image_file), args.crop, crops_dir)
            all_detections.append(detection)

    # Save all detections to a single JSON file in the script's parent directory
    script_dir = Path(__file__).parent
    output_filename = script_dir / 'data_yolo.json'
    with open(output_filename, 'w') as f:
        json.dump(all_detections, f, indent=4)

    print(f"All detection results saved to {output_filename}")

if __name__ == '__main__':
    main()