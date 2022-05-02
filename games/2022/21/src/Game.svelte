<script>
	export let players
	let eliminated = []

	let turn = 0
	let counter = 21
</script>

<label for="players">In-game</label>
<ol id="players">
	{#each players as player}
		<li>{player}</li>
	{/each}
</ol>

{#if eliminated.length > 0}
	<label for="eliminated">Eliminated</label>
	<ol id="eliminated">
		{#each eliminated as player}
			<li>{player}</li>
		{/each}
	</ol>
{/if}

<p>Current turn: {players[turn]}</p>

<hr>

<h3>Counter: {counter}</h3>
<input type="button" value="Take 1" on:click={take(1)} />
<input type="button" value="Take 2" on:click={take(2)} />
<input type="button" value="Take 3" on:click={take(3)} />

<style>
	ol {
		margin-top: 0;
	}
</style>
