function setup() {
	createCanvas(400, 400)
}

function draw() {
	background(200)
	noFill()
	stroke(0,0,0)

	// Disegna 100 poligoni concentrici con rotazione animata
	for (let i=0; i<100; i++) {
		// mouseX controlla il numero di lati, sin() crea l'animazione
		poligono(width/2, height/2, 30 + i * 15, floor(mouseX / 50) + 3, sin(frameCount * 0.05 - i * 0.1) * 2)
	}
}

// Funzione per disegnare un poligono regolare
function poligono(x, y, r, numeroDiAngoli, rotazione) {
	beginShape()

	// Calcola i vertici del poligono
	for (let i=0; i<numeroDiAngoli; i++) {
		const angolo = TWO_PI / numeroDiAngoli * i
		const vx = x + r * cos(angolo + rotazione)
		const vy = y + r * sin(angolo + rotazione)
		vertex(vx, vy)
	}

	endShape(CLOSE)

	// ellipse(x + r * cos(TWO_PI / 6 * 0), y + r * sin(TWO_PI / 6 * 0), 5, 5)
	// ellipse(x + r * cos(TWO_PI / 6 * 1), y + r * sin(TWO_PI / 6 * 1), 5, 5)
	// ellipse(x + r * cos(TWO_PI / 6 * 2), y + r * sin(TWO_PI / 6 * 2), 5, 5)
	// ellipse(x + r * cos(TWO_PI / 6 * 3), y + r * sin(TWO_PI / 6 * 3), 5, 5)
	// ellipse(x + r * cos(TWO_PI / 6 * 4), y + r * sin(TWO_PI / 6 * 4), 5, 5)
	// ellipse(x + r * cos(TWO_PI / 6 * 5), y + r * sin(TWO_PI / 6 * 5), 5, 5)


	// beginShape()
	// vertex(x + 10, y + 10)
	// vertex(x + 50, y + 10)
	// vertex(x + 50, y + 70)
	// vertex(x + 40, y + 100)
	// vertex(x + 20, y + 70)
	// vertex(x + 30, y + 50)
	// endShape(CLOSE)
}