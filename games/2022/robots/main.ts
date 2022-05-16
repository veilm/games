const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

class Robot {
	img: HTMLImageElement[]

	switchThreshold: number
	lastSwitch: number
	costume = 0

	constructor(colour: string) {
		this.switchThreshold = RNG(350, 1000)
		this.lastSwitch = new Date().getTime()

		this.img = [
			document.getElementById(`robot_${colour}1`) as HTMLImageElement,
			document.getElementById(`robot_${colour}2`) as HTMLImageElement
		]
	}

	draw() {
		// Switch robot animation frame every (switchThreshold) ms
		if (new Date().getTime() - this.lastSwitch >= this.switchThreshold) {
			this.costume = 1 - this.costume
			this.lastSwitch = new Date().getTime()
		}

		ctx.drawImage(this.img[this.costume], 0, 0)
	}
}

let robots = []
const colours = ["red", "green", "blue", "yellow"]
for (const colour of colours) {
	robots.push(new Robot(colour))
}

const background = {
	img: document.getElementById("background") as HTMLImageElement,
	draw: function() {
		ctx.drawImage(this.img, 0, 0)
	}
}

function step() {
	background.draw()

	for (const robot of robots) {
		robot.draw()
	}

	window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
