let r = new XMLHttpRequest()
r.open("GET", "problems/test.txt", true)

r.onload = function() {
	console.log(this.responseText)
}

r.send()
