const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const gameWidth = canvas.width
const gameHeight = canvas.height

let background = {
	"img": document.getElementById("background") as HTMLImageElement,
	draw: () => {ctx.drawImage(background.img, 0, 0)}
}

let ball = {
	"x": canvas.width / 2 - 25,
	"y": 10,

	"img": document.getElementById("ball") as HTMLImageElement,

	"dirX": 1,
	"dirY": 1,
	"speed": 1.10,

	collision: () => {
		if (ball.x > gameWidth - 50) {
			ball.x = gameWidth - 50
			ball.dirX *= -1
		}

		if (ball.x < 0) {
			ball.x = 0
			ball.dirX *= -1
		}
	},

	move: () => {
		ball.x += ball.dirX * ball.speed
		ball.y += ball.dirY * ball.speed

		ball.collision()
	},

	draw: () => {ctx.drawImage(ball.img, ball.x, ball.y)}
}

let paddle = {
	"x": canvas.width / 2 - 50,
	"y": 330,
	"img": document.getElementById("paddle") as HTMLImageElement,

	draw: () => {ctx.drawImage(paddle.img, paddle.x, paddle.y)}
}

setInterval(() => {
	background.draw()

	ball.move()
	ball.draw()

	paddle.draw()
}, 10)
