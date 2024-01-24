interface Coordinate {
	x: number
	y: number
}

interface Directions {
	[key: number]: {
		dx: number
		dy: number
	}
}

// 8-grid, starting top left, going clockwise
// Negative y: up
// Positive y: down
const dirs: Directions = {
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

// Prot: protozoan
// Plural "protozoa"
// (Microbes that evolve to eat bacteria)
interface Prot {
	x: number,
	y: number,

	// Index of dirs
	dir: number,
}

class Environment {
	width = 1000
	height = 500

	protozoa = new Set<Prot>()
	bacteria = new Set<Coordinate>()

	addProt(x: number, y: number, dir: number) {
		this.protozoa.add({x: x, y: y, dir: dir})
	}

	step() {
		for (const prot of this.protozoa) {
			const dir = dirs[prot.dir]
			prot.x += dir.dx * 5
			prot.y += dir.dy * 5
		}

		c.draw()

		window.requestAnimationFrame(this.step)
	}
}

const environment = new Environment()
environment.step = environment.step.bind(environment)

class Canvas {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D

	frect(x: number, y: number, w: number, h: number, colour: string) {
		this.context.fillStyle = colour
		this.context.fillRect(x, y, w, h)
	}

	draw() {
		this.frect(0, 0, environment.width, environment.height, "#dedeff")

		for (const prot of environment.protozoa) {
			this.frect(prot.x - 2, prot.y - 2, 4, 4, "#119911")
		}
	}

	constructor() {
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement
		this.canvas.width = environment.width
		this.canvas.height = environment.height

		this.context = this.canvas.getContext("2d")!
	}
}

const c = new Canvas()

environment.addProt(10, 10, 4)
environment.addProt(100, 100, 5)
environment.addProt(250, 250, 6)

window.requestAnimationFrame(environment.step)
