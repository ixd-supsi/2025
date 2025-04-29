// Variabili per la posizione del cerchio
let posizioneX, posizioneY

function setup() {
	createCanvas(300, 300)
	background(200)
	// Inizia al centro del canvas
	posizioneX = width / 2
	posizioneY = height / 2
}

function draw() {
	// Disegna il cerchio
	ellipse(posizioneX, posizioneY, 30, 30)

	// Muovi il cerchio in modo casuale
	posizioneX = posizioneX + random(-2, 2)
	posizioneY = posizioneY + random(-2, 2)

	// Gestisci il rimbalzo sui bordi orizzontali
	if (posizioneX < 0) {
		posizioneX = width + posizioneX
	} else if (posizioneX >= width) {
		posizioneX = width - posizioneX
	}

	// Gestisci il rimbalzo sui bordi verticali
	if (posizioneY < 0) {
		posizioneY = height + posizioneY
	} else if (posizioneY >= height) {
		posizioneY = height - posizioneY
	}
}

