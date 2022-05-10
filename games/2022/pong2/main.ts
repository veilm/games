const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

let game = {
	"marginY": 10,
	"status": "on",
	"width": canvas.width,
	"height": canvas.height
}

let pressed = {
	left: false,
	right: false
}
document.onkeydown = e => {
	if (e.code == "ArrowRight") pressed.right = true
	if (e.code == "ArrowLeft") pressed.left = true
}
document.onkeyup = e => {
	if (e.code == "ArrowRight") pressed.right = false
	if (e.code == "ArrowLeft") pressed.left = false
}

let backgroundImg = {
	"img": document.getElementById("background") as HTMLImageElement,
	draw: function() {
		ctx.drawImage(this.img, 0, 0)
	}
}

let ballImg = {
	"img": document.getElementById("ball") as HTMLImageElement,
	draw: function() {
		ctx.drawImage(this.img, ball.x, ball.y)
	}
}

let ball = {
	"x": game.width / 2 - ballImg.img.width,
	"y": game.marginY,

	"dirX": 1,
	"dirY": 1,
	"speed": 1.10,

	collision: function() {
		let max = game.width - ballImg.img.width

		if (this.x > max) {
			this.x = max
			this.dirX = -1
		}

		if (this.x < 0) {
			this.x = 0
			this.dirX = 1
		}

		if (this.y > game.height - ballImg.img.height) {
			game.status = "off"
			return
		}

		// Drops to paddle level
		if (this.y > paddle.y - ballImg.img.height) {

			// Touches paddle
			if (this.x > paddle.x - ballImg.img.width &&
				this.x < paddle.x + ballImg.img.width) {

				this.dirY = -1
				this.y = paddle.y - ballImg.img.height
			}
		}
	},

	move: function() {
		this.x += this.dirX * this.speed
		this.y += this.dirY * this.speed

		this.collision()
	}
}

let paddleImg = {
	"img": document.getElementById("paddle") as HTMLImageElement,
	draw: function() {
		ctx.drawImage(this.img, paddle.x, paddle.y)
	}
}

let paddle = {
	"x": game.width / 2 - paddleImg.img.width / 2,
	"y": game.height - paddleImg.img.height - game.marginY,

	constraints: function() {
		let max = game.width - paddleImg.img.width

		if (this.x > max) this.x = max
		if (this.x < 0) this.x = 0
	},

	move: function() {
		if (pressed.right) this.x += 10
		if (pressed.left) this.x -= 10

		this.constraints()
	}
}

setInterval(() => {
	if (game.status == "off") return

	backgroundImg.draw()

	ball.move()
	ballImg.draw()

	paddle.move()
	paddleImg.draw()
}, 10)
