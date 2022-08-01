<script>
	import Cell from "./Cell.svelte"

	export let players

	let turn
	let grid
	let win

	const newMatch = () => {
		turn = 0

		grid = [
			[" ", " ", " "],
			[" ", " ", " "],
			[" ", " ", " "]
		]

		win = {
			"exists": false,
			"coords": [
				[false, false, false],
				[false, false, false],
				[false, false, false]
			]
		}
	}
	newMatch()
</script>

{#if win.exists}
	<p>Winner: {players[1 - turn % 2]}</p>
	<input type="button" value="Rematch" on:click={newMatch}>
{:else if turn > 8}
	<p>Tie - no more moves</p>
	<input type="button" value="Rematch" on:click={newMatch}>
{:else}
	<p>Current turn: {players[turn % 2]}</p>
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
