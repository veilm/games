<script>
	export let log
</script>

<hr>
<h3>Log (newest first)</h3>
<div>
	<ol>
	{#each log as entry}
		<li>{entry}</li>
	{/each}
	</ol>
</div>

<style>
	div {
		max-height: 200px;
		overflow-y: scroll;
	}
</style>
