<script lang="ts">
	export let screen
	export let progress
	export let points

	let types = [
		"Addition",
		"Subtraction",
		"Multiplication",
		"Division",
		"Exponents",
		"Factoring"
	]
</script>

<ul>
{#each types as type}
	{#if points[type] > 0}
		<li>{type} points: {points[type]}</li>
	{/if}
{/each}
</ul>
