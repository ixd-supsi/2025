#!/bin/bash

# Verifica se è stato fornito un argomento
if [ $# -eq 0 ]; then
    echo "Errore: Specificare la cartella contenente le immagini"
    echo "Uso: $0 <cartella>"
    exit 1
fi

# Verifica se la cartella esiste
if [ ! -d "$1" ]; then
    echo "Errore: La cartella '$1' non esiste"
    exit 1
fi

# Conta il numero di immagini nella cartella
num_immagini=$(find "$1" -type f \( -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" -o -iname "*.tiff" -o -iname "*.heic" \) | wc -l)

if [ $num_immagini -eq 0 ]; then
    echo "Nessuna immagine trovata nella cartella '$1'"
    exit 0
fi

echo "Sono state trovate $num_immagini immagini da convertire in JPG"
echo "Le immagini originali verranno eliminate dopo la conversione"
echo "I metadati delle immagini verranno preservati"
read -p "Vuoi procedere? (s/n): " conferma

if [[ $conferma != "s" && $conferma != "S" ]]; then
    echo "Operazione annullata"
    exit 0
fi

# Conversione delle immagini
echo "Conversione in corso..."
find "$1" -type f \( -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" -o -iname "*.tiff" -o -iname "*.heic" \) | while read -r file; do
    nome_base=$(basename "$file")
    nome_senza_estensione="${nome_base%.*}"
    cartella=$(dirname "$file")

    # Converti l'immagine in JPG mantenendo i metadati
    magick "$file" "$cartella/$nome_senza_estensione.jpg"

    # Elimina il file originale
    rm "$file"

    echo "Convertito: $nome_base -> $nome_senza_estensione.jpg"
done

echo "Conversione completata :)"
