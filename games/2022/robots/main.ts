const scoreElement = document.getElementById("score")
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

	x: number
	changeX: number
	y: number

	dir: string
	maxX: number

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

		this.maxX = canvas.width - this.images[dir][0].width

		// Start on the left/right side based on direction
		this.x = dir == "right" ? 0 : this.maxX
	}

	move() {
		this.x += this.changeX

		// Flip direction when hitting the game border
		if (this.x > this.maxX) {
			this.x = this.maxX
			this.dir = "left"
			this.changeX = -1 * Math.round(RNG(1000, 1000 + game.score) / 1000)
		}
		else if (this.x < 0) {
			this.x = 0
			this.dir = "right"
			this.changeX = Math.round(RNG(1000, 1000 + game.score) / 1000)
		}
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

let pressed = {
	left : false,
	right: false,
	down : false,
	up   : false,
	shift: false
}
document.onkeydown = e => {
	if (e.code == "ArrowRight") pressed.right = true
	if (e.code == "ArrowLeft" ) pressed.left = true
	if (e.code == "ArrowUp"   ) pressed.up = true
	if (e.code == "ArrowDown" ) pressed.down = true
	if (e.code == "ShiftLeft" ) pressed.shift = true
}
document.onkeyup = e => {
	if (e.code == "ArrowRight") pressed.right = false
	if (e.code == "ArrowLeft" ) pressed.left = false
	if (e.code == "ArrowUp"   ) pressed.up = false
	if (e.code == "ArrowDown" ) pressed.down = false
	if (e.code == "ShiftLeft" ) pressed.shift = false
}

const player = {
	length: 50,
	border: 5,

	x: canvas.width / 2 - length / 2,
	y: canvas.height / 2 - length / 2,

	// Check if the player overlaps a robot (fail)
	overlap(robot: Robot) {
		// "left" is arbitrary, both sizes are the same
		let img = robot.images.left[robot.costume]

		return (robot.x > this.x - img.width &&
			robot.x < this.x + this.length &&
			robot.y > this.y - img.height &&
			robot.y < this.y + this.length)
	},

	move() {
		if (pressed.right) this.x += 5
		if (pressed.left) this.x -= 5
		if (pressed.down) this.y += 5
		if (pressed.up) this.y -= 5

		// Enclose borders
		let maxX = canvas.width - this.length
		let maxY = canvas.height - this.length

		if (this.x > maxX) this.x = maxX
		if (this.x < 0) this.x = 0
		if (this.y > maxY) this.y = maxY
		if (this.y < 0) this.y = 0
	},

	draw() {
		let length = this.length - this.border

		ctx.beginPath()
		ctx.rect(this.x, this.y, length, length)
		ctx.fill()
		ctx.stroke()
	}
}
ctx.fillStyle = "white"
ctx.strokeStyle = "#395EA7"
ctx.lineWidth = player.border

function step() {
	background.draw()

	player.move()
	player.draw()

	for (const robot of robots) {
		robot.move()
		robot.draw()
	}

	// Separate loop to esnure all robots are drawn before terminating
	for (const robot of robots) {
		// The function ends and has no chance to cal requestAnimationFrame() again
		if (player.overlap(robot)) return
	}

	game.score++
	scoreElement.innerHTML = game.score.toString()

	window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
