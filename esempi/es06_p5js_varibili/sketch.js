
function setup() {
	createCanvas(300, 200)
	background(200)
}

function draw() {
	fill(mouseX, mouseY, 0)
	ellipse(mouseX, mouseY, 30, 30)
	ellipse(300 - mouseX, mouseY, 30, 30)
}

function keyPressed() {
	background(random(256), random(256), random(256) )
}
