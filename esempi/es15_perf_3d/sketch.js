
let cat

function preload() {
	cat = loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Kittyply_edit1.jpg/440px-Kittyply_edit1.jpg')
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function draw() {


	const numH = 120
	const numV = 120
	const w = cat.width
	const h = cat.height
	const interColonna = 20
	const totalWidth = numH * (w + interColonna) - interColonna
	const totalHeight = numV * (h + interColonna) - interColonna
	const offsetX = (width - totalWidth) / 2
	const offsetY = (height - totalHeight) / 2

	const rotazioneY = map(mouseX, 0, width, 0, TAU)
	const scala = map(mouseY, 0, height, 0.001, 1)

	background(200)
	noFill()
	stroke(0,0,0)

	// rotateX(frameCount * 0.01)

	rotateY(rotazioneY)
	scale(scala)

	noStroke()
	textureMode(NORMAL)
	beginShape(QUADS)

	const t = frameCount * 0.001

	for (let j = 0; j < numV; j++) {
		for (let i = 0; i < numH; i++) {
			const x = i * (w + interColonna) + offsetX
			const y = j * (h + interColonna) + offsetY
			const z = Math.sin(i * 0.1 + t) * Math.cos(j * 0.1 + t) * 2000

			const u = 0
			const v = 0

			texture(cat)
			vertex(x, y, z, u, v)
			vertex(x + w, y, z, u + 1, v)
			vertex(x + w, y + h, z, u + 1, v + 1)
			vertex(x, y + h, z, u, v + 1)
		}
	}
	endShape()
}

