declare var MathJax

let output = document.getElementById("math_output")
let input = document.getElementById("math_input") as HTMLInputElement

document.getElementById("render").onclick = () => {
	// Delete existing elements
	while (output.children.length != 0) {
		output.children[0].remove()
	}

	// Create an element for each line of math input
	input.value.split("\n").forEach(line => {
		let p = document.createElement("p")
		p.innerHTML = "`" + line + "`"

		output.appendChild(p)
	})

	// Tell MathJax to re-render
	MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'math-display']);
}
