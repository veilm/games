const auto = document.getElementById("auto") as HTMLInputElement
const convert = document.getElementById("convert") as HTMLInputElement
const text = document.getElementById("input") as HTMLInputElement

const words_span = document.getElementById("words")!
const characters_span = document.getElementById("characters")!

// Update the word and character count
function count() {
	let words = 0
	let pchar = " "

	let current: boolean
	let previous: boolean

	for (const char of text.value) {
		current = (char == "\n" || char == " ")
		previous = (pchar == "\n" || pchar == " ")

		if (!current && previous) words++
		pchar = char
	}

	words_span.innerHTML = words.toString()
	characters_span.innerHTML = text.value.length.toString()
}

auto.onchange = () => {
	convert.disabled = auto.checked
	if (auto.checked) count()
}

convert.onclick = count
text.oninput = () => {
	if (auto.checked) count()
}
