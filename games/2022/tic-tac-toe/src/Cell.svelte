<script>
	export let ri
	export let ci
	export let grid

	export let turn

	const click = () => {
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
