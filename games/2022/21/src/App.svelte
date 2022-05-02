<script>
	let screen = "Selection"
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
