<script>
	import Selection from "./Selection.svelte"
	import Game from "./Game.svelte"

	let screen = "Selection"
	let players = []
</script>

<h1>21: {screen}</h1>
<hr>

{#if screen = "Selection"}
	<Selection bind:players={players} />
{:else}
	<Game />
{/if}

<hr>
<p>by Michael Skyba</p>
