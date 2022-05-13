const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

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

const background = new Drawing("background", 0, 0)
const player = new Drawing("player", 50, 50)
const star = new Drawing("star", 200, 200)
const enemy = new Drawing("enemy", 300, 300)

class Game {
	draw() {
		background.draw()
		player.draw()
		star.draw()
		enemy.draw()
	}
}

let game = new Game()

setInterval(game.draw, 1)
