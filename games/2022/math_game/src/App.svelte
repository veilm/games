<script lang="ts">
	import MainMenu from "./MainMenu.svelte"
	import Math from "./Math.svelte"

	let unlockedScreens = {
		"Addition": true,
		"Subtraction": false,
		"Multiplication": false,
		"Division": false,
		"Exponents": false,
		"Roots": false,
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
		}
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
	<Math {questions} />
{/if}

<hr>
<p>by Michael Skyba</p>
