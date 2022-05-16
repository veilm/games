const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

let game = {
	score: 0
}

class Robot {
	images: {
		left: HTMLImageElement[]
		right: HTMLImageElement[]
	}

	switchThreshold: number
	lastSwitch: number
	costume = 0

	x = 600
	changeX: number
	y: number

	dir: string

	constructor(colour: string, y: number, dir: string) {
		this.switchThreshold = RNG(350, 1000)
		this.lastSwitch = new Date().getTime()

		this.dir = dir
		this.changeX = dir == "right" ? 1 : -1

		this.y = y


		this.images = {
			left: [
				document.getElementById(`robot_${colour}_l1`) as HTMLImageElement,
				document.getElementById(`robot_${colour}_l2`) as HTMLImageElement
			],
			right: [
				document.getElementById(`robot_${colour}_r1`) as HTMLImageElement,
				document.getElementById(`robot_${colour}_r2`) as HTMLImageElement
			]
		}
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

		let img = this.images[this.dir][this.costume]
		ctx.drawImage(img, this.x, this.y)
	}
}

let robots = []
const colours = ["red", "green", "blue", "yellow"]
for (let i = 0; i < colours.length; i++) {
	// The green one is shorter, so let's center it
	let y = i == 1 ? 165 : i * 150

	// Alternate direction
	let dir = i % 2 == 0 ? "right" : "left"

	robots.push(new Robot(colours[i], y, dir))
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
