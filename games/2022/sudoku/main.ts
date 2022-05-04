const table = document.getElementById("grid")
let grid = []

let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

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
			td.innerHTML = cell
			tr.appendChild(td)

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
					this.innerHTML = newValue
				}
			}
			else td.className = "keep"

			grid[rowIdx].push(cell)
			colIdx++
		}

		table.appendChild(tr)
		rowIdx++
	}

	console.log(grid)
}

r.send()
