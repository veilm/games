// Is this syntax idiomatic? It looks weird
const get_unix = (date) => Math.floor(date.getTime() / 1000)

let time_input  = document.getElementById("time_input")
document.getElementById("current").innerHTML = get_unix(new Date())

document.getElementById("convert").onclick = function() {
	let output = []

	let conversions = time_input.value.split("\n")
	conversions.forEach((value, index) => {

		// Skip blank lines
		if (value == "") output.push("")

		// Don't append a bunch of them if the user is spamming the button
		else if (value.includes("Invalid Date")) output.push(value)

		// User provided Unix time
		else if (!isNaN(value)) output.push(new Date(parseInt(value) * 1000))

		// User supposedly gave a date
		else {
			let date = new Date(value)

			let invalid = "Invalid Date"
			if (date.toString() == invalid) output.push(invalid + ": " + value)

			else output.push(get_unix(date))
		}
	})

	time_input.value = output.join("\n")
}
