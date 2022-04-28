<script lang="ts">
	export let questions
	export let screen
	export let points
	export let RNG

	let difficulty = 1
	let input = ""

	function questionValues(diff: int) {
		if (screen == "Exponents")
			return [RNG(1, 2*difficulty), RNG(1, 3*difficulty)]

		if (screen == "Multiplication" || screen == "Division")
			return [RNG(1, 6*difficulty), RNG(1, 6*difficulty)]

		else return [RNG(1, 15*difficulty), RNG(1, 15*difficulty)]
	}

	let values = questionValues(difficulty)
	let pair = questions[screen](values[0], values[1])

	const submit = () => {
		if (parseInt(input) == pair.answer) points[screen]++
		else {
			points[screen]--
			if (points[screen] < 0) points[screen] = 0
		}
	}

	document.onkeydown = e => {
		if (e.keyCode == 13) submit()
	}
</script>

<h3>{pair.question}</h3>
<input type="number" placeholder="Answer" bind:value={input}>
<input type="button" value="Submit" on:click={submit}>

<p>{points[screen]}</p>
