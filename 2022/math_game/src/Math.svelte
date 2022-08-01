<script>
	export let questions
	export let screen
	export let points
	export let RNG
	export let difficultyUnlocked

	let difficulty = 1
	let input

	function questionValues(diff) {
		if (screen == "Exponents" || screen == "Roots")
			return [RNG(1, 2*diff), RNG(1, 3*diff)]

		if (screen == "Multiplication" || screen == "Division")
			return [RNG(1, 6*diff), RNG(1, 6*diff)]

		else return [RNG(1, 15*diff), RNG(1, 15*diff)]
	}

	let values
	let pair

	const newQuestion = () => {
		values = questionValues(difficulty)
		pair = questions[screen](values[0], values[1])
		input = ""
	}
	newQuestion()

	const submit = () => {
		var change = 2*difficulty - 1

		if (parseInt(input) == pair.answer) points[screen] += change
		else {
			points[screen] -= change
			if (points[screen] < 0) points[screen] = 0
		}

		newQuestion()
	}

	document.onkeydown = e => {
		if (e.keyCode == 13) submit()
	}

</script>

<h3>{pair.question}</h3>
<input type="number" placeholder="Answer" bind:value={input}>
<input type="button" value="Submit" on:click={submit}>

<p>{screen} points: {points[screen]}</p>

{#if difficultyUnlocked}
	<label for="difficulty">Difficulty</label>
	<input
		id="difficulty"
		type="range"
		min="1"
		max="3"
		bind:value={difficulty}
		on:change={newQuestion}
	>
{/if}

<style>
	p {
		margin-top: 20px;
	}
</style>
