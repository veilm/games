<script>
	import Player from "./Player.svelte"
	import Log from "./Log.svelte"

	const RNG = (min, max) => {
		return Math.round(Math.random() * (max - min)) + min
	}

	let player = {
		"name": `Player: ${navigator.platform}`,
		"shape": ["circle", "square", "triangle"][RNG(0, 2)],
		"level": 0,
	}

	let log = [
		"Assigned shape: " + player.shape,
		"Game start"
	]

	if (player.shape == "triangle") player.power = 1350
	if (player.shape == "square") player.hp = 4

	let computerNames = ["Ubuntu", "Arch", "OpenBSD"]
	let computer = {
		"shape": "computer",
		"level": 0,
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

		let p2 = RNG(0, Math.min(player.power, computer.power))

		player.power -= p
		computer.power -= p2

		let outcome = []
		if (p > p2) {
			let c = 1
			if (player.shape == "circle") c = 1 + (0.1 * player.level)

			outcome = [
				`Computer loses ${c} HP`,
				`Player gains ${c} HP`,
				"Player wins exchange"
			]

			computer.hp -= c
			player.hp += c
		}

		else if (p2 > p) {
			let c = 1
			if (player.shape == "circle") c = 1 - (0.1 * player.level)

			outcome = [
				`Player loses ${c} HP`,
				`Computer gains ${c} HP`,
				"Computer wins exchange"
			]

			player.hp -= c
			computer.hp += c
		}

		else outcome = ["Tied exchange"]

		if (player.hp < 0) outcome = ["Player loses", ...outcome]
		if (computer.hp < 0) outcome = ["Computer loses", ...outcome]

		// Fix "Life: 1.2000000000000002"
		player.hp = Math.round(player.hp * 100)/100
		computer.hp = Math.round(computer.hp * 100)/100

		log = [
			...outcome,
			`Player bets ${p}`,
			`Computer bets ${p2}`,
			...log
		]
	}

	const nextLevel = () => {
		player.level++
		player.power = 1000
		player.hp = 3

		if (player.shape == "triangle") player.power += 350 * player.level
		if (player.shape == "square") player.hp += player.level

		computer.level++
		computer.power = 1000 + 1000 * computer.level
		computer.hp = 3 + computer.level * 2

		computer.name = "Computer: " + computerNames[computer.level-1]

		expended = null
	}
	nextLevel()

	document.onkeydown = e => {
		if (e.code == "Enter" && computer.hp > 0 && player.hp > 0) expend()
	}
</script>

<h1>Turn Battle</h1>
<hr>

<Player player={computer} />
<hr>
<Player player={player} />

{#if computer.hp > 0 && player.hp > 0}
	<input type="number" placeholder="Power" bind:value={expended}>
	<input type="button" value="Expend" on:click={expend}>
{:else if computer.hp <= 0 && player.level < 3}
	<input type="button" value="Continue to next level" on:click={nextLevel}>
{:else if computer.hp <= 0 && player.level == 3}
	<h3>You win!</h3>
	<p>You have killed all three operating systems. Does this mean that you are
	a good player? Or did you simply push through until luck spared you? If you
	are truly skilled, you should be able to win with each of the three shapes
	back to back. The game is somewhat luck-based but not so luck-based that
	this is impossible if you figure out the optimal strategy.</p>
{/if}

<Log {log} />

<hr>
<p>by Michael Skyba</p>
