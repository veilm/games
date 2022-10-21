let gameMode: string
let backgroundRGB = [249, 249, 249]

let round = 1
let playerWins = 0
let compWins = 0
let loseStreak = 0

let playerOption: string
let compOption: string

let initDate = Date.now()

const play = document.getElementById("play")
const results = document.getElementById("results")
const roundText = document.getElementById("round")
const resultText = document.getElementById("result")

const streakWholeText = document.getElementById("streakText")
const streakCountText = document.getElementById("streak")

const playerWinRate = document.getElementById("playerWinRate")
const compWinRate = document.getElementById("compWinRate")
const tieRate = document.getElementById("tieRate")

const playerImg = document.getElementById("playerOption") as HTMLImageElement
const compImg = document.getElementById("compOption") as HTMLImageElement

// logic[x] is y if x wins against y
const logic = {
	rock: "scissors",
	paper: "rock",
	scissors: "paper"
}

const shorts = {
	r: "rock",
	p: "paper",
	s: "scissors",
}

const hex = {
	tie: "#4a4a4a",
	win: "#2c8898",
	lose: "#982c2c"
}

const RGB = {
	tie: [74, 74, 74],
	win: [44, 136, 152],
	lose:[152, 44, 44]
}

// Psychology PhD Game history
let pHistory: string[] = []

const options = ["r", "p", "s"]
const pHead = pNode()

document.getElementById("random").onclick = () => setGameMode("random")
document.getElementById("reddit").onclick = () => setGameMode("reddit")
document.getElementById("psychology").onclick = () => setGameMode("psychology")

document.getElementById("rock").onclick = () => playOption("rock")
document.getElementById("paper").onclick = () => playOption("paper")
document.getElementById("scissors").onclick = () => playOption("scissors")

document.getElementById("next").onclick = () => {
	results.style.display = "none"
	play.style.display = "block"

	updateRounds()
}

function RNG(min: number, max: number): number {
	return Math.round(Math.random() * (max - min)) + min
}

/*
Original Psychology PhD mode idea

- Each pattern and its result is stored
e.g.
R, R --> Tie
P, S --> Win
R, S --> Lose
Would store
1.
	(R = tie)
2.
	(S = win)
	(S after (R,R) = win)
3.
	(S = Lose)
	(S after (P,S) = lose)
	(S after (R,R),(P,S) = lose)
--
Then, in the future, if the game state ever leads to (P,S), it would be less
likely to play S on the next round, because this pattern has lost in the past
--
Also: It wouldn't just look at the last round, it would look at the entire game
history for patterns
So if the round was (P,S), it might not want to do S this round
BUT
There might be many wins for (R,R)(P,S) and many losses for (S,P)(P,S)
Here it would be looking at the last two rounds instead of just the last one
--
What if there isn't enough data? It has to compare data across patterns.
The very easiest match is to just look at the single choice: S = lose, R = win, etc.
So that would match almost every time. But, the success rate on those might be
closer to 33%, and it wants the highest success rate possible
It would look at the longest patterns possible and judge them according to
laplace's rule of sucession
--
Idk hopefully it makes sense
*/

// Stores performance of option for given pattern path
function pOption() {
	return {
		games: 0,
		wins: 0
	}
}

// Stores branching game paths and success of different options at current path
// The branching paths are assigned later, not initially
function pNode(): any {
	let node: any = {}

	// Stores the performance of each option on this path
	options.forEach(option => {
		node[option] = pOption()
	})

	// The actual paths branching from this node are added later
	// The notation is node[xy] where x is the player option and y is the comp
	// option

	return node
}

// Result: (0, 0.5, 1) for (L, T, W)
// Remember, round[0] is player and round[1] is comp
function getResults(round: string): number {
	let a = shorts[round[0]]
	let b = shorts[round[1]]

	// A tie counts as the winner, since there's no loser
	if (a == b) return 0.5
	else if (logic[a] == b) return 0
	else return 1
}

function pAddSinglePath(path: string[]) {
	let node = pHead

	// We have to go one less than the whole path
	// Because we're recording the performance after a path, not with a path
	// Idk this whole concept is so convoluted that I don't think I can make it
	// possible to understand no matter how well I explain it
	let length = path.length - 1

	for (let i = 0; i < length; i++) {
		let game = path[i]

		// Connect a node to the path if it doesn't exist
		if (node[game] == undefined)
			node[game] = pNode()

		// Traverse to next node
		node = node[game]
	}

	// Add stats to this path
	let tail = path[length]
	let option = tail[1]
	node[option].wins += getResults(tail)
	node[option].games++
}

