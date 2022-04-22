const input = document.getElementById("input") as HTMLTextAreaElement
const output = document.getElementById("output")

function create_option(value: string): HTMLOptionElement {
	let option = document.createElement("option")
	option.value = value
	option.innerHTML = value
	return option
}

function render_entry(entry: Entry, idx: number): void {
	let button = document.createElement("input")
	button.type = "button"
	button.value = entry.title
	button.className = "entry"
	button.style.backgroundColor = entry.bg
	button.style.color = entry.fg
	button.onclick = () => {
		const shown = document.getElementsByClassName("shown")[0] as HTMLSelectElement

		if (shown) {
			shown.style.display = "none"
			shown.className = ""
		}

		if (shown != select) {
			select.style.display = "block"
			select.className = "shown"
		}
	}

	let select = document.createElement("select")
	select.appendChild(create_option(entry.title))

	entry.opt.forEach(title => {
		select.appendChild(create_option(title))
	})

	select.onchange = () => {
		button.value = select.value
	}

	output.appendChild(button)
	output.appendChild(select)
}

interface Entry {
	title: string,
	bg: string,
	fg: string,
	opt: string[]
}

document.getElementById("render_button").onclick = () => {
	while (output.children.length > 0) {
		output.children[0].remove()
	}

	let entry: Entry = {
		title: "",
		bg: "#000000",
		fg: "#ffffff",
		opt: []
	}

	input.value.split("\n").forEach((line, idx) => {
		if (line == "") return

		if (line.length > 1 && line[0] == "+" && line[1] == " ") {
			const colon = line.indexOf(":")
			if (colon == -1) return

			const setting = line.substring(2, colon)
			const value = line.substring(colon + 1)

			if (setting == "bg" || setting == "fg") entry[setting] = value
			if (setting == "opt") entry.opt.push(value)

		} else {
			if (entry.title == "") {
				entry.title = line
				return
			}

			render_entry(entry, idx)

			entry = {
				title: line,
				bg: "#000000",
				fg: "#ffffff",
				opt: []
			}
		}
	})

	render_entry(entry, -1)
}
