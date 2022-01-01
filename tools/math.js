let output = document.getElementById("math_output")
let input = document.getElementById("math_input")

document.getElementById("render").onclick = function() {
	// Delete existing elements
	while (output.children.length != 0) {
		output.children[0].remove()
	}

	// Create an element for each line of math input
	let inputs = input.value.split("\n")
	inputs.forEach(function(value, index) {
		let p = document.createElement("p")
		p.innerHTML = "`" + value + "`"
		output.appendChild(p)
	})

	// Tell MathJax to re-render
	MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'math-display']);
}
