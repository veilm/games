<script lang="ts">
	import MainMenu from "./MainMenu.svelte"
	import MathComponent from "./Math.svelte"

	let unlockedScreens = {
		"Addition": true,
		"Subtraction": true,
		"Multiplication": true,
		"Division": true,
		"Exponents": true,
		"Factoring": false,
		"Shop": true
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

	let unlockedFeatures = {
		"difficulty": false,
		"redirection": false
	}

	let screen = "Main menu"
</script>

<h1>Arithmetic Game: {screen}</h1>
<p>Don't use a calculator.</p>
<hr>

{#if screen == "Main menu"}
	<MainMenu {unlockedScreens} bind:screen={screen} />
{:else if screen == "Shop"}
	<!-- <Shop /> -->
{:else}
	<MathComponent {questions} {RNG} {screen} />
{/if}

<hr>
<p>by Michael Skyba</p>
