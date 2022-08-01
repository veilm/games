<script>
	import MainMenu from "./MainMenu.svelte"
	import Config from "./Config.svelte"

	import Player from "./Player.svelte"
	import Computer from "./Computer.svelte"

	import ConfigList from "./ConfigList.svelte"
	import Score from "./Score.svelte"

	let screen = "Main Menu"
	let config = {
		min: 1,
		max: 100,
		secret: 68
	}

	let score = {
		player: {
			high: 0,
			medium: 0,
			low: 0
		},
		computer: {
			high: 0,
			medium: 0,
			low: 0
		}
	}

	const getPerformance = guesses => {
		let range = config.max - config.min + 1
		let medium = Math.floor(Math.log(range) / Math.log(2)) + 1

		if (guesses == medium) performance = "medium"
		else if (guesses < medium) performance = "high"
		else performance = "low"

		return performance
	}

	const handleWin = (candidate, performance) => {
		score[candidate][performance]++
	}

	const changeScreen = updated => {screen = updated}

	const updateConfig = updated => {
		let min = parseInt(updated.min)
		let max = parseInt(updated.max)
		let secret = parseInt(updated.secret)

		let valid = true

		if (isNaN(min) || isNaN(max) || isNaN(secret)) valid = false
		if (valid && min >= max) valid = false
		if (valid && (secret < min || secret > max)) valid = false

		if (valid) config = {
			min: min,
			max: max,
			secret: secret
		}
	}


</script>

<h3>Number Guesser: {screen}</h3>
<hr>

{#if screen == "Main Menu"}
	<MainMenu bind:screen={screen} />

{:else if screen == "Config"}
	<Config
		{config}
		{updateConfig}
		bind:screen={screen}
	/>

{:else if screen == "Player Guess"}
	<Player
		{config}
		{handleWin}
		{getPerformance}
		bind:screen={screen}
	/>

{:else if screen == "Computer Guess"}
	<Computer
		{config}
		{handleWin}
		{getPerformance}
		bind:screen={screen}
	/>

{/if}

<hr>
<ConfigList {config} />
<Score candidate="Player" data={score.player} />
<Score candidate="Computer" data={score.computer} />

<hr>
<p>by Michael Skyba</p>
