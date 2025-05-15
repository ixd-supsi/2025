let atlas
let data
let immagini = []


const ATLAS_CELL_SIZE = 64

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
		// l'immagine è normalizzata: dimensione 1px
		immagini.push(new Immagine(item.FileName, w/ATLAS_CELL_SIZE, h/ATLAS_CELL_SIZE, u1, v1, u2, v2))
	})

	ordina('box')
}


function mouseWheel(event) {

    // dzoom += event.deltaY * 0.01
    // dzoom = Math.min(Math.max(0.05, dzoom), 10)

}

function keyPressed() {
	if (key == '1') {
		ordina('griglia')
	} else if (key == '2') {
		ordina('random')
	} else if (key == '3') {
		ordina('box')
	} else if (key == '4') {
		ordina('cilindro')
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function ordina(modo) {

	if (modo == 'griglia') {

		const cella = 1
		const cols = Math.ceil(Math.sqrt(immagini.length))
		const offs = - cols * cella / 2

		immagini.forEach((immagine, i) => {
			const col = i % cols
			const row = Math.floor(i / cols)
			const x = col * cella + offs
			const y = row * cella + offs
			const z = 0
			immagine.dpos.x = x
			immagine.dpos.y = y
			immagine.dpos.z = z
			immagine.drot.x = 0
			immagine.drot.y = 0
			immagine.drot.z = 0
		})
	} else if (modo == 'random') {

		const TAU = Math.PI * 2

		immagini.forEach((immagine, i) => {
			const r = Math.pow(Math.random(), 0.5) * 30
			const theta = Math.random() * TAU
			const phi = Math.random() * TAU
			const x = r * cos(theta) * sin(phi)
			const y = r * sin(theta) * sin(phi)
			const z = r * cos(phi)

			immagine.drot.x = Math.random() * TAU
			immagine.drot.y = Math.random() * TAU
			immagine.drot.z = Math.random() * TAU
			immagine.dpos.x = x
			immagine.dpos.y = y
			immagine.dpos.z = z

		})
	} else if (modo == 'box') {
		const cella = 1.5
		const cols = Math.ceil(Math.cbrt(immagini.length))
		const offs = - (cols-1) * cella / 2

		immagini.forEach((immagine, i) => {
			const x = (i % cols % cols) * cella + offs
			const y = Math.floor(i / cols % cols) * cella + offs
			const z = Math.floor(i / cols / cols) * cella + offs
			immagine.drot.x = 0
			immagine.drot.y = 0
			immagine.drot.z = 0
			immagine.dpos.x = x
			immagine.dpos.y = y
			immagine.dpos.z = z
		})
	} else if (modo == 'cilindro') {

		const cella = 1.25
		const raggio = Math.ceil(Math.cbrt(immagini.length))
		const cols = raggio * TAU
		const numRows = Math.ceil(immagini.length / cols)
		const offs = - (numRows - 1) / 2



		immagini.forEach((immagine, i) => {
			const row = Math.floor(i / cols)
			const rotY = Math.floor(i % cols) / cols * TAU
			const x = raggio * sin(rotY) * cella
			const y = (row + offs) * cella
			const z = raggio * cos(rotY) * cella
			immagine.drot.x = 0
			immagine.drot.y = rotY
			immagine.drot.z = 0
			immagine.dpos.x = x
			immagine.dpos.y = y
			immagine.dpos.z = z
		})
	}
}

function draw() {

	// zoom += (dzoom - zoom) * 0.1

	background(0)

	const distanza = map(mouseY, 0, height, 10, 100)
	const rotazione = map(mouseX, 0, width, -PI, PI)



	const pos = { x: distanza * cos(rotazione), y: 0, z: distanza * sin(rotazione) }
	const eye = { x: 0, y: 0, z: 0 }
	const up = { x: 0, y: 1, z: 0 }
	camera(pos.x, pos.y, pos.z, eye.x, eye.y, eye.z, up.x, up.y, up.z)

	const fovy = 2 * atan(height / 2 / 800)
	const aspect = width / height
	const near = 0.01
	const far = 1000
	perspective(fovy, aspect, near, far)

	beginShape(QUADS)

	noStroke()
	textureMode(NORMAL)
	texture(atlas)

	const damp = 0.1

	immagini.forEach(immagine => {
		immagine.rot.x += (immagine.drot.x - immagine.rot.x) * damp
		immagine.rot.y += (immagine.drot.y - immagine.rot.y) * damp
		immagine.rot.z += (immagine.drot.z - immagine.rot.z) * damp
		immagine.pos.x += (immagine.dpos.x - immagine.pos.x) * damp
		immagine.pos.y += (immagine.dpos.y - immagine.pos.y) * damp
		immagine.pos.z += (immagine.dpos.z - immagine.pos.z) * damp
		if (mouseIsPressed) {
			immagine.lookAt(pos.x, pos.y, pos.z)
		}
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

		// posizione e rotazione
		this.pos = { x: 0, y: 0, z: 0 }
		this.dpos = { x: 0, y: 0, z: 0 }
		this.rot = { x: 0, y: 0, z: 0 }
		this.drot = { x: 0, y: 0, z: 0 }
	}
	emettiVertici() {
		vertex(this.pos.x - this.w2, this.pos.y - this.h2, this.pos.z, this.u1, this.v1)
		vertex(this.pos.x + this.w2, this.pos.y - this.h2, this.pos.z, this.u2, this.v1)
		vertex(this.pos.x + this.w2, this.pos.y + this.h2, this.pos.z, this.u2, this.v2)
		vertex(this.pos.x - this.w2, this.pos.y + this.h2, this.pos.z, this.u1, this.v2)
	}

	// Matrice di rotazione combinata (ordine: Z, Y, X)
	rotX(x, y, z){
		const cx = Math.cos(this.rot.x)
		const sx = Math.sin(this.rot.x)
		const y1 = y * cx - z * sx
		const z1 = y * sx + z * cx
		return { x, y: y1, z: z1 }
	}

	rotY(x, y, z){
		const cy = Math.cos(this.rot.y)
		const sy = Math.sin(this.rot.y)
		const x1 = x * cy + z * sy
		const z1 = -x * sy + z * cy
		return { x: x1, y, z: z1 }
	}

	rotZ(x, y, z){
		const cz = Math.cos(this.rot.z)
		const sz = Math.sin(this.rot.z)
		const x1 = x * cz - y * sz
		const y1 = x * sz + y * cz
		return { x: x1, y: y1, z }
	}

	lookAt(x, y, z) {
		const dx = x - this.pos.x
		const dy = y - this.pos.y
		const dz = z - this.pos.z

		// Calculate rotation around Y axis (horizontal)
		this.drot.y = Math.atan2(dx, dz)

		// Calculate rotation around X axis (vertical)
		const dist = Math.sqrt(dx * dx + dz * dz)
		this.drot.x = -Math.atan2(dy, dist)

		// No rotation around Z axis
		this.drot.z = 0
	}

	emettiVerticiRuotati() {

		// Vertici originali relativi al centro
		const vertici = [
			{ x: -this.w2, y: -this.h2, z: 0 },
			{ x: this.w2, y: -this.h2, z: 0 },
			{ x: this.w2, y: this.h2, z: 0 },
			{ x: -this.w2, y: this.h2, z: 0 }
		]

		// Applica le rotazioni e trasla
		const ruotati = vertici.map(v => {
			let r = this.rotZ(v.x, v.y, v.z)
			r = this.rotY(r.x, r.y, r.z)
			r = this.rotX(r.x, r.y, r.z)
			return {
				x: r.x + this.pos.x,
				y: r.y + this.pos.y,
				z: r.z + this.pos.z
			}
		})

		// Emetti i vertici ruotati
		vertex(ruotati[0].x, ruotati[0].y, ruotati[0].z, this.u1, this.v1)
		vertex(ruotati[1].x, ruotati[1].y, ruotati[1].z, this.u2, this.v1)
		vertex(ruotati[2].x, ruotati[2].y, ruotati[2].z, this.u2, this.v2)
		vertex(ruotati[3].x, ruotati[3].y, ruotati[3].z, this.u1, this.v2)
	}
}