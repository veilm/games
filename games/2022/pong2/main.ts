const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

let game = {
	marginY: 10,
	status: "on",

	width: canvas.width,
	height: canvas.height,

	score: 0,
	highScore: 0,
	speed: 1.0,

	// Update HTML text elements to display values
	updateText() {
		let elements = ["score", "highScore", "speed"]
		for (const element of elements) {
			document.getElementById(element).innerHTML = this[element]
		}
	},

	// The player hit the ball, so the progress increases
	increment() {
		this.score++
		if (this.score > this.highScore && game.status != "speedPractice")
			this.highScore = this.score

		this.speed += 0.05
		this.speed = Math.round(this.speed * 100) / 100

		this.updateText()
	},

	newRound(speed: number) {
		// This is an ugly DRY violation but I'm not sure how to fix it while
		// keeping TypeScript happy

		this.status = speed == 1 ? "on" : "speedPractice"

		this.score = (speed - 1) / 0.05
		this.speed = speed

		ball.x = this.width / 2 - ballImg.img.width
		ball.y = this.marginY
		ball.dirX = 1
		ball.dirY = 1

		this.updateText()
	}
}
game.updateText()

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
	img: document.getElementById("background") as HTMLImageElement,
	draw() {
		ctx.drawImage(this.img, 0, 0)
	}
}

let ballImg = {
	img: document.getElementById("ball") as HTMLImageElement,
	draw() {
		ctx.drawImage(this.img, ball.x, ball.y)
	}
}

let ball = {
	x: game.width / 2 - ballImg.img.width,
	y: game.marginY,

	dirX: 1,
	dirY: 1,

	// Check for collision with the borders or the paddle
	collision() {
		let max = game.width - ballImg.img.width

		if (this.x > max) {
			this.x = max
			this.dirX = -1
		}

		if (this.x < 0) {
			this.x = 0
			this.dirX = 1
		}

		if (this.y < 0) {
			this.y = 0
			this.dirY = 1
		}

		// Touches paddle
		if (this.y > paddle.y - ballImg.img.height &&
			this.x > paddle.x - ballImg.img.width &&
			this.x < paddle.x + paddleImg.img.width) {

			this.dirY = -1
			this.y = paddle.y - ballImg.img.height

			game.increment()
		}

		if (this.y > game.height - ballImg.img.height) {
			game.status = "off"
			return
		}
	},

	move() {
		this.x += this.dirX * game.speed
		this.y += this.dirY * game.speed

		this.collision()
	}
}

let paddleImg = {
	img: document.getElementById("paddle") as HTMLImageElement,
	draw() {
		ctx.drawImage(this.img, paddle.x, paddle.y)
	}
}

let paddle = {
	x: game.width / 2 - paddleImg.img.width / 2,
	y: game.height - paddleImg.img.height - game.marginY,

	// Keep the paddle from going outside of the borders
	constraints() {
		let max = game.width - paddleImg.img.width

		if (this.x > max) this.x = max
		if (this.x < 0) this.x = 0
	},

	move() {
		if (pressed.right) this.x += 10
		if (pressed.left) this.x -= 10

		this.constraints()
	}
}

document.getElementById("newRound").onclick = () => {
	game.newRound(1)
}

// The user presses the practice button to start a session
document.getElementById("speedSubmit").onclick = () => {
	const speedInput = document.getElementById("speedInput") as HTMLInputElement
	let speed = parseInt(speedInput.value)

	if (isNaN(speed)) return

	game.newRound(speed)
}

setInterval(() => {
	if (game.status == "off") return

	backgroundImg.draw()

	paddle.move()
	paddleImg.draw()

	ball.move()
	ballImg.draw()
}, 10)
