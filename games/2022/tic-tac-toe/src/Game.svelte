<script>
	import Cell from "./Cell.svelte"

	export let players

	let grid = [
		["E", "E", "E"],
		["E", "E", "E"],
		["E", "E", "E"]
	]
</script>

<table>
	{#each grid as row, ri}
	<tr>
		{#each row as cell, ci}
		<Cell {ri} {ci} {grid} />
		{/each}
	</tr>
	{/each}
</table>

<p>{players}</p>
