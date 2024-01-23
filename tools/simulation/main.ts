interface Coordinate {
	x: number
	y: number
}

// Prot: protozoan
// Plural "protozoa"
// (Microbes that evolve to eat bacteria)
interface Prot {
	x: number,
	y: number,

	dx: number,
	dy: number,
}

class Environment {
	width = 1000
	height = 500

	protozoa = new Set<Prot>()
	bacteria = new Set<Coordinate>()

	addProt(x: number, y: number) {
		const dx = 1
		const dy = 1

		this.protozoa.add({x: x, y: y, dx: dx, dy: dy})
	}
}

const environment = new Environment()

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

environment.addProt(10, 10)
environment.addProt(100, 100)
environment.addProt(250, 250)

c.draw()
