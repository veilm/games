<script>
	let player1 = "X"
	let player2 = "O"

	const swap = () => {
		player1 += player2
		player2 = player1[0]
		player1 = player1[1]
	}
</script>

<ul>
	<li>Player 1: {player1}</li>
	<li>Player 2: {player2}</li>
</ul>

<input type="button" value="Swap" on:click={swap}>
<input type="button" value="Confirm">
