#!/bin/bash
# cancella le immagini che contengono la stringa di testo check_text nel nome
# !!! attenzione !!! il comando rm è irreversibile, non è possibile recuperare i file cancellati 

# path delle immagini
path=/Users/giovanni/Documents/job/corso-ixd/tools/2_bash_tools/remove_files/imgs

# stringa di testo da cercare nel nome delle immagini
check_text=b

# ciclo per ogni file nella cartella
for file in "$path"/*.jpg;
do
	# se il file esiste e il nome del file contiene la stringa di testo
	if [ -f "$file" ] && [[ "$(basename "$file")" == *$check_text* ]]; then
		
		# stampa il nome del file
		echo "remove: " "$(basename "$file")"

		# cancella il file
		rm "$file"
	fi

done

