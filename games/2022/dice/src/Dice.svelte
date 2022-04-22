<script>
	export let back
	export let style

	export let max
	if (style != "Numbers") max = 6

	function roll() {
		side = Math.round(Math.random() * (max-1))
	}

	let side = 0
</script>

{#if style == "Red"}
<img src="/r{side+1}.png" alt="Red die showing {side+1}">
{/if}

{#if style == "Black"}
<img src="/b{side+1}.png" alt="Black die showing {side+1}">
{/if}

{#if style == "Numbers"}
<p>{side+1}</p>
{/if}

<br>
<input on:click={roll} type="button" value="Roll">
<input on:click={back} type="button" value="Back">

<style>
	p {
		font-size: 60px;
		width: 100px;
		text-align: center;
		height: 100px;
		border: solid 2px black;
	}
</style>
