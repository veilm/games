const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

const background = document.getElementById("background") as HTMLImageElement
const ball = document.getElementById("ball") as HTMLImageElement
const paddle = document.getElementById("paddle") as HTMLImageElement

setInterval(() => {
	ctx.drawImage(background, 0, 0)
	ctx.drawImage(ball, 50, 50)
	ctx.drawImage(paddle, 50, 150)

}, 10)
