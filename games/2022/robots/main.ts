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

	constructor(id) {
		this.switchThreshold = RNG(350, 1000)
		this.lastSwitch = new Date().getTime()

		this.img = [
			document.getElementById(id + "1") as HTMLImageElement,
			document.getElementById(id + "2") as HTMLImageElement
		]
	}

	draw() {
		if (new Date().getTime() - this.lastSwitch >= this.switchThreshold) {
			this.costume = 1 - this.costume
			this.lastSwitch = new Date().getTime()
		}

		ctx.drawImage(this.img[this.costume], 0, 0)
	}
}

const robot_blue = new Robot("robot_blue")

const background = {
	img: document.getElementById("background") as HTMLImageElement,
	draw: function() {
		ctx.drawImage(this.img, 0, 0)
	}
}

function step() {
	background.draw()
	robot_blue.draw()

	window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
