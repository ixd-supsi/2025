
let atlas

function preload() {
	atlas = loadImage('atlas_64.jpg')
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function draw() {
	// Dimensione piastrelline
	const w = 64
	const h = 64

	// Numero di piastrelline per riga e per colonna
	const numH = Math.floor(atlas.width / w)
	const numV = Math.floor(atlas.height / h)

	// Spaziatura tra le piastrelline
	const interColonna = 10
	const totalWidth = numH * (w + interColonna) - interColonna
	const totalHeight = numV * (h + interColonna) - interColonna
	const offsetX = (width - totalWidth) / 2
	const offsetY = (height - totalHeight) / 2

	const rotazioneY = map(mouseX, 0, width, 0, TAU)
	const scala = map(mouseY, 0, height, 0.001, 1)

	background(200)
	noFill()
	stroke(0,0,0)

	rotateY(rotazioneY)
	scale(scala)

	noStroke()
	textureMode(NORMAL)
	beginShape(QUADS)
	texture(atlas)

	const t = frameCount * 0.001

	for (let j = 0; j < numV; j++) {
		for (let i = 0; i < numH; i++) {

			const x = i * (w + interColonna) + offsetX
			const y = j * (h + interColonna) + offsetY
			const z = Math.sin(i * 0.1 + t) * Math.cos(j * 0.1 + t) * 200

			const u1 = i / numH
			const v1 = j / numV
			const u2 = (i + 1) / numH
			const v2 = (j + 1) / numV

			vertex(x, y, z, u1, v1)
			vertex(x + w, y, z, u2, v1)
			vertex(x + w, y + h, z, u2, v2)
			vertex(x, y + h, z, u1, v2)
		}
	}
	endShape()
}

