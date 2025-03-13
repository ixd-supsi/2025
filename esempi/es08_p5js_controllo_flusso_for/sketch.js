
function setup() {
	createCanvas(300, 300)
	background(200)
}

function draw() {

	noStroke()
	fill(0)

	/*
	i = i + 1
	i += 1
	i++
	*/

	for(let i=0; i<100; i++) {
		ellipse(random(width), random(height), 3, 3)
	}

	fill(255)
	const diam = random(10, 80)
	ellipse(random(width), random(height), diam, diam)

}

