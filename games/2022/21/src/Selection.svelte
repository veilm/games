<script>
	export let players

	let input = ""
	let error = ""

	const submit = () => {
		players = input.split("\n")

		if (players.length < 2) {
			error = "Error: You need at least two players."
			return
		}

		for (const player of players) {
			if (player == "") {
				error = "Error: No name may be blank."
				return
			}
		}

		console.log(players)
	}
</script>

<textarea
	placeholder="Write the names of each player, using one line per player."
	bind:value={input}
/>

<p>{error}</p>

<input type="button" value="Submit" on:click={submit}>

<style>
	textarea {
		width: 400px;
		height: 100px;
	}
</style>
