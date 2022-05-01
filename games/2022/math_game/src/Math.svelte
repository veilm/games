<script lang="ts">
	export let questions
	export let screen
	export let points
	export let RNG
	export let difficultyUnlocked

	let difficulty = 1
	let input

	function questionValues(diff: int) {
		if (screen == "Exponents")
			return [RNG(1, 2*difficulty), RNG(1, 3*difficulty)]

		if (screen == "Multiplication" || screen == "Division")
			return [RNG(1, 6*difficulty), RNG(1, 6*difficulty)]

		else return [RNG(1, 15*difficulty), RNG(1, 15*difficulty)]
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
