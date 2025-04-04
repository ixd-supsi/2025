// Funzioni principali di p5.js: setup() viene eseguita una volta, draw() in loop
function setup() {
	createCanvas(300, 300)
	background(200) // Grigio chiaro (0-255)
}

function draw() {
	noStroke()
	fill(0) // Nero

	// Tre modi per incrementare una variabile
	/*
	i = i + 1
	i += 1
	i++
	*/

	// Disegna 100 pallini neri in posizioni casuali
	for(let i=0; i<100; i++) {
		ellipse(random(width), random(height), 3, 3)
	}

	fill(255) // Bianco
	const diam = random(10, 80) // Diametro casuale
	ellipse(random(width), random(height), diam, diam)
}

