let gameMode: string
let round = 1

const play = document.getElementById("play")
const results = document.getElementById("results")
const roundText = document.getElementById("round")

document.getElementById("random").onclick = () => setGameMode("random")
document.getElementById("reddit").onclick = () => setGameMode("reddit")
document.getElementById("psychology").onclick = () => setGameMode("psychology")

document.getElementById("rock").onclick = () => playOption("r")
document.getElementById("paper").onclick = () => playOption("p")
document.getElementById("scissors").onclick = () => playOption("s")

document.getElementById("next").onclick = () => {
	results.style.display = "none"
	play.style.display = "block"

	updateRounds()
}

function updateRounds() {
	round++
	roundText.innerHTML = round.toString()
}

function setGameMode(mode: string) {
	gameMode = mode

	document.getElementById("title").style.display = "none"
	document.getElementById("game").style.display = "block"
}

function playOption(option: string) {
	play.style.display = "none"
	results.style.display = "block"
}
