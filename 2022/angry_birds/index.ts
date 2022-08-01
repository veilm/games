const input = document.getElementById("level") as HTMLInputElement

// We can't access consts with window[x] so we use var
var blues   = (lvl: number) => lvl > 17
var bomb    = (lvl: number) => lvl <= 17
var bubbles = (lvl: number) => lvl != 17
var chuck   = (lvl: number) => lvl > 5 && lvl < 25
var hal     = (lvl: number) => lvl < 6 || lvl > 20
var matilda = (lvl: number) => lvl > 25 && lvl < 50
var red     = (lvl: number) => lvl != 12 && lvl != 18
var stella  = (lvl: number) => lvl < 10 || lvl > 30

const birds = [
	"blues",
	"bomb",
	"bubbles",
	"chuck",
	"hal",
	"matilda",
	"red",
	"stella"
]

document.getElementById("submit").onclick = () => {
	const lvl = parseInt(input.value)
	if (isNaN(lvl)) return

	birds.forEach(bird => {
		let display = "none"
		if (window[bird](lvl)) display = "inline";

		document.getElementById(bird).style.display = display
	})
}
