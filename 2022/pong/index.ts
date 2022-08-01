const canvas = document.getElementById("canvas") as HTMLCanvasElemeent
const ctx = canvas.getContext("2d")

const game = {
	right_pressed: false,
	left_pressed: false,

	state: "dead",
	locked: false,

	draw: function() {
		draw_rect(300, 200, 600, 400, "#303030")
		if (this.state == "predict") draw_rect(300, 150, 600, 5, "#444")

		draw_rect(ball.x, ball.y, 10, 10, "#fff")
		draw_rect(paddle.x, 350, 100, 2, "#2c8898")
	},

	reset: function() {
		this.locked = false
		paddle.x = 300

		ball.x = 300
		ball.y = 10
		ball.vel_x = 1
		ball.vel_y = 0.5
	}
}

const paddle = {
	x: 300,

	move_right: function() {
		this.x += 5
		if (this.x > 550) this.x = 550
	},
	move_left: function() {
		this.x -= 5
		if (this.x < 50) this.x = 50
	}
}

const ball = {
	x: 300,
	y: 10,

	vel_x: 1,
	vel_y: 0.5,

	move: function() {
		this.x += this.vel_x
		this.y += this.vel_y

		if (this.x > 595) {
			this.x = 595
			this.vel_x *= -1
		}
		if (this.x < 5) {
			this.x = 5
			this.vel_x *= -1
		}
		if (this.y < 5) {
			this.y = 5
			this.vel_y *= -1
		}
	},

	collide: function() {
		if (this.y == 345 && this.x < paddle.x + 55 && this.x > paddle.x - 55) {
			this.vel_y *= -1
			game.locked = false
		}

		if (this.y > 395) game.state = "dead"
	},

	lock: function() {
		if (this.y == 150 && this.vel_y == -0.5) game.locked = true
	}
}

// Takes the center point, not the top left
function draw_rect(x: number, y: number, width: number, height: number, colour: string) {
	ctx.beginPath()
	ctx.rect(x-(width/2), y-(height/2), width, height)
	ctx.fillStyle = colour
	ctx.fill()
	ctx.closePath()
}

document.onkeyup = (e) => {
	if (e.keyCode == 39) game.right_pressed = false
	else if (e.keyCode == 37) game.left_pressed = false
}
document.onkeydown = (e) => {
	if (e.keyCode == 39) game.right_pressed = true
	else if (e.keyCode == 37) game.left_pressed = true
}

document.getElementById("normal").onclick = () => {
	game.state = "normal"
	game.reset()
}

document.getElementById("predict").onclick = () => {
	game.state = "predict"
	game.reset()
}

const interval = setInterval(() => {
	if (game.state == "dead") {
		game.draw()
		return
	}

	if (game.state == "predict") ball.lock()

	if (game.locked == false) {
		if (game.right_pressed) paddle.move_right()
		if (game.left_pressed) paddle.move_left()
	}

	ball.move()
	ball.collide()

	game.draw()
}, 10)
