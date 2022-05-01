<script lang="ts">
	export let types

	let redirTarget = "Addition"

	const redirAvailable = target => {
		if (target == "Subtraction") return false
		else return true
	}

	const redirect = target => {
		console.log(target)
	}
</script>

<hr>

<h3>Redirection</h3>

<span>Towards</span>
<select bind:value={redirTarget}>
	{#each types as type}
		<option value={type}>{type}</option>
	{/each}
</select>

<br>

<input
	type="button"
	value="Redirect"
	on:click={redirect(redirTarget)}
	disabled={!redirAvailable(redirTarget)}
>

<style>
	select {
		margin-left: 10px;
	}
</style>
