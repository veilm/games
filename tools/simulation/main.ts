// Decimal
const RNG = (min: number, max: number) => Math.random() * (max - min) + min

interface Directions {
	[key: number]: {
		dx: number
		dy: number
	}
}

interface RotationEnergy {
	[key: number]: number
}

class Config {
	pxScale = 5

	width = 200
	height = 100

	// Duration (ms)
	stepLength = 16

	// After how many ms to skip the step update
	// Useful if switching tabs or lagging for a while
	// Otherwise you'll have an enormous update at once
	skipTime = 1000 * 5

	// Energy change (lose) per step
	stepEnergy = -1

	// How much additional energy is spent for different rotations
	rotEnergy: RotationEnergy = {
		0: 0,

		1: -1,
		7: -1,

		2: -2,
		6: -2,

		3: -4,
		5: -4,

		4: -8,
	}

	// Change in energy from consuming bacterium
	bctEnergy = 1000

	// 8-grid, starting top left, going clockwise
	// Negative y: up
	// Positive y: down
	dirs: Directions = {
		// Top
		0: {dx: -1, dy: -1},
		1: {dx: 0, dy: -1},
		2: {dx: 1, dy: -1},

		// Right
		3: {dx: 1, dy: 0},

		// Bottom
		4: {dx: 1, dy: 1},
		5: {dx: 0, dy: 1},
		6: {dx: -1, dy: 1},

		// Left
		7: {dx: -1, dy: 0},
	}
}
const cfg = new Config()

// Prot: protozoan
// Plural "protozoa"
// (Microbes that evolve to eat bacteria)
interface Prot {
	x: number
	y: number

	dir: number

	genome: number[]
	energy: number
}

class Environment {
	// Timestamp (ms) after first step
	lastStep = 0

	protozoa = new Set<Prot>()
	bacteria = new Map<number, Set<number>>()

	mutateGene(genome: number[], geneIdx: number, variance: number) {
		// How much will be added to gene
		let mod = 0

		// How much will be added to other genes, to compensate
		let otherMod = 0

		let valid = false
		while (!valid) {
			mod = RNG(-variance, variance)
			otherMod = -mod/(8-1)

			valid = true

			if (mod + genome[geneIdx] < 0)
				valid = false

			for (let i = 0; valid && i < 8; i++) {
				if (i == geneIdx)
					continue

				if (genome[i] + otherMod < 0)
					valid = false
			}
		}

		genome[geneIdx] += mod
		for (let i = 0; i < 8; i++) {
			if (i == geneIdx)
				continue

			genome[i] += otherMod
		}
	}

	randomGenome() {
		// return [0.5, 0.5, 0, 0, 0, 0, 0, 0]

		const genome: number[] = []

		// Start with equal distribution
		for (let i = 0; i < 8; i++)
			genome.push(1/8)

		for (let i = 0; i < 8; i++)
			this.mutateGene(genome, i, 1/8)

		return genome
	}

	addProt() {
		this.protozoa.add({
			x: cfg.width/2, y: cfg.height/2,
			genome: this.randomGenome(),
			dir: Math.round(RNG(0, 7)),
			energy: 1000
		})
	}

	addBct() {
		const x = Math.round(RNG(0, cfg.width))
		const y = Math.round(RNG(0, cfg.height))

		if (!this.bacteria.has(x))
			this.bacteria.set(x, new Set<number>())

		this.bacteria.get(x)!.add(y)
	}

	// Returns change in index of dirs
	// Emergent change in behaviour:
	// 0: No change
	// 1: Slight right turn
	// 2: Moderate right turn
	// 3: Hard right turn
	// 4: Reverse
	// 5: Hard left turn
	// 6: Moderate left turn
	// 7: Slight left turn
	getDirChange(prot: Prot) {
		const threshold = RNG(0, 1)

		let sum = 0
		let i = 0

		for (; sum < threshold && i < 8; i++)
			sum += prot.genome[i]

		return i-1
	}

	checkBct(prot: Prot) {
		if (!this.bacteria.has(prot.x))
			return

		if (!this.bacteria.get(prot.x)!.delete(prot.y))
			return

		prot.energy += cfg.bctEnergy
	}

	step() {
		for (const prot of this.protozoa) {
			const dirChange = this.getDirChange(prot)

			prot.energy += cfg.stepEnergy + cfg.rotEnergy[dirChange] * 3
			if (prot.energy <= 0)
				this.protozoa.delete(prot)

			prot.dir = (prot.dir + dirChange) % 8
			const dir = cfg.dirs[prot.dir]

			prot.x += dir.dx
			prot.y += dir.dy

			// We're assuming you can't go back more than two screenfuls
			// in one step.
			if (prot.x < 0)
				prot.x += cfg.width
			if (prot.y < 0)
				prot.y += cfg.height

			prot.x = prot.x % cfg.width
			prot.y = prot.y % cfg.height

			this.checkBct(prot)
		}

		c.draw()
	}

	frameStep(time: number) {
		if (!this.lastStep) {
			this.step()
			this.lastStep = time
		}

		let elapsed = time - this.lastStep

		if (elapsed > cfg.skipTime)
			elapsed = cfg.stepLength + 1

		if (elapsed > cfg.stepLength)
			this.lastStep = time

		while (elapsed > cfg.stepLength) {
			this.step()
			elapsed -= cfg.stepLength
		}

		window.requestAnimationFrame(this.frameStep)
	}

	start = () => window.requestAnimationFrame(this.frameStep)
}

const environment = new Environment()
environment.step = environment.step.bind(environment)
environment.frameStep = environment.frameStep.bind(environment)

class Canvas {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D

	frect(x: number, y: number, w: number, h: number, colour: string) {
		this.context.fillStyle = colour
		this.context.fillRect(x, y, w, h)
	}

	draw() {
		this.frect(0, 0, cfg.width * cfg.pxScale, cfg.height * cfg.pxScale, "#eeeeff")

		for (const bctX of environment.bacteria) {
			const x = bctX[0] * cfg.pxScale

			for (const bctY of bctX[1]) {
				const y = bctY * cfg.pxScale
				this.frect(x, y, cfg.pxScale, cfg.pxScale, "#ff0000")
			}
		}

		for (const prot of environment.protozoa) {
			const x = prot.x * cfg.pxScale
			const y = prot.y * cfg.pxScale
			this.frect(x, y, cfg.pxScale, cfg.pxScale, "#000")
		}
	}

	constructor() {
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement
		this.canvas.width = cfg.width * cfg.pxScale
		this.canvas.height = cfg.height * cfg.pxScale

		this.context = this.canvas.getContext("2d")!
	}
}

const c = new Canvas()

for (let i = 0; i < 300; i++) {
	environment.addProt()
	environment.addBct()
}

environment.start()

// environment.protozoa.add({
// 	x: 0, y: 0,
// 	genome: [1, 0, 0, 0, 0, 0, 0, 0],
// 	dir: 0,
// 	energy: 1000
// })
