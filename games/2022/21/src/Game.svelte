<script>
	export let players
	let eliminated = []

	let dead = false
	let done = false

	let turn = 0
	let counter = 21

	const take = num => {
		counter -= num

		if (counter < 1) {
			counter = 21

			// Player lost
			eliminated = [...eliminated, players[turn]]

			// players.splice(turn, 1) doesn't update.
			let second = []
			if (turn < players.length - 1) second = [...players.slice(turn+1, players.length)]
			players = [...players.slice(0, turn), ...second]

			dead = true

			if (players.length == 1) done = true

			// The turn is already progressed by the player leaving, so we need
			// to cancel out the next turn++
			turn--
		}

		turn++
		if (turn >= players.length) turn = 0
	}
</script>

{#if dead}
	<label for="eliminated">Eliminated</label>
	<ol id="eliminated">
		{#each eliminated as player}
			<li>{player}</li>
		{/each}
	</ol>
{/if}

{#if !done}
	<label for="players">In-game</label>
	<ol id="players">
		{#each players as player}
			<li>{player}</li>
		{/each}
	</ol>

	<h3>Current turn: {players[turn]}</h3>

	<hr>

	<h3>Counter: {counter}</h3>
	<input type="button" value="Take 1" on:click={() => take(1)} />
	<input type="button" value="Take 2" on:click={() => take(2)} />
	<input type="button" value="Take 3" on:click={() => take(3)} />
{:else}
	<h3>Winner: {players[0]}</h3>
{/if}

<style>
	ol {
		margin-top: 0;
	}
</style>
