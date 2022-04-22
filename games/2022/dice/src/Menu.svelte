<script>
	export let selectScreen
</script>

<input on:click={selectScreen("Dice")} type="button" value="Dice">
<input on:click={selectScreen("Settings")} type="button" value="Settings">

<style>
	input[type="button"] {
		width: 100%;
		font-size: 20px;
		height: 60px;
	}
</style>
