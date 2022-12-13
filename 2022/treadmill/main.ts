const getId = id => document.getElementById(id)

const progress = getId("progress")

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

const configs = [
	{
		name: "Multiplication 10-20",
		operation: "multiplication",
		min: 10,
		max: 20,
		secs: 45
	},
	{
		name: "Addition 100-200",
		operation: "addition",
		min: 100,
		max: 200,
		secs: 20
	}
]

const game = {
	config: configs[0],

	multiplication(min, max) {
		return `${RNG(min, max)} × ${RNG(min, max)}`
	},

	addition(min, max) {
		return `${RNG(min, max)} + ${RNG(min, max)}`
	},

	getQuestion() {
		let c = this.config
		return this[c.operation](c.min, c.max)
	},

	setConfig(config) {
		this.config = config
		question.create()
	}
}

const question = {
	el: getId("question"),

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

dropdown.create()
question.create()
