const input = document.getElementById("input") as HTMLTextAreaElement
const output = document.getElementById("output")
const inputStatus = document.getElementById("status")

const transIDs = ["x1", "y1", "x2", "y2"]

const addStatusMessage = message => {
	const li = document.createElement("li")
	li.innerHTML = message
	inputStatus.appendChild(li)
}

interface Coord {
	x: number
	y: number
	valid: boolean
}

const parseCoords = lines => {
	const coords: Coord[] = []

	lines.split("\n").forEach((coordsLine, i) => {
		const invalid = () => {
			addStatusMessage(`Invalid entry "${coordsLine}" on line ${i+1}`)
			coords.push({x: 0, y: 0, valid: false})
		}

		const validLength = coordsLine.length >= "(0, 0)".length
		if (!validLength || coordsLine[0] != "(" || coordsLine.at(-1) != ")") {
			invalid()
			return
		}

		let split = coordsLine.split(", ")
		if (split.length != 2) {
			invalid()
			return
		}

		const x = Number(split[0].slice(1))
		const y = Number(split[1].slice(0, -1))
		if (isNaN(x) || isNaN(y)) {
			invalid()
			return
		}

		coords.push({x: x, y: y, valid: true})
	})

	return coords
}

const parseTransformation = () => {
	const transformation = {}
	transIDs.forEach(id => {
		const el = document.getElementById(id) as HTMLInputElement
		transformation[id] = Number(el.value)

		if (el.value == "")
			addStatusMessage(`No ${id} provided`)
		else if (isNaN(transformation[id]))
			addStatusMessage(`Invalid ${id} "${el.value}"`)
	})

	return transformation
}

const update = () => {
	Array.from(inputStatus.children).forEach(child => {child.remove()})

	const coords = parseCoords(input.value)
	const transformation = parseTransformation()

	if (inputStatus.children.length > 0)
		return

	addStatusMessage("All input valid")
}

input.addEventListener("input", update)
transIDs.forEach(id => {
	document.getElementById(id).addEventListener("input", update)
})

update()
