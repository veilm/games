<script>
	export let ri
	export let ci
	export let grid
	export let players

	export let turn

	const click = () => {
		if (grid[ri][ci] != " ") return

		grid[ri][ci] = players[turn]
		turn = turn == 1 ? 0 : 1
	}
</script>

<td on:click={click}>{grid[ri][ci]}</td>

<style>
	td {
		text-align: center;
		border: 1px solid #4a4a4a;
		user-select: none;
	}
</style>
