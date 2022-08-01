<script>
	import Menu from "./Menu.svelte"
	import Dice from "./Dice.svelte"
	import Settings from "./Settings.svelte"

	let screen = "Main menu"
	let style = "Black"
	let max = 6

	function selectScreen(updated) {
		screen = updated
	}

	function back() {
		screen = "Main menu"
	}

	function updateSetting(setting, value) {
		if (setting == "max") {
			let num = parseInt(value)

			if (!isNaN(num) && num > 0 && num < 1000) max = num
		}
		else style = value
	}
</script>

<h1>Dice game: {screen}</h1>
<hr>

{#if screen == "Main menu"}
	<Menu {selectScreen} />
{/if} 

{#if screen == "Dice"}
	<Dice {back} {style} {max} />
{/if}

{#if screen == "Settings"}
	<Settings {back} {updateSetting} {style} {max} />
{/if}

<hr>
<p>by Michael Skyba</p>
