<script>
	export let config
	export let label
	export let type
	export let updateConfig
</script>

<label for={type}>{label}</label>
<input
	id={type}
	on:change={event => {
		let updated = config
		config[type] = event.target.value

		updateConfig(updated)
	}}
	type="number"
	value={config[type]}
>
