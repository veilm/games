<script lang="ts">
	import MainMenu from "./MainMenu.svelte"

	let screen = "Main menu"
</script>

<h1>Arithmetic Game: {screen}</h1>
<p>Don't use a calculator.</p>
<hr>

{#if screen == "Main menu"}
	<MainMenu />
{:else}
	<p>Not Main menu</p>
{/if}

<hr>
<p>by Michael Skyba</p>
