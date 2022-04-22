<script>
	export let data
	export let candidate
	let sum

	$: {
		sum = data["high"] + data["medium"] + data["low"]
		if (sum == 0) sum = 1 // Avoid division by zero
	}

	$: percents = {
		high: parseInt(data["high"] / sum * 100),
		medium: parseInt(data["medium"]  / sum * 100),
		low: parseInt(data["low"]  / sum * 100)
	}
</script>

<p>{candidate}'s stats:</p>
<ul>
	<li>High performance: ~{percents["high"]}%</li>
	<li>Medium performance: ~{percents["medium"]}%</li>
	<li>Low performance: ~{percents["low"]}%</li>
</ul>

<style>
	p {
		margin: 0;
	}
</style>
