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
	"speed": 1.10,

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

	ball.draw()
	paddle.draw()
}, 10)
