const table = document.getElementById("grid");
const submit = document.getElementById("submit");
const gameStatus = document.getElementById("status");
let grid = [];
let startTime = new Date().getTime();
let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
// It looks cleaner to have empty cells instead of cells with "0"
const parseCell = cell => cell == "0" ? "" : cell;
// Gets problems/1.txt to problems/50.txt
let problemFile = `problems/${Math.round(Math.random() * 49) + 1}.txt`;
let r = new XMLHttpRequest();
r.open("GET", problemFile, true);
// Create sudoku table
r.onload = function () {
    let rowIdx = 0;
    for (const row of this.responseText.split("\n")) {
        // Empty "\n" at the end
        if (rowIdx == 9)
            continue;
        let tr = document.createElement("tr");
        grid.push([]);
        let colIdx = 0;
        for (const cell of row) {
            let td = document.createElement("td");
            td.innerHTML = parseCell(cell);
            if (cell == "0") {
                td.className = "edit";
                // Using e.g. "colIdx" instead of making these temp variables
                // would set it to 9, the value after the loop is done.
                let tempCol = colIdx;
                let tempRow = rowIdx;
                td.onclick = function () {
                    let newIdx = digits.indexOf(grid[tempRow][tempCol]) + 1;
                    if (newIdx == 10)
                        newIdx = 0;
                    let newValue = digits[newIdx];
                    grid[tempRow][tempCol] = newValue;
                    td.innerHTML = parseCell(newValue);
                };
            }
            else
                td.className = "keep";
            // Borders around 3x3 groups
            if (rowIdx == 0 || rowIdx == 6)
                td.className += " top";
            if (colIdx == 0 || colIdx == 6)
                td.className += " left";
            if (rowIdx == 2 || rowIdx == 8)
                td.className += " bottom";
            if (colIdx == 2 || colIdx == 8)
                td.className += " right";
            tr.appendChild(td);
            grid[rowIdx].push(cell);
            colIdx++;
        }
        table.appendChild(tr);
        rowIdx++;
    }
};
r.send();
// Takes the position of the top-left cell in the 3x3
// e.g. (0, 0) for ((0, 0) ... (2, 2))
function validInner(row, col) {
    let used = {};
    for (let changeRow = 0; changeRow < 3; changeRow++) {
        for (let changeCol = 0; changeCol < 3; changeCol++) {
            let cell = grid[row + changeRow][col + changeCol];
            if (used[cell] || cell == "0")
                return false;
            used[cell] = true;
        }
    }
    return true;
}
submit.onclick = () => {
    let invalid = "";
    // I know that this is not combinatorically optimal but this assignment is
    // formative
    // Check rows and columns
    for (let dir = 0; dir < 2; dir++) {
        if (invalid != "")
            break;
        for (let i = 0; i < 9; i++) {
            if (invalid != "")
                break;
            let used = {};
            for (let j = 0; j < 9; j++) {
                // Look at rows the first time through and then columns the
                // second time through.
                let cell = dir == 0 ? grid[i][j] : grid[j][i];
                if (used[cell] || cell == "0") {
                    invalid = `${dir == 0 ? "Row" : "Column"} ${i}`;
                    break;
                }
                used[cell] = true;
            }
        }
    }
    // Check all 9 inner 3x3 squares
    for (let row = 0; row < 7; row += 3) {
        if (invalid != "")
            break;
        for (let col = 0; col < 7; col += 3) {
            if (!validInner(row, col)) {
                invalid = `Inner 3x3 square at R${row} C${col}`;
                break;
            }
        }
    }
    if (invalid != "") {
        gameStatus.innerHTML = `Invalid (${invalid})`;
        return;
    }
    // Win
    for (const tr of table.children) {
        for (const td of tr.children) {
            td.className = "edit";
            if (td instanceof HTMLElement)
                td.onclick = null;
        }
    }
    submit.style.display = "none";
    let endTime = new Date().getTime();
    let timeUsed = Math.round((endTime - startTime) / 1000);
    gameStatus.innerHTML = `All cells valid (${timeUsed} sec)`;
};
