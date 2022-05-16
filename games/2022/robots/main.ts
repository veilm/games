const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

let game = {
	score: 0
}

class Robot {
	img: HTMLImageElement[]

	switchThreshold: number
	lastSwitch: number
	costume = 0

	x = 0
	changeX: number
	y: number

	constructor(colour: string, y: number) {
		this.switchThreshold = RNG(350, 1000)
		this.lastSwitch = new Date().getTime()

		this.changeX = 1
		this.y = y

		this.img = [
			document.getElementById(`robot_${colour}1`) as HTMLImageElement,
			document.getElementById(`robot_${colour}2`) as HTMLImageElement
		]
	}

	move() {
		this.x += this.changeX
	}

	draw() {
		// Switch robot animation frame every (switchThreshold) ms
		if (new Date().getTime() - this.lastSwitch >= this.switchThreshold) {
			this.costume = 1 - this.costume
			this.lastSwitch = new Date().getTime()
		}

		ctx.drawImage(this.img[this.costume], this.x, this.y)
	}
}

let robots = []
const colours = ["red", "green", "blue", "yellow"]
for (let i = 0; i < colours.length; i++) {
	// The green one is shorter, so let's center it
	let y = i == 1 ? 165 : i * 150

	robots.push(new Robot(colours[i], y))
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
		robot.move()
		robot.draw()
	}

	window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
