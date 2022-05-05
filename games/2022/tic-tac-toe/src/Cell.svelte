<script>
	export let ri
	export let ci
	export let grid

	export let turn

	const click = () => {
		turn = turn == 1 ? 0 : 1
	}
</script>

<td on:click={click}>{ri} {ci} {grid[ri][ci]}</td>
