<script>
	export let config
	export let screen

	export let handleWin
	export let getPerformance

	let range = {
		min: config.min,
		max: config.max
	}

	let guesses = 1
	$: guess = Math.round((range.min + range.max)/2)

	let state = "play"
	let performance

	const equal = () => {
		performance = getPerformance(guesses)
		handleWin("computer", performance)

		state = "done"
	}

	const unequal = rel => {
		guesses++

		if (rel == "low") range.min = guess + 1
		else range.max = guess - 1
	}

	$: enabled = {
		low: guess < config.secret,
		equal: guess == config.secret,
		high: guess > config.secret
	}
</script>

{#if state == "play"}
	<p>Guess #{guesses}: the computer guesses the number "{guess}". What's the
	guess's relationship with your secret number?</p>

	<input
		type="button"
		value="Too low"
		disabled={!enabled.low}
		on:click={() => unequal("low")}
	>

	<input
		type="button"
		value="Equal"
		disabled={!enabled.equal}
		on:click={equal}
	>

	<input
		type="button"
		value="Too high"
		disabled={!enabled.high}
		on:click={() => unequal("high")}
	>
{:else}
	<p>The computer used {guesses} guesses. This counts as {performance}
	performance.</p>

	<input
		type="button"
		value="Back"
		on:click={() => screen = "Main Menu"}
	>
{/if}
