const table = document.getElementById("grid")

// Gets problems/1.txt to problems/50.txt
let problemFile = `problems/${Math.round(Math.random() * 49) + 1}.txt`
let r = new XMLHttpRequest()
r.open("GET", problemFile, true)

r.onload = function() {
	// Create sudoku table
	for (const row of this.responseText.split("\n")) {
		let tr = document.createElement("tr")

		for (const cell of row) {
			let td = document.createElement("td")
			td.innerHTML = cell
			tr.appendChild(td)
		}

		table.appendChild(tr)
	}
}

r.send()
