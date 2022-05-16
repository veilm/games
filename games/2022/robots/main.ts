const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

class Robot {
	img: HTMLImageElement[]

	constructor(id) {
		this.img = [
			document.getElementById(id + "1") as HTMLImageElement,
			document.getElementById(id + "2") as HTMLImageElement
		]
	}

	draw() {
		ctx.drawImage(this.img[0], 0, 0)
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
