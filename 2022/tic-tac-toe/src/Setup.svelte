<script>
	export let players
	export let screen

	const swap = () => {
		players[0] += players[1]
		players[1] = players[0][0]
		players[0] = players[0][1]
	}
</script>

<ul>
	<li>Player 1: {players[0]}</li>
	<li>Player 2: {players[1]}</li>
</ul>

<input type="button" value="Swap" on:click={swap}>
<input type="button" value="Confirm" on:click={() => screen = "Game"}>
