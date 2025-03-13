let posizioneX, posizioneY

function setup() {
	createCanvas(300, 300)
	background(200)
	posizioneX = width / 2
	posizioneY = height / 2
}

function draw() {

	ellipse(posizioneX, posizioneY, 30, 30)

	posizioneX = posizioneX + random(-2, 2)
	posizioneY = posizioneY + random(-2, 2)

	if (posizioneX < 0) {
		posizioneX = width + posizioneX
	} else if (posizioneX >= width) {
		posizioneX = width - posizioneX
	}

	if (posizioneY < 0) {
		posizioneY = height + posizioneY
	} else if (posizioneY >= height) {
		posizioneY = height - posizioneY
	}
}

