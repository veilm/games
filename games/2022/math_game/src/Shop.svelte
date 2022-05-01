<script lang="ts">
	import YouWin from "./YouWin.svelte"
	import Purchase from "./Purchase.svelte"
	import Redirection from "./Redirection.svelte"
	export let redirUnlocked

	export let buy
	export let points
	export let progress

	export let startTime
	export let endTime

	let types = [
		"Addition",
		"Subtraction",
		"Multiplication",
		"Division",
		"Exponents",
		"Factoring"
	]
</script>

{#if progress <= 7}
	<Purchase
		{buy}
		{points}
		{progress}
	/>
{:else}
	<YouWin {startTime} {endTime} />
{/if}

{#if redirUnlocked}
	<Redirection
		{types}
		bind:points={points}
	/>
{/if}

<hr>

<label for="earned_points">Earned points:</label>
<ul id="earned_points">
{#each types as type}
	{#if points[type] > 0}
		<li>{points[type]} {type}</li>
	{/if}
{/each}
</ul>
