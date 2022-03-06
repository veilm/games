const invalid = "Invalid Date"

// Is this syntax idiomatic? It looks weird
const get_unix = (date) => Math.floor(date.getTime() / 1000).toString()

let time_input = document.getElementById("time_input") as HTMLInputElement
document.getElementById("current").innerHTML = get_unix(new Date())

document.getElementById("convert").onclick = function() {
	let output: string[] = []

	let conversions = time_input.value.split("\n")
	conversions.forEach(value => {

		// Skip blank lines
		if (value == "") output.push("")

		// Don't append a bunch of them if the user is spamming the button
		else if (value.includes(invalid)) output.push(value)

		// User provided Unix time
		else if (!isNaN(+value)) output.push(new Date(parseInt(value) * 1000).toString())

		// User supposedly gave a date
		else {
			let date = new Date(value)

			if (date.toString() == invalid) output.push(invalid + ": " + value)
			else output.push(get_unix(date))
		}
	})

	time_input.value = output.join("\n")
}
