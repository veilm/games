<script>
	export let back
	export let updateSetting

	export let style
	export let max

	let styles = [style, "Black", "Numbers"]
	styles[["Red", "Black", "Numbers"].indexOf(style)] = "Red"
</script>

<label for="style">Style</label>
<select id="style" on:input={updateSetting("style", this.value)}>
	<option value={styles[0]} selected>{styles[0]}</option>
	<option value={styles[1]}>{styles[1]}</option>
	<option value={styles[2]}>{styles[2]}</option>
</select>
<br>

{#if style == "Numbers"}
	<label for="max">Maximum roll</label>
	<input on:input={updateSetting("max", this.value)} type="number" value={max}>
	<p>1000 > x > 0<br>x ∈ Z</p>
{/if}

<input on:click={back} type="button" value="Back">

<style>
	label {
		display: inline;
		margin-right: 10px;
	}

	select {
		margin-bottom: 20px;
	}

	p {
		margin-bottom: 10px;
	}
</style>
