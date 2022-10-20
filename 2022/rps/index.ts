const randomButton = document.getElementById("random")
const redditButton = document.getElementById("reddit")
const psychologyButton = document.getElementById("psychology")

let gameMode: string

randomButton.onclick = () => setGameMode("random")
redditButton.onclick = () => setGameMode("reddit")
psychologyButton.onclick = () => setGameMode("psychology")

function setGameMode(mode: string) {
	gameMode = mode

	document.getElementById("title").style.display = "none"
	document.getElementById("game").style.display = "block"
}
