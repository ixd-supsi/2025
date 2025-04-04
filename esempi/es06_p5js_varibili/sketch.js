function setup() {
	createCanvas(300, 200)
	background(200)
}

function draw() {
	// Colore basato sulla posizione del mouse
	fill(mouseX, mouseY, 0)
	// Disegna due cerchi speculari
	ellipse(mouseX, mouseY, 30, 30)
	ellipse(300 - mouseX, mouseY, 30, 30)
}

// Cambia lo sfondo con un colore casuale quando si preme un tasto
function keyPressed() {
	background(random(256), random(256), random(256))
}
