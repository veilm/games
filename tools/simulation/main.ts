interface Coordinate {
	x: number
	y: number
}

class Environment {
	width = 1000
	height = 500

	microbes = new Set<Coordinate>()
	bacteria = new Set<Coordinate>()
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

		for (const microbe of environment.microbes) {
			this.frect(microbe.x - 2, microbe.y - 2, 4, 4, "#119911")
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

environment.microbes.add({x: 10, y: 10})
environment.microbes.add({x: 100, y: 100})
environment.microbes.add({x: 250, y: 250})

c.draw()
