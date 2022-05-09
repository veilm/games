const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

let marginY = 10

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
	"x": canvas.width / 2 - ballImg.img.width,
	"y": marginY,

	"dirX": 1,
	"dirY": 1,
	"speed": 1.10,

	collision: function() {
		let max = canvas.width - ballImg.img.width

		if (this.x > max) {
			this.x = max
			this.dirX *= -1
		}

		if (this.x < 0) {
			this.x = 0
			this.dirX *= -1
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
	"x": canvas.width / 2 - paddleImg.img.width / 2,
	"y": canvas.height - paddleImg.img.height - marginY,

	constraints: function() {
		let max = canvas.width - paddleImg.img.width

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
	backgroundImg.draw()

	ball.move()
	ballImg.draw()

	paddle.move()
	paddleImg.draw()
}, 10)
