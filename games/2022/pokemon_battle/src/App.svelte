<script>
	let player = {
		"shape": "circle1",
		"power": 1000
	}
	let computer = {
		"shape": "triangle2",
		"power": 1000
	}

	const image = player => `shapes/${player.shape}.png`
	const alt = player => `Shape: ${player.shape}`
</script>

<h1>Turn Battle</h1>
<hr>

<h3>Computer: OpenBSD riscv64</h3>
<img src={image(computer)} alt={alt(computer)}>
<p>Power: {computer.power}</p>

<hr>

<h3>Player: {navigator.platform}</h3>
<img src={image(player)} alt={alt(player)}>
<p>Power: {player.power}</p>

<hr>
<p>by Michael Skyba</p>

<style>
	img {
		max-width: 100px;
	}
</style>
