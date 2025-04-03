
const colors = []

function hex2rgb(hex) {
	return {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16),
	}
}

async function preload() {
	const dati = await fetch('./data_colors_9.json').then(res => res.json())

	for (let i = 0; i < dati.length; i++) {
		for (let j = 0; j < dati[i].Colors.length; j++) {
			const colore = dati[i].Colors[j]
			const rgb = hex2rgb(colore)
			colors.push(rgb)
		}
	}
}


function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	background(0);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0);

	rotateY(mouseX * 0.01)
	const s = map(mouseY, 0, height, 3, 0.5)
	scale(s, -s, s)
	translate(-128, -128, -128)

	// Draw all points
	stroke(255)
	strokeWeight(2)
	line(0, 0, 0, 255, 0, 0)
	line(0, 0, 0, 0, 255, 0)
	line(0, 0, 0, 0, 0, 255)

	strokeWeight(4)
	beginShape(POINTS)
	for (let p of colors) {
		stroke(p.r, p.g, p.b)
		point(p.r, p.g, p.b)
	}
	endShape()
}

