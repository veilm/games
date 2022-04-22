declare var joke_input
const joke_split = joke_input.split(";")

const button_1 = document.getElementById("button_" + 1) as HTMLInputElement
const button_2 = document.getElementById("button_" + 2) as HTMLInputElement
const button_3 = document.getElementById("button_" + 3) as HTMLInputElement

const part_1 = document.getElementById("part_" + 1)
const part_2 = document.getElementById("part_" + 2)
const part_3 = document.getElementById("part_" + 3)

const joke_1 = document.getElementById("joke_1")
const joke_2 = document.getElementById("joke_2")

button_1.onclick = () => {
	part_1.style.display = "none"
	part_2.style.display = "block"

	joke_1.innerHTML = joke_split[0]
	button_2.value = joke_split[0] + " who?"
}

button_2.onclick = () => {
	part_2.style.display = "none"
	part_3.style.display = "block"

	joke_2.innerHTML = joke_split[1]
}

button_3.onclick = () => {
	location.reload()
}
