const input = document.getElementById("input") as HTMLTextAreaElement
const output = document.getElementById("output") as HTMLTextAreaElement
const inputStatus = document.getElementById("status")!

const transIDs = ["x1", "y1", "x2", "y2"]

function addStatusMessage(message: string) {
	const li = document.createElement("li")
	li.innerHTML = message
	inputStatus.appendChild(li)
}

interface Coord {
	x: number
	y: number
	valid: boolean
}

function parseCoords(lines: string) {
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

interface Transformation {
	x1: number
	y1: number
	x2: number
	y2: number
}

function parseTransformation() {
	let transformation: Transformation = {}

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

function transform(inputCoords: Coord[], transformation: Transformation) {
	/*
	(1, 0) --> (x1, y1)
	(0, 1) --> (x2, y2)

	(x, y) = x(1, 0) + y(0, 1)
	x(1, 0) + y(0, 1) --> x(x1, y1) + y(x2, y2)
	= (x(x1) + y(x2)), (x(y1) + y(y2))
	*/

	const coords = inputCoords
	for (let i = 0; i < coords.length; i++) {
		if (!coords[i].valid)
			continue

		const x = coords[i].x
		const y = coords[i].y

		coords[i].x = x * transformation.x1 + y * transformation.x2
		coords[i].y = x * transformation.y1 + y * transformation.y2
	}

	return coords
}

function showOutput(coords: Coord[]) {
	// All coords are valid, or else showOutput would not have run
	output.value = coords.map(coord => `(${coord.x}, ${coord.y})`).join("\n")
}

function update() {
	Array.from(inputStatus.children).forEach(child => {child.remove()})

	const coords = parseCoords(input.value)
	const transformation = parseTransformation()

	if (inputStatus.children.length > 0)
		return

	addStatusMessage("All input valid")
	showOutput(transform(coords, transformation))
}

input.addEventListener("input", update)
transIDs.forEach(id => {
	document.getElementById(id)!.addEventListener("input", update)
})

update()
