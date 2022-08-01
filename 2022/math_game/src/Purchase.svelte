<script>
	export let buy
	export let points
	export let progress

	const requirements = [
		["15 Addition"],
		["10 Addition", "20 Subtraction"],
		["15 Addition", "15 Subtraction", "20 Multiplication"],
		["5 Addition", "5 Subtraction", "15 Multiplication", "20 Division"],
		["35 Addition", "45 Subtraction", "55 Multiplication", "60 Division"],
		["50 Multiplication", "50 Division", "100 Exponents"],
		["50 Multiplication", "50 Exponents", "75 Roots"],
		["150 Subtraction", "300 Roots"]
	]

	const isBuyable = (progress, points) => {
		let add = points["Addition"]
		let sub = points["Subtraction"]
		let mul = points["Multiplication"]
		let div = points["Division"]
		let exp = points["Exponents"]
		let roo = points["Roots"]

		return [
			add >= 15,
			add >= 10 && sub >= 20,
			add >= 15 && sub >= 15 && mul >= 20,
			add >=  5 && sub >= 5  && mul >= 15 && div >= 20,
			add >= 35 && sub >= 45 && mul >= 55 && div >= 60,
			mul >= 50 && div >= 50 && exp >= 100,
			mul >= 50 && exp >= 50 && roo >= 75,

			sub >= 150 && roo >= 300
		][progress]
	}
</script>

<label for="required_points">Requirements:</label>
<ul id="required_points">
	{#each requirements[progress] as requirement}
		<li>{requirement}</li>
	{/each}
</ul>
<input
	type="button"
	value="Purchase"
	disabled={!isBuyable(progress, points)}
	on:click={buy}
>
