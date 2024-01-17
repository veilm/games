interface Coordinate {
	x: number
	y: number
}

interface Microbe {
	dx: number,
	dy: number,
}

class Environment {
	width = 1000
	height = 500

	microbeCoordinates = new Map<Coordinate, Set<Microbe>>()
	bacteria = new Set<Coordinate>()

	addMicrobe(x: number, y: number) {
		const dx = 1
		const dy = 1

		const microbe = new Set([{dx: dx, dy: dy}])
		const cell = {x: x, y: y}

		this.microbeCoordinates.set(cell, microbe)
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

		for (const pair of environment.microbeCoordinates) {
			const cell = pair[0]
			this.frect(cell.x - 2, cell.y - 2, 4, 4, "#119911")
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

environment.addMicrobe(10, 10)
environment.addMicrobe(100, 100)
environment.addMicrobe(250, 250)

c.draw()
