#!/bin/bash

# Verifica se sono stati forniti gli argomenti necessari
if [ $# -lt 2 ]; then
    echo "Errore: Specificare la dimensione e la cartella contenente le immagini"
    echo "Uso: $0 <dimensione> <cartella>"
    echo "Esempio: $0 800 /percorso/alla/cartella"
    echo "La dimensione specifica il lato più lungo dell'immagine in pixel"
    exit 1
fi

dimensione=$1
cartella=$2

# Verifica se la dimensione è un numero valido
if ! [[ "$dimensione" =~ ^[0-9]+$ ]]; then
    echo "Errore: La dimensione deve essere un numero intero"
    exit 1
fi

# Verifica se la cartella esiste
if [ ! -d "$cartella" ]; then
    echo "Errore: La cartella '$cartella' non esiste"
    exit 1
fi

# Conta il numero di immagini nella cartella
num_immagini=$(find "$cartella" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" -o -iname "*.tiff" -o -iname "*.heic" \) | wc -l)

if [ $num_immagini -eq 0 ]; then
    echo "Nessuna immagine trovata nella cartella '$cartella'"
    exit 0
fi

echo "Sono state trovate $num_immagini immagini da ridimensionare"
echo "Tutte le immagini verranno ridimensionate mantenendo le proporzioni"
echo "Il lato più lungo sarà impostato a $dimensione pixel"
echo "I metadati delle immagini verranno preservati"
read -p "Vuoi procedere? (s/n): " conferma

if [[ $conferma != "s" && $conferma != "S" ]]; then
    echo "Operazione annullata"
    exit 0
fi

# Ridimensionamento delle immagini
echo "Ridimensionamento in corso..."
find "$cartella" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" -o -iname "*.tiff" -o -iname "*.heic" \) | while read -r file; do
    nome_base=$(basename "$file")
    cartella_file=$(dirname "$file")

    # Ridimensiona l'immagine mantenendo le proporzioni e i metadati
    magick "$file" -resize "${dimensione}x${dimensione}>" "$cartella_file/$nome_base"

    echo "Ridimensionata: $nome_base"
done

echo "Ridimensionamento completato!"
