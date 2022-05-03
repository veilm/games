// Gets problems/1.txt to problems/50.txt
let problemFile = `problems/${Math.round(Math.random() * 49) + 1}.txt`

let r = new XMLHttpRequest()
r.open("GET", problemFile, true)

r.onload = function() {
	console.log(this.responseText)
}

r.send()
