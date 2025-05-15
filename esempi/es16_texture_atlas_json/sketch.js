let atlas
let data
let immagini = []

// Parametri di zoom e spostamento
let dragX = 0
let dragY = 0
let zoom = 1

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

	document.body.style.cursor = 'grab'
}

function mousePressed() {
	document.body.style.cursor = 'grabbing'
}

function mouseReleased() {
	document.body.style.cursor = 'grab'
}

function mouseDragged() {
	dragX += (mouseX - pmouseX) / zoom
	dragY += (mouseY - pmouseY) / zoom
}

function mouseWheel(event) {
    // Calcola la posizione del mouse in coordinate mondiali prima dello zoom
    const worldX = (mouseX - width/2) / zoom - dragX
    const worldY = (mouseY - height/2) / zoom - dragY

    zoom += event.deltaY * 0.01
    zoom = Math.min(Math.max(0.1, zoom), 10)

    // Calcola la nuova posizione del mouse in coordinate mondiali dopo lo zoom
    const newWorldX = (mouseX - width/2) / zoom - dragX
    const newWorldY = (mouseY - height/2) / zoom - dragY

    // Aggiusta dragX e dragY per mantenere il punto sotto il mouse nella stessa posizione
    dragX += (newWorldX - worldX)
    dragY += (newWorldY - worldY)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function draw() {

	background(0)



	// Calcola il numero di colonne e righe in base al numero di immagini
	const cols = 128
	const rows = Math.ceil(immagini.length / cols)

	// Dimensione delle celle (un po' più grande della larghezza e altezza delle immagini)
	const cella = 64 + 8

	const offsX = - cols * cella / 2
	const offsY = - rows * cella / 2

	// Calcola la posizione del mouse in coordinate mondiali prima dello zoom
	const worldMouseX = (mouseX - width/2) / zoom - dragX - offsX + cella / 2
	const worldMouseY = (mouseY - height/2) / zoom - dragY - offsY + cella / 2

	const cellX = Math.floor(worldMouseX / cella)
	const cellY = Math.floor(worldMouseY / cella)

	const cellIndex = cellX + cellY * cols

	const el = document.getElementById('info')

	if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows && cellIndex < immagini.length) {
		const immagine = immagini[cellIndex]
		el.innerHTML = immagine.nome
		el.style.left = mouseX + 'px'
		el.style.top = mouseY + 'px'
		el.style.display = 'block'
	} else {
		el.style.display = 'none'
	}

	scale(zoom)
	translate(dragX, dragY, 0)

	beginShape(QUADS)

	noStroke()
	textureMode(NORMAL)
	texture(atlas)

	for (let i = 0; i < immagini.length; i++) {
		const col = i % cols
		const row = Math.floor(i / cols)
		const x = col * cella + offsX
		const y = row * cella + offsY
		const z = 0
		immagini[i].emettiVertici(x, y, z)
	}

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
	}
	emettiVertici(x = 0, y = 0, z = 0) {
		vertex(x - this.w2, y - this.h2, z, this.u1, this.v1)
		vertex(x + this.w2, y - this.h2, z, this.u2, this.v1)
		vertex(x + this.w2, y + this.h2, z, this.u2, this.v2)
		vertex(x - this.w2, y + this.h2, z, this.u1, this.v2)
	}
	emettiVerticiRuotati(x = 0, y = 0, z = 0, angolo = 0) {
		const c = Math.cos(angolo)
		const s = Math.sin(angolo)

		// Angolo superiore sinistro
		const x1 = x + (-this.w2 * c - this.h2 * s)
		const y1 = y + (-this.w2 * s + this.h2 * c)

		// Angolo superiore destro
		const x2 = x + (this.w2 * c - this.h2 * s)
		const y2 = y + (this.w2 * s + this.h2 * c)

		// Angolo inferiore destro
		const x3 = x + (this.w2 * c + this.h2 * s)
		const y3 = y + (this.w2 * s - this.h2 * c)

		// Angolo inferiore sinistro
		const x4 = x + (-this.w2 * c + this.h2 * s)
		const y4 = y + (-this.w2 * s - this.h2 * c)

		vertex(x1, y1, z, this.u1, this.v1)
		vertex(x2, y2, z, this.u2, this.v1)
		vertex(x3, y3, z, this.u2, this.v2)
		vertex(x4, y4, z, this.u1, this.v2)
	}
}