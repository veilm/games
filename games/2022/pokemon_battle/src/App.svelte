<script>
	import Player from "./Player.svelte"

	let player = {
		"name": `Player: ${navigator.platform}`,
		"shape": "circle1",
		"hp": 3,
		"power": 1000
	}
	let computer = {
		"name": "Computer: OpenBSD riscv64",
		"shape": "triangle2",
		"hp": 3,
		"power": 1000
	}
</script>

<h1>Turn Battle</h1>
<hr>

<Player player={computer} />
<hr>
<Player player={player} />

<input type="number" placeholder="Power">
<input type="button" value="Expend">

<hr>
<p>by Michael Skyba</p>
