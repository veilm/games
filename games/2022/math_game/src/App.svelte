<script lang="ts">
	import MainMenu from "./MainMenu.svelte"

	let unlockedScreens = {
		"Addition": true,
		"Subtraction": false,
		"Multiplication": false,
		"Division": true,
		"Exponents": false,
		"Roots": false,
		"Factoring": true,
		"Shop": true
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
{:else}
	<p>Not Main menu</p>
{/if}

<hr>
<p>by Michael Skyba</p>
