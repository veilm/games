const getId = id => document.getElementById(id)

const question = getId("question")
const progress = getId("progress")
const dropdown = getId("dropdown")

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

const configs = [
	{
		name: "Multiplication 10-20",
		min: 10,
		max: 20,
		secs: 45
	},
	{
		name: "Addition 100-200",
		min: 100,
		max: 200,
		secs: 20
	}
]

const game = {
	multiplication(min, max) {
		return `${RNG(min, max)} × ${RNG(min, max)}`
	}
}

let config = configs[0]
question.innerHTML = game.multiplication(config.min, config.max)

configs.forEach((config, i) => {
	let option = document.createElement("option")
	option.value = i.toString()
	option.innerHTML = config.name
	dropdown.appendChild(option)
})
