# Ridimensionare immagini (batch)

Aprire il terminale nella cartella ```resize```  


### Prima esecuzione
```
npm install
```   
Assicurarsi che il file ```image_path.cfg``` contenga il percorso **assoluto** alla cartella delle immagini da analizzare.


### Esecuzione script
```
node index.js
```
Verrà creato un file ```data_images.json```

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
