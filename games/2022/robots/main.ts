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

/*
const background = document.getElementById("background") as HTMLImageElement
const robot_blue1 = document.getElementById("robot_blue1") as HTMLImageElement
const robot_blue2 = document.getElementById("robot_blue2") as HTMLImageElement
const robot_green1 = document.getElementById("robot_green1") as HTMLImageElement
const robot_green2 = document.getElementById("robot_green2") as HTMLImageElement
const robot_red1 = document.getElementById("robot_red1") as HTMLImageElement
const robot_red2 = document.getElementById("robot_red2") as HTMLImageElement
const robot_yellow1 = document.getElementById("robot_yellow1") as HTMLImageElement
const robot_yellow2 = document.getElementById("robot_yellow2") as HTMLImageElement

ctx.drawImage(background, 0, 0)
ctx.drawImage(robot_blue1, 0, 0)
ctx.drawImage(robot_blue2, 0, 0)
ctx.drawImage(robot_green1, 0, 0)
ctx.drawImage(robot_green2, 0, 0)
ctx.drawImage(robot_red1, 0, 0)
ctx.drawImage(robot_red2, 0, 0)
ctx.drawImage(robot_yellow1, 0, 0)
ctx.drawImage(robot_yellow2, 0, 0)
*/

let robot_blue = new Robot("robot_blue")
robot_blue.draw()
