// Array per memorizzare le immagini del labirinto
const immagini = []

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)
	// Carica 200 immagini del labirinto
	for (let i=0; i<200; i++) {
		immagini[i] = loadImage("maze/maze_" + nf(i, 3) + ".jpg")
	}
}

function draw() {
	const distanza = 2 // Spazio tra le immagini
	background(0)
	scale(1.4)
	rotateY(frameCount % 800 / 800 * TAU) // Rotazione continua
	translate(0, 0, immagini.length / 2 * distanza)
	imageMode(CENTER)

	// Disegna le immagini in 3D con effetto tunnel
	for (let i=0; i<immagini.length; i++) {
		push()
		translate(0, 0, -i * distanza)
		image(immagini[(i + frameCount - 75 + immagini.length) % immagini.length], 0, 0)
		pop()
	}
}

// Ridimensiona il canvas quando cambia la finestra
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

