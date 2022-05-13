const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

let pressed = {
	left: false,
	right: false,
	down: false,
	up: false,

	shift: false
}
document.onkeydown = e => {
	if (e.code == "ArrowRight") pressed.right = true
	if (e.code == "ArrowLeft") pressed.left = true
	if (e.code == "ArrowUp") pressed.up = true
	if (e.code == "ArrowDown") pressed.down = true

	if (e.code == "ShiftLeft") pressed.shift = true
}
document.onkeyup = e => {
	if (e.code == "ArrowRight") pressed.right = false
	if (e.code == "ArrowLeft") pressed.left = false
	if (e.code == "ArrowUp") pressed.up = false
	if (e.code == "ArrowDown") pressed.down = false

	if (e.code == "ShiftLeft") pressed.shift = false
}

class Drawing {
	img: HTMLImageElement
	x: number
	y: number

	constructor(id: string, x: number, y: number) {
		this.x = x
		this.y = y

		this.img = document.getElementById(id) as HTMLImageElement
	}

	draw() {
		ctx.drawImage(this.img, this.x, this.y)
	}
}

class Player extends Drawing {
	constructor(id: string, x: number, y: number) {
		super(id, x, y)
	}

	move() {
		let speed = pressed.shift ? 3 : 6

		if (pressed.left) this.x -= speed
		if (pressed.right) this.x += speed
		if (pressed.up) this.y -= speed
		if (pressed.down) this.y += speed
	}

	walls() {
		let xMax = background.img.width - this.img.width
		let yMax = background.img.height - this.img.height

		if (this.x > xMax) this.x = xMax
		if (this.x < 0) this.x = 0

		if (this.y > yMax) this.y = yMax
		if (this.y < 0) this.y = 0
	}
}

const background = new Drawing("background", 0, 0)
const player = new Player("player", 50, 50)
const star = new Drawing("star", 200, 200)
const enemy = new Drawing("enemy", 300, 300)

class Game {
	draw() {
		player.move()
		player.walls()

		background.draw()
		player.draw()
		star.draw()
		enemy.draw()

		window.requestAnimationFrame(game.draw)
	}
}

let game = new Game()

window.requestAnimationFrame(game.draw)
