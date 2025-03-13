# Estrazione di colori delle immagini

Aprire il terminale nella cartella ```color_extract```  


### Prima esecuzione
```
npm install
```   
Assicurarsi che il file ```image_path.cfg``` contenga il percorso **assoluto** alla cartella delle immagini da analizzare.


### Esecuzione script
```
node index.js
```
Verrà creato un file ```data_colors.json```

### Risultato ottenuto
```
[
    {
        "FileExtension": ".jpg",
        "FileName": "_AWJF1281",
		"Colors : [#FF3278]
    },
    ...ecc
]
```
