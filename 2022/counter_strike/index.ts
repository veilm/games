const existing = [0, 1]
let current = 2

existing.forEach((value) => {
	document.getElementById("function_" + value).onchange = () => {
		render_button(value)
	}

	document.getElementById("button_" + value).onclick = () => {
		execute_function(value)
	}
})

function execute_function(id: number) {
	const input = document.getElementById("function_" + id) as HTMLTextAreaElement
	const counter = document.getElementById("counter")

	let x = parseInt(counter.innerHTML)
	input.value.split("\n").forEach((line) => {
		eval(line)
	})
	counter.innerHTML = x.toString()
}

function render_button(id: number) {
	const input = document.getElementById("function_" + id) as HTMLTextAreaElement
	const line = input.value.split("\n")[0]

	let title = "function #" + id
	if (line.substring(0, 3) == "// " && line.length > 3)
		title = line.substring(3)

	const output = document.getElementById("button_" + id) as HTMLInputElement
	output.value = title
}

document.getElementById("add").onclick = () => {

	// Otherwise, textarea.onchange and button.onclick
	// will use the global "current", which will change
	let saved = current

	const textarea = document.createElement("textarea")
	textarea.id = "function_" + saved
	textarea.value = "// function #" + (saved + 1) + "\nx++"
	textarea.onchange = () => {render_button(saved)}

	const button = document.createElement("input")
	button.type = "button"
	button.id = "button_" + saved
	button.onclick = () => {execute_function(saved)}

	document.getElementById("input").appendChild(textarea)
	document.getElementById("output").appendChild(button)

	render_button(saved)

	current++
}
