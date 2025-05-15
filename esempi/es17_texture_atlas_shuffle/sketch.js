let atlas
let data
let immagini = []

// Parametri di zoom e spostamento
let dragX = 0
let dragY = 0
let zoom = 1
let dzoom = zoom

function preload() {
	atlas = loadImage('atlas_64.jpg')
	data = loadJSON('atlas_64.json')
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)

	// Workaround penoso visto che p5js non supporta JSON arrays
	Object.keys(data).forEach(k => {
		const item = data[k]
		const w = item.width
		const h = item.height
		const u1 = item.x / atlas.width
		const v1 = item.y / atlas.height
		const u2 = (item.x + w) / atlas.width
		const v2 = (item.y + h) / atlas.height
		immagini.push(new Immagine(item.FileName, w, h, u1, v1, u2, v2))
	})

	ordina('box')
}


function mouseWheel(event) {

    dzoom += event.deltaY * 0.01
    dzoom = Math.min(Math.max(0.05, dzoom), 10)

}

function keyPressed() {
	if (key == '1') {
		ordina('griglia')
	} else if (key == '2') {
		ordina('random')
	} else if (key == '3') {
		ordina('box')
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function ordina(modo) {
	const cella = 64 + 4

	if (modo == 'griglia') {

		const cols = Math.ceil(Math.sqrt(immagini.length))
		const offs = - cols * cella / 2

		immagini.forEach((immagine, i) => {
			const col = i % cols
			const row = Math.floor(i / cols)
			const x = col * cella + offs
			const y = row * cella + offs
			const z = 0
			immagine.dx = x
			immagine.dy = y
			immagine.dz = z
			immagine.dangolo = 0
		})
	} else if (modo == 'random') {

		const cols = Math.ceil(Math.sqrt(immagini.length))
		const max = cols * cella / 2

		immagini.forEach((immagine, i) => {
			const x = Math.random() * max * 2 - max
			const y = Math.random() * max * 2 - max
			const z = Math.random() * max * 2 - max

			immagine.dangolo = Math.random() * 2 * Math.PI
			immagine.dx = x
			immagine.dy = y
			immagine.dz = z

		})
	} else if (modo == 'box') {
		const c = cella * 3
		const cols = Math.ceil(Math.cbrt(immagini.length))
		const offs = - cols * c / 2

		immagini.forEach((immagine, i) => {
			const x = (i % cols % cols) * c + offs
			const y = Math.floor(i / cols % cols) * c + offs
			const z = Math.floor(i / cols / cols) * c + offs
			immagine.dangolo = 0
			immagine.dx = x
			immagine.dy = y
			immagine.dz = z
		})
	}
}

function draw() {

	zoom += (dzoom - zoom) * 0.1

	background(0)


	const rot = map(mouseX, 0, width, -PI * 0.3, PI * 0.3)
	rotateY(rot)

	scale(zoom)

	beginShape(QUADS)

	noStroke()
	textureMode(NORMAL)
	texture(atlas)

	const damp = 0.05

	immagini.forEach(immagine => {
		immagine.angolo += (immagine.dangolo - immagine.angolo) * damp
		immagine.px += (immagine.dx - immagine.px) * damp
		immagine.py += (immagine.dy - immagine.py) * damp
		immagine.pz += (immagine.dz - immagine.pz) * damp
		immagine.emettiVerticiRuotati()
	})

	endShape()
}

/**
 * Classe Immagine
 *
 * Questa classe rappresenta un'immagine all'interno di un atlas di texture.
 * Permette di gestire facilmente le coordinate di texture (UV) e le dimensioni
 * dell'immagine per il rendering.
 *
 * Parametri:
 * - filename: nome del file dell'immagine originale
 * - w: larghezza dell'immagine in pixel
 * - h: altezza dell'immagine in pixel
 * - u1, v1: coordinate UV dell'angolo superiore sinistro nell'atlas
 * - u2, v2: coordinate UV dell'angolo inferiore destro nell'atlas
 *
 * Il metodo emettiVertici() crea i quattro vertici necessari per disegnare
 * l'immagine come un quadrilatero nello spazio 3D, con le corrette coordinate
 * di texture.
 */

class Immagine {
	constructor(filename, w, h, u1, v1, u2, v2) {
		const tokens = filename.split('_')
		tokens.pop()
		this.nome = tokens.join(' ')
		this.w = w
		this.w2 = w / 2
		this.h = h
		this.h2 = h / 2
		this.u1 = u1
		this.v1 = v1
		this.u2 = u2
		this.v2 = v2

		// posizione
		this.angolo = 0
		this.dangolo = 0
		this.px = 0
		this.py = 0
		this.pz = 0
		this.dx = 0
		this.dy = 0
		this.dz = 0
	}
	emettiVertici(x = this.px, y = this.py, z = this.pz) {
		vertex(x - this.w2, y - this.h2, z, this.u1, this.v1)
		vertex(x + this.w2, y - this.h2, z, this.u2, this.v1)
		vertex(x + this.w2, y + this.h2, z, this.u2, this.v2)
		vertex(x - this.w2, y + this.h2, z, this.u1, this.v2)
	}
	emettiVerticiRuotati(x = this.px, y = this.py, z = this.pz, angolo = this.angolo) {
		const c = Math.cos(angolo)
		const s = Math.sin(angolo)

		// Angolo superiore sinistro
		const x1 = x + (-this.w2 * c + this.h2 * s)
		const y1 = y + (-this.w2 * s - this.h2 * c)

		// Angolo superiore destro
		const x2 = x + (this.w2 * c + this.h2 * s)
		const y2 = y + (this.w2 * s - this.h2 * c)

		// Angolo inferiore destro
		const x3 = x + (this.w2 * c - this.h2 * s)
		const y3 = y + (this.w2 * s + this.h2 * c)

		// Angolo inferiore sinistro
		const x4 = x + (-this.w2 * c - this.h2 * s)
		const y4 = y + (-this.w2 * s + this.h2 * c)

		vertex(x1, y1, z, this.u1, this.v1)
		vertex(x2, y2, z, this.u2, this.v1)
		vertex(x3, y3, z, this.u2, this.v2)
		vertex(x4, y4, z, this.u1, this.v2)
	}
}