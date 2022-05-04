const table = document.getElementById("grid")
let grid = []

let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

// It looks cleaner to have empty cells instead of cells with "0"
const parseCell = cell => cell == "0" ? "" : cell

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

		let colIdx = 0

		for (const cell of row) {
			let td = document.createElement("td")
			td.innerHTML = parseCell(cell)

			if (cell == "0") {
				td.className = "edit"

				// Using e.g. "colIdx" instead of making these temp variables
				// would set it to 9, the value after the loop is done.

				let tempCol = colIdx
				let tempRow = rowIdx

				td.onclick = function() {
					let newIdx = digits.indexOf(grid[tempRow][tempCol]) + 1
					if (newIdx == 10) newIdx = 0

					let newValue = digits[newIdx]
					grid[tempRow][tempCol] = newValue
					td.innerHTML = parseCell(newValue)
				}
			}
			else td.className = "keep"

			// Borders around 3x3 groups
			if (rowIdx == 0 || rowIdx == 6) td.className += " top"
			if (colIdx == 0 || colIdx == 6) td.className += " left"
			if (rowIdx == 2 || rowIdx == 8) td.className += " bottom"
			if (colIdx == 2 || colIdx == 8) td.className += " right"

			tr.appendChild(td)

			grid[rowIdx].push(cell)
			colIdx++
		}

		table.appendChild(tr)
		rowIdx++
	}

	console.log(grid)
}

r.send()
