<script>
	export let player

	const image = player => `shapes/${player.shape}.png`
	const alt = player => `Shape: ${player.shape}`
</script>

<h3>{player.name}</h3>
<img src={image(player)} alt={alt(player)}>
<p>
	Power: {player.power}
	<br>
	Life: {player.hp}
</p>

<style>
	img {
		max-width: 100px;
	}
</style>
