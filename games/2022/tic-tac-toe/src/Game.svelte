<script>
	import Cell from "./Cell.svelte"

	export let players
	let turn = 0

	let grid = [
		[" ", " ", " "],
		[" ", " ", " "],
		[" ", " ", " "]
	]
</script>

<p>Current turn: {players[turn]}</p>

<table>
	{#each grid as row, ri}
	<tr>
		{#each row as cell, ci}
		<Cell
			{ri} {ci} {grid}
			bind:turn={turn}
		/>
		{/each}
	</tr>
	{/each}
</table>
