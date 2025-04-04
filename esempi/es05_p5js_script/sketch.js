function setup() {
	// Crea un'area di disegno e imposta lo sfondo
	createCanvas(300, 200)
	background(200)

	// Disegna un rettangolo giallo
	fill(255, 255, 0)
	rect(10, 20, 50, 50)

	// Disegna un rettangolo arancione con bordo bianco
	fill(255, 127, 0)
	stroke(255)
	rect(30, 30, 50, 50)

	// Disegna un cerchio rosso semitrasparente
	fill(255, 0, 0, 128)
	noStroke()
	ellipse(90, 50, 70, 70)
}

// Funzione draw vuota - nessuna animazione
function draw() {
}

