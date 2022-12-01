const question = document.getElementById("question")
const progress = document.getElementById("progress")

const RNG = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min
}

const game = {
	multiplication() {
		return `${RNG(0, 5)} * ${RNG(0, 5)}`
	}
}

question.innerHTML = game.multiplication()
