const div = document.getElementById("input")
const start = document.getElementById("start") as HTMLInputElement

let state = "input"
let title
let template

function add_p(text: string) {
	let p = document.createElement("p")
	p.innerHTML = text
	document.getElementById("output").appendChild(p)
}

fetch("https://madlibz.herokuapp.com/api/random")
.then(response => response.json())
.then(data => {
	data.blanks.forEach((value, idx) => {
		const input = document.createElement("input")
		input.type = "text"
		input.placeholder = value

		div.appendChild(input)
	})

	title = data.title
	template = data.value
	template.pop()
})

start.onclick = () => {
	if (state == "input") {
		const children = div.children

		for (let i = 0; i < children.length; i++) {
			const child = children[i] as HTMLInputElement

			if (child.value == "") {
				alert("You haven't filled in the boxes yet!")
				return
			}
		}

		document.getElementById("input").style.display = "none"
		document.getElementById("instructions").style.display = "none"
		start.value = "Try again"
		state = "refresh"

		add_p(title)

		for (let i = 0; i < children.length; i++) {
			const child = children[i] as HTMLInputElement
			template[i] += child.value
		}
		add_p(template.join(""))
	}
	else location.reload()
}
