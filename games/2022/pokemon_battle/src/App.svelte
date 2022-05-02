<script>
	import Player from "./Player.svelte"
	import Log from "./Log.svelte"

	let log = [
		"Game start"
	]

	let player = {
		"name": `Player: ${navigator.platform}`,
		"shape": "circle1",
		"hp": 3,
		"power": 1000
	}
	let computer = {
		"name": "Computer: OpenBSD riscv64",
		"shape": "triangle2",
		"hp": 3,
		"power": 1000
	}

	const RNG = (min, max) => {
		return Math.round(Math.random() * (max - min)) + min
	}

	let expended
	const expend = () => {
		let p = parseInt(expended)
		if (Number.isNaN(p) || p > player.power || p < 0) {
			// We need log = <> for it to count as updated
			log = [`Invalid power provided: ${expended}`, ...log]
			return
		}

		// We could cheat and have p2 = p + 1 but that would be unfair.

		let p2 = RNG(0, computer.power)

		player.power -= p
		computer.power -= p2

		let outcome = []
		if (p > p2) {
			outcome = [
				"Computer loses 1 HP",
				"Player gains 1 HP",
				"Player wins exchange"
			]

			computer.hp--
			player.hp++
		}

		else if (p2 > p) {
			outcome = [
				"Player loses 1 HP",
				"Computer gains 1 HP",
				"Computer wins exchange"
			]

			player.hp--
			computer.hp++
		}

		else outcome = ["Tied exchange"]

		log = [
			...outcome,
			`Player bets ${p}`,
			`Computer bets ${p2}`,
			...log
		]
	}
</script>

<h1>Turn Battle</h1>
<hr>

<Player player={computer} />
<hr>
<Player player={player} />

<input type="number" placeholder="Power" bind:value={expended}>
<input type="button" value="Expend" on:click={expend}>

<Log {log} />

<hr>
<p>by Michael Skyba</p>
