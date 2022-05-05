<script>
	import Cell from "./Cell.svelte"

	export let players
	let turn = 0

	let grid = [
		[" ", " ", " "],
		[" ", " ", " "],
		[" ", " ", " "]
	]

	let win = {
		"exists": false,
		"coords": [
			[false, false, false],
			[false, false, false],
			[false, false, false]
		]
	}
</script>

{#if win.exists}
	<p>Winner: {players[turn == 1 ? 0 : 1]}</p>
{:else}
	<p>Current turn: {players[turn]}</p>
{/if}

<table>
	{#each grid as row, ri}
	<tr>
		{#each row as cell, ci}
		<Cell
			{ri} {ci} {players}
			bind:grid={grid}
			bind:turn={turn}
			bind:win={win}
		/>
		{/each}
	</tr>
	{/each}
</table>
