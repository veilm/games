<script>
	import Setup from "./Setup.svelte"
	import Game from "./Game.svelte"

	let screen = "Setup"
	let players = ["X", "O"]
</script>

<h1>Tic-Tac-Toe</h1>
<hr>

{#if screen == "Setup"}
	<Setup
		bind:screen={screen}
		bind:players={players}
	/>
{:else}
	<Game bind:players={players} />
{/if}

<hr>
<p>by Michael Skyba</p>
