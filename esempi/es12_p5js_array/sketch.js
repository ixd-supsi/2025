

const immagini = []

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)
	for (let i=0; i<200; i++) {
		immagini[i] = loadImage("maze/maze_" + nf(i, 3) + ".jpg")
	}
}

function draw() {
	const distanza = 2
	background(0)
	scale (1.4)
	rotateY(frameCount % 800 / 800 * TAU)
	translate(0, 0, immagini.length / 2 * distanza)
	imageMode(CENTER)
	for (let i=0; i<immagini.length; i++) {
		push()
		translate(0, 0, -i * distanza)
		image(immagini[(i + frameCount - 75 + immagini.length) % immagini.length], 0, 0)
		pop()
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

