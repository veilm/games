const question = document.getElementById("question")
const progress = document.getElementById("progress")

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

const configs = [
	{
		name: "Multiplication 10-20",
		min: 10,
		max: 20
	}
]

const game = {
	multiplication(min, max) {
		return `${RNG(min, max)} × ${RNG(min, max)}`
	}
}

let config = configs[0]
question.innerHTML = game.multiplication(config.min, config.max)
