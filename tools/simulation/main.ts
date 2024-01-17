const canvas = document.getElementById("canvas")! as HTMLCanvasElement
const c = canvas.getContext("2d") as CanvasRenderingContext2D

const frect = () => {
	c.fillStyle = "maroon"
	c.fillRect(0, 0, canvas.width, canvas.height)

	console.log("Done")
}

const init = () => {
	canvas.width = 1000
	canvas.height = 500

	frect()
}

init()
