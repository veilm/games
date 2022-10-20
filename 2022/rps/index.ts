let gameMode: string

const play = document.getElementById("play")
const results = document.getElementById("results")

document.getElementById("random").onclick = () => setGameMode("random")
document.getElementById("reddit").onclick = () => setGameMode("reddit")
document.getElementById("psychology").onclick = () => setGameMode("psychology")

document.getElementById("rock").onclick = () => playOption("r")
document.getElementById("paper").onclick = () => playOption("p")
document.getElementById("scissors").onclick = () => playOption("s")

document.getElementById("next").onclick = () => {
	results.style.display = "none"
	play.style.display = "block"
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
