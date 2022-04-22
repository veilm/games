<script>
	export let change
	export let screen
</script>

<input
	type="button"
	on:click={() => {screen = change}}
	value={change}
>
