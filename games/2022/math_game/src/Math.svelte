<script lang="ts">
	export let questions
	export let screen

	let difficulty = 1
	let input = ""

	function questionValues(diff: int) {
		return [5, 10]
	}

	let values = questionValues(difficulty)
	let pair = questions[screen](values[0], values[1])

	const submit = () => {
		if (parseInt(input) == pair.answer) console.log("correct")
	}

	document.onkeydown = e => {
		if (e.keyCode == 13) submit()
	}
</script>

<h3>{pair.question}</h3>
<input type="number" placeholder="Answer" bind:value={input}>
<input type="button" value="Submit" on:click={submit}>
