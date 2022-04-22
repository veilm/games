<script>
	import MenuButton from "./MenuButton.svelte"
	import ConfigInput from "./ConfigInput.svelte"

	export let screen
	export let config
	export let updateConfig
</script>

<ConfigInput
	{config}
	label="Range: min"
	type="min"
	{updateConfig}
/>

<ConfigInput
	{config}
	label="Range: max"
	type="max"
	{updateConfig}
/>

<ConfigInput
	{config}
	label="Secret number"
	type="secret"
	{updateConfig}
/>

<p>Your input will be ignored if any of your values aren't numbers, if your
min value is not less than your max value, or if your secret is outside your
range. They're supposed to be integers, so any decimal will be rounded down.</p>

<MenuButton bind:screen={screen} change="Main Menu" />

<style>
	p {
		margin: 10px 0;
	}
</style>
