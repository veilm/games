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

	frect() {
		this.context.fillStyle = "maroon"
		this.context.fillRect(0, 0, environment.width, environment.height)
	}

	constructor() {
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement
		this.canvas.width = environment.width
		this.canvas.height = environment.height

		this.context = this.canvas.getContext("2d")!
	}
}

const c = new Canvas()
c.frect()
