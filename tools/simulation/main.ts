const width = 1000
const height = 500

class Canvas {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D

	frect() {
		this.context.fillStyle = "maroon"
		this.context.fillRect(0, 0, width, height)
	}

	constructor() {
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement
		this.canvas.width = width
		this.canvas.height = height

		this.context = this.canvas.getContext("2d")!
	}
}

const c = new Canvas()
c.frect()
