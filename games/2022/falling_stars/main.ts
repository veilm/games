const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

let pressed = {
	left: false,
	right: false,
	down: false,
	up: false
}
document.onkeydown = e => {
	if (e.code == "ArrowRight") pressed.right = true
	if (e.code == "ArrowLeft") pressed.left = true
	if (e.code == "ArrowUp") pressed.up = true
	if (e.code == "ArrowDown") pressed.down = true
}
document.onkeyup = e => {
	if (e.code == "ArrowRight") pressed.right = false
	if (e.code == "ArrowLeft") pressed.left = false
	if (e.code == "ArrowUp") pressed.up = false
	if (e.code == "ArrowDown") pressed.down = false
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
		if (pressed.left) this.x -= 3
		if (pressed.right) this.x += 3
		if (pressed.up) this.y -= 3
		if (pressed.down) this.y += 3
	}
}

const background = new Drawing("background", 0, 0)
const player = new Player("player", 50, 50)
const star = new Drawing("star", 200, 200)
const enemy = new Drawing("enemy", 300, 300)

class Game {
	draw() {
		player.move()

		background.draw()
		player.draw()
		star.draw()
		enemy.draw()
	}

}

let game = new Game()

setInterval(game.draw, 1)
