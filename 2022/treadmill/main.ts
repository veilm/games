const getId = id => document.getElementById(id)

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

const operations = {
	multiplication(a, b) {
		return `${a} × ${b}`
	},

	addition(a, b) {
		return `${a} + ${b}`
	}
}

const configs = [
	{
		name: "Multiplication 10-20",
		secs: 45,

		operation() {
			let min = 10
			let max = 20
			return operations.multiplication(RNG(min, max), RNG(min, max))
		}
	},
	{
		name: "Multiplication 1d by 2d",
		secs: 10,

		operation() {
			let a = RNG(2, 9)
			let b = RNG(10, 99)
			if (RNG(1, 100) % 2 == 0)
				return operations.multiplication(a, b)
			else
				return operations.multiplication(b, a)
		}
	},
	{
		name: "Addition 100-500",
		secs: 20,

		operation() {
			let min = 100
			let max = 500
			return operations.addition(RNG(min, max), RNG(min, max))
		}
	}
]

const game = {
	config: configs[0],
	lastSave: 0,
	state: "question",
	answer: 5,

	resetTimer() {
		this.lastSave = Date.now()
	},

	getQuestion() {
		return this.config.operation()
	},

	setConfig(config) {
		this.config = config

		question.create()
		this.resetTimer()
	},

	step() {
		let elapsed = Date.now() - this.lastSave

		let secs = this.state == "question" ? this.config.secs : 10
		let finished = progress.update(elapsed, secs)

		if (finished) {
			if (this.state == "question") {
				this.state = "answer"
				question.setAnswer(this.answer)
			} else {
				this.state = "question"
				question.create()
			}

			this.resetTimer()
		}
	},

	init() {
		this.resetTimer()

		dropdown.create()
		question.create()

		setInterval(this.step.bind(this), 10)
	}
}

const progress = {
	el: getId("progress"),

	update(elapsed, limit) {
		let raw = 100 - (elapsed/1000 / limit * 100)
		this.el.value = Math.round(raw)

		// Are we finished?
		return raw < 0
	}
}

const question = {
	el: getId("question"),

	setAnswer(answer) {
		this.el.innerHTML += ` = ${answer}`
	},

	create() {
		this.el.innerHTML = game.getQuestion()
	}
}

const dropdown = {
	el: getId("dropdown"),

	change() {
		const value = parseInt(this.el.value)
		game.setConfig(configs[value])
	},

	create() {
		this.el.onchange = this.change.bind(this)

		configs.forEach((config, i) => {
			let option = document.createElement("option")
			option.value = i.toString()
			option.innerHTML = config.name
			this.el.appendChild(option)
		})
	}
}


game.init()
