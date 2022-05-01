<script lang="ts">
	// export let screen
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

	const requirements = [
		["15 Addition"],
		["10 Addition", "20 Subtraction"],
		["15 Addition", "15 Subtraction", "20 Multiplication"],
		["5 Addition", "5 Subtraction", "15 Multiplication", "20 Division"],
		["35 Addition", "45 Subtraction", "55 Multiplication", "60 Division"],
		["50 Multiplication", "50 Division", "100 Exponents"],
		["50 Multiplication", "50 Exponents", "75 Factoring"],
		["150 Subtraction", "300 Factoring"]
	]

	const isBuyable = (progress, points) => {
		let add = points["Addition"]
		let sub = points["Subtraction"]
		let mul = points["Multiplication"]
		let div = points["Division"]
		let exp = points["Exponents"]
		let fac = points["Factoring"]

		return [
			add >= 15,
			add >= 10 && sub >= 20,
			add >= 15 && sub >= 15 && mul >= 20,
			add >=  5 && sub >= 5  && mul >= 15 && div >= 20,
			add >= 35 && sub >= 45 && mul >= 55 && div >= 60,
			mul >= 50 && div >= 50 && exp >= 100,
			mul >= 50 && exp >= 50 && fac >= 75,

			sub >= 150 && fac >= 300
		][progress]
	}

	const buy = () => {
		switch (progress) {
			case 0:
				points["Addition"] -= 15
				break

			case 1:
				points["Addition"] -= 10
				points["Subtraction"] -= 20
				break

			case 2:
				points["Addition"] -= 15
				points["Subtraction"] -= 15
				points["Multiplication"] -= 20
				break

			case 3:
				points["Addition"] -= 5
				points["Subtraction"] -= 5
				points["Multiplication"] -= 15
				points["Division"] -= 20
				break

			case 4:
				points["Addition"] -= 35
				points["Subtraction"] -= 45
				points["Multiplication"] -= 55
				points["Division"] -= 60
				break

			case 5:
				points["Multiplication"] -= 50
				points["Division"] -= 50
				points["Exponents"] -= 100
				break

			case 6:
				points["Multiplication"] -= 50
				points["Exponents"] -= 50
				points["Factoring"] -= 75
				break

			case 7:
				points["Subtraction"] -= 150
				points["Factoring"] -= 300
				break
		}

		progress++
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

<hr>

<label for="earned_points">Earned points:</label>
<ul id="earned_points">
{#each types as type}
	{#if points[type] > 0}
		<li>{points[type]} {type}</li>
	{/if}
{/each}
</ul>
