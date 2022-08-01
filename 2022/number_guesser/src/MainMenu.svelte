<script>
	import MenuButton from "./MenuButton.svelte"
	export let screen
</script>

<MenuButton bind:screen={screen} change="Player Guess" />
<MenuButton bind:screen={screen} change="Computer Guess" />
<MenuButton bind:screen={screen} change="Config" />
