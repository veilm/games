const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

let tick = new Date().getTime()

const squareLength = 50

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
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

class Falling extends Drawing {
	cy : number
	ccy: number
	cx : number

	constructor(id: string, cy: number, ccy: number, cx: number) {
		let x = RNG(0, background.img.width - squareLength)

		super(id, x, -1 * squareLength)

		this.cy = cy
		this.ccy = ccy

		this.cx = cx * (x > player.x ? -1 : 1)
	}

	move() {
		this.y += this.cy
		this.cy += this.ccy

		this.x += this.cx
	}
}

class Star extends Falling {
	constructor() {
		super("star", 1, RNG(1, 5) / 100, 0)
	}
}

class Enemy extends Falling {
	constructor() {
		super("enemy", RNG(50, 500) / 100, RNG(0, 3) / 100, RNG(0, 75) / 100)
	}
}

class Player extends Drawing {
	constructor() {
		super("player",
			background.img.width / 2 - squareLength / 2,
			background.img.height - squareLength * 2)
	}

	overlaps(entity: Falling) {
		return (
			this.x > entity.x - squareLength &&
			this.x < entity.x + squareLength &&
			this.y > entity.y - squareLength &&
			this.y < entity.y + squareLength
		)
	}

	move() {
		let speed = pressed.shift ? 3 : 6

		if (pressed.left ) this.x -= speed
		if (pressed.right) this.x += speed
		if (pressed.up   ) this.y -= speed
		if (pressed.down ) this.y += speed
	}

	// Stop player from moving past walls
	walls() {
		let xMax = background.img.width - squareLength
		let yMax = background.img.height - squareLength

		if (this.x > xMax) this.x = xMax
		if (this.x < 0) this.x = 0

		if (this.y > yMax) this.y = yMax
		if (this.y < 0) this.y = 0
	}

	collision() {
		if (this.overlaps(star)) {
			star = new Star()

			values.score += 200
			values.lives++
		}

		for (let i = 0; i < enemies.length; i++) {
			if (this.overlaps(enemies[i])) {
				enemies.splice(i, 1)
				values.lives--

				if (values.lives < 1) values.status = "off"
			}
		}
	}
}

const background = new Drawing("background", 0, 0)

let player = new Player()

let star = new Star()
let enemies = []

const drawText = (x: number, text: string) => {
	ctx.fillText(text, x, background.img.height - 20)
}
ctx.font = "20px monospace"
ctx.fillStyle = "white"

let values = {
	lives: 5,
	score: 1,
	enemySpawn: 750,
	status: "on"
}

class Game {
	draw() {
		player.move()
		player.walls()

		star.move()

		// Move enemies but delete them if they leave the screen If we don't
		// delete them, trying to render / move them will continue to take
		// resources.
		for (let i = 0; i < enemies.length; i++) {
			enemies[i].move()

			if (enemies[i].y > background.img.height) enemies.splice(i, 1)
		}

		player.collision()

		// Periodically spawn a new enemy
		let cur = new Date().getTime()
		if (cur - tick > values.enemySpawn) {
			enemies.push(new Enemy())
			tick = cur

			values.enemySpawn -= 1
		}

		background.draw()
		player.draw()
		star.draw()

		for (const enemy of enemies) {
			enemy.draw()
		}

		values.score++
		drawText(50, `Score ${values.score} | Lives ${values.lives} | Spawn Interval ${values.enemySpawn}`)

		if (values.status == "on") window.requestAnimationFrame(game.draw)
	}
}

let game = new Game()

window.requestAnimationFrame(game.draw)
