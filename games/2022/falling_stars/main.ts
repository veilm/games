const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

class Img {
	img: HTMLImageElement

	constructor(id: string) {
		this.img = document.getElementById(id) as HTMLImageElement
	}
}

const backgroundImg = new Img("background")
const playerImg = new Img("player")
const starImg = new Img("star")
const enemyImg = new Img("enemy")

class Game {
	draw() {
		ctx.drawImage(backgroundImg.img, 0, 0)
		ctx.drawImage(playerImg.img, 50, 50)
		ctx.drawImage(starImg.img, 200, 200)
		ctx.drawImage(enemyImg.img, 300, 300)
	}
}

let game = new Game()

setInterval(game.draw, 1)
