<script>
	export let ri
	export let ci
	export let grid
	export let players
	export let win

	export let turn

	const click = () => {
		if (grid[ri][ci] != " " || win.exists) return

		grid[ri][ci] = players[turn]
		turn = turn == 1 ? 0 : 1

		// Check if any row has three of a kind
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
				win.exists = true
				win.coords[i][0] = true
				win.coords[i][1] = true
				win.coords[i][2] = true
			}
		}
	}
</script>

<td
	class={win.coords[ri][ci] ? "winner" : "normal"}
	on:click={click}
>
	{grid[ri][ci]}
</td>

<style>
	td {
		text-align: center;
		border: 1px solid #4a4a4a;
		user-select: none;
	}

	.winner {
		background-color: #982c61;
		color: #f9f9f9;
	}
</style>
