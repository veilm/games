<script>
	import GuessInput from "./GuessInput.svelte"

	export let config
	export let handleWin
	export let getPerformance
	export let screen

	let guesses = 0
	let answer = Math.round(Math.random() * (config.max - config.min)) + config.min
	let state = "play"
	let performance

	const handleGuess = guess => {
		let relation
		let status = document.getElementById("status")

		guesses++

		if (guess > answer) relation = "higher"
		else if (guess < answer) relation = "lower"

		else {
			let performance = getPerformance(guesses)
			status.innerHTML = `You guessed correctly: ${guess}! You needed ${guesses} guesses, which counts as ${performance} performance.`
			handleWin("player", performance)

			state = "done"
			return
		}

		status.innerHTML = `Your guess, ${guess}, is ${relation} than the answer.`
	}

</script>

<p id="status">The computer has picked a number. Try a guess. You will be told whether your
guess is higher, lower, or equal to the correct number.</p>

{#if state == "play"}
	<GuessInput {guesses} {handleGuess} />
{:else}
	<input on:click={() => screen = "Main Menu"} type="button" value="Back">
{/if}