// Works for path = [], which returns the base (head) performance
function pGetPerformance(path: string[]) {
	let node = pHead

	for (let i = 0; i < path.length; i++) {
		let game = path[i]

		// We've never had this path before
		// e.g. ["pr", "sr", "rr"] - we don't have any performance statistics
		// for post-rr, so we can't make any prediction based on it
		// Instead, it would just look at global rps stats
		if (node[game] == undefined)
			return null

		// Traverse to next node
		node = node[game]
	}

	let rt = {}

	// Use Laplace's rule of succession
	// Add 1 favourable and 1 unfavourable outcome
	// aka matching + 1, total + 2
	options.forEach(opt => {
		rt[opt] = (node[opt].wins + 1) / (node[opt].games + 2)
	})

	return rt
}

/*
Add all subpaths of path

e.g. ["rr", "ps", "ss"]
would add
s after ["rr", "ps"] = tie
s after ["ps"] = tie
s = tie
*/
function pAddAllPaths(path: string[]) {
	for (let i = 0; i < path.length; i++) {
		pAddSinglePath(path.slice(i))
	}
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

function getPsychology(): string {
	return "rock"
}

function getRandom(): string {
	let option = RNG(0, 100) % 3
	return ["rock", "paper", "scissors"][option]
}

function getReddit(): string {
	// playerOption and compOption are of the previous round right now
	// console.log("player", playerOption)
	// console.log("computer", compOption)
	// console.log("=================================================")

	// If we tied or it's the first round, choose randomly
	if (playerOption == null || playerOption == compOption)
		return getRandom()

	// If we won last round, play what we would have lost against
	// (We're expecting the player to copy us)
	if (logic[compOption] == playerOption)
		return logic[playerOption]

	// If we lost the last round, play what would have won against the player
	// (We're expecting the player to play the same thing again)
	return logic[compOption]
}

function getCompOption(): string {
	if (gameMode == "random") return getRandom()
	else if (gameMode == "reddit") return getReddit()
	else return getPsychology()
}

function updateLoseStreak(result: string) {
	if (result == "lose") loseStreak++
	else loseStreak = 0

	if (loseStreak >= 2) {
		streakCountText.innerHTML = loseStreak.toString()
		streakWholeText.style.display = "block"
	}
	else streakWholeText.style.display = "none"
}

function updateWinRate(result: string) {
	if (result == "win") playerWins++
	else if (result == "lose") compWins++

	let rate: number

	rate = Math.round(playerWins/round * 100)
	playerWinRate.innerHTML = rate.toString()

	rate = Math.round(compWins/round * 100)
	compWinRate.innerHTML = rate.toString()

	let ties = round - compWins - playerWins
	rate = Math.round(ties/round * 100)
	tieRate.innerHTML = rate.toString()
}

function displayResults() {
	playerImg.src = `${playerOption}.png`
	compImg.src = `${compOption}.png`

	let result: string
	if (playerOption == compOption) result = "tie"
	else if (logic[playerOption] == compOption) result = "win"
	else result = "lose"

	updateLoseStreak(result)
	updateWinRate(result)

	resultText.innerHTML = `Result: ${result}`
	document.body.style.color = hex[result]

	backgroundRGB = RGB[result]
	initDate = Date.now()
}

function pUpdateModel() {
	if (gameMode != "psychology") return

	pHistory.push(playerOption[0] + compOption[0])
	pAddAllPaths(pHistory)
}

function playOption(option: string) {
	compOption = getCompOption()
	playerOption = option

	pUpdateModel()
	displayResults()

	play.style.display = "none"
	results.style.display = "grid"
}

function updateBackground() {
	let diff = Date.now() - initDate
	let duration = 500

	if (diff < duration) {
		let progress = diff/duration

		// [249, 249, 249] is the default

		let updated = [0, 0, 0]
		for (let i = 0; i < 3; i++) {
			let c = backgroundRGB[i]
			updated[i] = c + (249-c) * progress
		}

		let r = updated[0]
		let g = updated[1]
		let b = updated[2]
		document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
	}

	window.requestAnimationFrame(updateBackground)
}
window.requestAnimationFrame(updateBackground)
