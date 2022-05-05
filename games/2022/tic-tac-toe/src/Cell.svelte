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

		for (let i = 0; i < 3; i++) {
			let winner = "none"

			for (let j = 0; j < 3; j++) {
				if (grid[i][j] == " ") {
					winner = "none"
					break
				}

				if (j == 0) winner = grid[i][j]
				if (grid[i][j] != winner) {
					winner = "none"
					break
				}
			}

			if (winner != "none") {
				alert(winner)
				break
			}
		}
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
