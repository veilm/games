<script>
	export let guesses
	export let handleGuess

	function tryGuess() {
		let num = parseInt(document.getElementById("guessInputNumber").value)
		if (!isNaN(num)) handleGuess(num)
	}
</script>

<p>Guesses: {guesses}</p>

<input
	id="guessInputNumber"
	type="number"
	placeholder="Guess a number."
>
<input
	type="button"
	value="Submit"
	on:click={tryGuess}
>
