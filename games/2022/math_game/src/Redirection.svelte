<script lang="ts">
	export let types
	export let points

	let redirTarget = "Addition"

	let enabled
	$: {
		enabled = redirAvailable(redirTarget)
	}

	const redirAvailable = target => {
		for (const type of types) {
			if (type == target) continue
			if (points[type] < 1) return false
		}
		return true
	}

	const redirect = target => {
		for (const type of types) {
			if (type == target) continue
			points[type]--
		}

		points[target] += 5
		enabled = redirAvailable(redirTarget)
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
	disabled={!enabled}
>

<style>
	select {
		margin-left: 10px;
	}
</style>
