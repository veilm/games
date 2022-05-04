const table = document.getElementById("grid")
let grid = []

// Gets problems/1.txt to problems/50.txt
let problemFile = `problems/${Math.round(Math.random() * 49) + 1}.txt`
let r = new XMLHttpRequest()
r.open("GET", problemFile, true)

// Create sudoku table
r.onload = function() {
	let rowIdx = 0

	for (const row of this.responseText.split("\n")) {

		// Empty "\n" at the end
		if (rowIdx == 9) continue

		let tr = document.createElement("tr")
		grid.push([])

		for (const cell of row) {
			let td = document.createElement("td")
			td.innerHTML = cell
			tr.appendChild(td)

			grid[rowIdx].push(cell)
		}

		table.appendChild(tr)
		rowIdx++
	}

	console.log(grid)
}

r.send()
