#!/bin/bash

# === CONFIGURAZIONE ===
SRC_DIR="./images"             # Directory di input
OUT_FILE="atlas.jpg"           # Immagine atlas di output
MANIFEST="atlas.json"          # Manifesto JSON di output
TILE_COLS=50                   # Colonne nell'atlas
TILE_ROWS=0                    # Righe calcolate automaticamente se 0
TILE_SIZE=64                   # Dimensione di ogni tile quadrato
UPDATE_EVERY=100               # Aggiorna il progresso ogni N immagini

# Controlla se ImageMagick è installato
if ! command -v magick &> /dev/null; then
    echo "Errore: ImageMagick non è installato. Si prega di installarlo prima."
    echo "Puoi installarlo usando: brew install imagemagick (su macOS)"
    exit 1
fi

# === SETUP ===
TMP_LIST=$(mktemp)
TMP_DIR=$(mktemp -d)

# Assicurati che la directory temporanea esista e sia scrivibile
if [ ! -d "$TMP_DIR" ]; then
    echo "Errore: Impossibile creare la directory temporanea"
    exit 1
fi

# Trova e ordina le immagini lessicograficamente
find "$SRC_DIR" -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" \) | sort > "$TMP_LIST"
TOTAL_IMAGES=$(wc -l < "$TMP_LIST")

if [ "$TOTAL_IMAGES" -eq 0 ]; then
    echo "Errore: Nessuna immagine trovata in $SRC_DIR"
    exit 1
fi

if [ "$TILE_ROWS" -eq 0 ]; then
    TILE_ROWS=$(( (TOTAL_IMAGES + TILE_COLS - 1) / TILE_COLS ))
fi

echo "Trovate $TOTAL_IMAGES immagini. Preparazione atlas ${TILE_COLS}x${TILE_ROWS}..."

# === ELABORAZIONE IMMAGINI E CREAZIONE MANIFESTO ===
echo "[" > "$MANIFEST"
i=0
while IFS= read -r IMG; do
    BASENAME=$(basename "$IMG")
    OUT_IMG="$TMP_DIR/$BASENAME"

    # Ottieni le dimensioni originali
    read ORIG_WIDTH ORIG_HEIGHT <<< $(magick identify -format "%w %h" "$IMG")

    # Calcola il fattore di scala per adattarsi a TILE_SIZE mantenendo le proporzioni
    if [ "$ORIG_WIDTH" -gt "$ORIG_HEIGHT" ]; then
        SCALE_FACTOR=$(echo "scale=2; $TILE_SIZE / $ORIG_WIDTH" | bc)
    else
        SCALE_FACTOR=$(echo "scale=2; $TILE_SIZE / $ORIG_HEIGHT" | bc)
    fi

    # Calcola le nuove dimensioni mantenendo le proporzioni
    NEW_WIDTH=$(echo "$ORIG_WIDTH * $SCALE_FACTOR" | bc | awk '{print int($1+0.5)}')
    NEW_HEIGHT=$(echo "$ORIG_HEIGHT * $SCALE_FACTOR" | bc | awk '{print int($1+0.5)}')

    # Ridimensiona l'immagine mantenendo le proporzioni
    if ! magick convert "$IMG" -resize "${NEW_WIDTH}x${NEW_HEIGHT}" -background black -gravity center -extent "${TILE_SIZE}x${TILE_SIZE}" "$OUT_IMG" 2>/dev/null; then
        echo "Attenzione: Impossibile ridimensionare $IMG, salto..."
        continue
    fi

    # Calcola l'offset per centrare l'immagine
    X_OFFSET=$(( (TILE_SIZE - NEW_WIDTH) / 2 ))
    Y_OFFSET=$(( (TILE_SIZE - NEW_HEIGHT) / 2 ))

    # Calcola la posizione del tile
    ROW=$((i / TILE_COLS))
    COL=$((i % TILE_COLS))
    X=$((COL * TILE_SIZE + X_OFFSET))
    Y=$((ROW * TILE_SIZE + Y_OFFSET))

    # Scrivi l'entry nel manifesto JSON
    printf '  {\n    "filename": "%s",\n    "x": %d,\n    "y": %d,\n    "width": %d,\n    "height": %d\n  }' \
        "$BASENAME" "$X" "$Y" "$TILE_SIZE" "$TILE_SIZE" >> "$MANIFEST"

    i=$((i + 1))
    if [ "$i" -lt "$TOTAL_IMAGES" ]; then
        echo "," >> "$MANIFEST"
    else
        echo "" >> "$MANIFEST"
    fi

    # Barra di progresso limitata
    if (( i % UPDATE_EVERY == 0 || i == TOTAL_IMAGES )); then
        PERCENT=$((i * 100 / TOTAL_IMAGES))
        PROGRESS_BAR=$(printf '%*s' $((PERCENT / 2)) '' | tr ' ' '#')
        REMAINING=$(printf '%*s' $((50 - PERCENT / 2)) '' | tr ' ' '.')
        printf "\r[%s%s] %3d%% (%d/%d)" "$PROGRESS_BAR" "$REMAINING" "$PERCENT" "$i" "$TOTAL_IMAGES"
    fi
done < "$TMP_LIST"
echo "]" >> "$MANIFEST"

echo -e "\nRidimensionamento completato."
echo "Manifesto JSON salvato in $MANIFEST"

# === CREAZIONE IMMAGINE ATLAS ===
echo "Generazione atlas..."
# Crea una lista di immagini ordinate lessicograficamente
find "$TMP_DIR" -type f | sort > "$TMP_LIST"

# Controlla se abbiamo immagini da montare
if [ ! -s "$TMP_LIST" ]; then
    echo "Errore: Nessuna immagine valida per creare l'atlas"
    exit 1
fi

# Crea l'atlas con controllo errori e sfondo nero
if ! magick montage @$TMP_LIST -tile "${TILE_COLS}x${TILE_ROWS}" -geometry +0+0 -background black "$OUT_FILE"; then
    echo "Errore: Impossibile creare l'immagine atlas"
    exit 1
fi

echo "Atlas salvato in $OUT_FILE"

# === PULIZIA ===
rm "$TMP_LIST"
rm -r "$TMP_DIR"
