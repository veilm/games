<script lang="ts">
	import MainMenu from "./MainMenu.svelte"
	import MathComponent from "./Math.svelte"
	import Shop from "./Shop.svelte"

	// "progress" increases with each Shop upgrade. progress = 0 means you only
	// have addition unlocked, progress = 4 means difficulty was unlocked, etc.
	let progress = 0

	let unlockedScreens = {
		"Addition": true,
		"Subtraction": true,
		"Multiplication": true,
		"Division": true,
		"Exponents": true,
		"Factoring": false,
		"Shop": true
	}

	let points = {
		"Addition": 25,
		"Subtraction": 40,
		"Multiplication": 0,
		"Division": 0,
		"Exponents": 10,
		"Factoring": 0
	}

	let unlockedFeatures = {
		"difficulty": false,
		"redirection": false
	}

	const RNG = (min, max) => {
		return Math.round(Math.random() * (max - min)) + min
	}

	const questions = {
		"Addition": (a, b) => {
			return {
				"question": `${a} + ${b} = _`,
				"answer": a + b
			}
		},
		"Subtraction": (a, b) => {
			return {
				"question": `${a + b} - ${b} = _`,
				"answer": a
			}
		},
		"Multiplication": (a, b) => {
			return {
				"question": `${a} × ${b} = _`,
				"answer": a * b
			}
		},
		"Division": (a, b) => {
			return {
				"question": `${a * b} ÷ ${b} = _`,
				"answer": a
			}
		},
		"Exponents": (a, b) => {
			return {
				"question": `${a}^${b} = _`,
				"answer": Math.pow(a, b)
			}
		},
	}

	const buy = () => {
		switch (progress) {
			case 0:
				points["Addition"] -= 15
				break

			case 1:
				points["Addition"] -= 10
				points["Subtraction"] -= 20
				break

			case 2:
				points["Addition"] -= 15
				points["Subtraction"] -= 15
				points["Multiplication"] -= 20
				break

			case 3:
				points["Addition"] -= 5
				points["Subtraction"] -= 5
				points["Multiplication"] -= 15
				points["Division"] -= 20
				break

			case 4:
				points["Addition"] -= 35
				points["Subtraction"] -= 45
				points["Multiplication"] -= 55
				points["Division"] -= 60
				break

			case 5:
				points["Multiplication"] -= 50
				points["Division"] -= 50
				points["Exponents"] -= 100
				break

			case 6:
				points["Multiplication"] -= 50
				points["Exponents"] -= 50
				points["Factoring"] -= 75
				break

			case 7:
				points["Subtraction"] -= 150
				points["Factoring"] -= 300
				break
		}

		progress++
	}

	let screen = "Main menu"
</script>

<h1>Arithmetic Game: {screen}</h1>
<p>Don't use a calculator.</p>
<hr>

{#if screen == "Main menu"}
	<MainMenu {unlockedScreens} bind:screen={screen} />
{:else if screen == "Shop"}
	<Shop
		bind:progress={progress}
		{buy}
		{points}
		bind:screen={screen}
	/>
{:else}
	<MathComponent {questions} {RNG} {screen} bind:points={points} />
{/if}

<hr>
<p>by Michael Skyba</p>
