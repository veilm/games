function getId(id) {
    return document.getElementById(id)
}

function hide(element) {
	element.style.display = "none"
}

function show(element) {
	element.style.display = "block"
}

function disable(b) {
	b.disabled = true
}

const prologue = {
	b1: getId("b1-1"),
	content: getId("s1"),

	progress() {
		hide(this.content)
		show(morningOpening.alarm.content)
	}
}
prologue.b1.onclick = prologue.progress.bind(prologue)

const morningOpening = {
	alarm: {
		b1: getId("b2-1"),
		b2: getId("b2-2"),
		content: getId("s2"),

		init() {
			this.b1.onclick = this.progressStandard.bind(this)
		},

		// Standard timeline
		progressStandard() {
			disable(this.b1)
			show(morningOpening.main.content)
		},

		// True ending
		progressTrue() {
			disable(this.b1)
			disable(this.b2)
		}
	},

	main: {
		content: getId("s3"),
		buttons: [
			getId("b3-1"),
			getId("b3-2"),
			getId("b3-3")
		],

		handleOption(option) {
			show(morningOpening[option].content)
			this.buttons.forEach(b => {
				disable(b)
			})
			show(morningOpening.progress.content)
		},

		init() {
			this.buttons[0].onclick = function() {
				this.handleOption("weather")
			}.bind(this)
			this.buttons[1].onclick = function() {
				this.handleOption("stocks")
			}.bind(this)
			this.buttons[2].onclick = function() {
				this.handleOption("meditation")
			}.bind(this)
		}
	},

	weather: {
		content: getId("s3-1")
	},

	stocks: {
		content: getId("s3-2")
	},

	meditation: {
		content: getId("s3-3")
	},

	progress: {
		content: getId("s3-4"),
		b: getId("b3-4"),

		progress() {
			hide(morningOpening.alarm.content)
			hide(morningOpening.main.content)
			hide(morningOpening.weather.content)
			hide(morningOpening.stocks.content)
			hide(morningOpening.meditation.content)
			hide(this.content)

			console.log("Done")
		},

		init() {
			this.b.onclick = this.progress.bind(this)
		}
	},

	init() {
		this.alarm.init()
		this.main.init()
		this.progress.init()
	}
}
morningOpening.init()
