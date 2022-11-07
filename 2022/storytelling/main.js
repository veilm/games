/*
The code quality is not good but I am on a strict deadline so I have to take
tech debt
*/

let iteration = 3
// let iteration = 1

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

function resetScroll() {
	window.scrollTo(0, 0)
}

const prologue = {
	b1: getId("b1"),
	content: getId("s1"),

	progress() {
		hide(this.content)
		show(morningOpening.alarm.content)
	},

	init() {
		this.b1.onclick = this.progress.bind(this)
	}
}

const morningOpening = {
	alarm: {
		b1: getId("b2"),
		content: getId("s2"),

		progress() {
			disable(this.b1)
			show(morningOpening.main.content)
		},

		init() {
			this.b1.onclick = this.progress.bind(this)
		}
	},

	main: {
		content: getId("s3"),
		buttons: [
			getId("b3-1"),
			getId("b3-2"),
			getId("b3-3")
		],

		enabled: {
			weather: true,
			stocks: true,
			meditation: true
		},

		handleOption(option) {
			this.enabled[option] = false
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
		},

		setEnabled() {
			if (this.enabled.weather) this.buttons[0].disabled = false
			if (this.enabled.stocks) this.buttons[1].disabled = false
			if (this.enabled.meditation) this.buttons[2].disabled = false
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

			show(beforeWork.main.content)
			resetScroll()
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

const beforeWork = {
	main: {
		content: getId("s4"),

		options: [
			"wait",
			"uber",
			"home"
		],

		buttons: [
			getId("b4-1"),
			getId("b4-2"),
			getId("b4-3")
		],

		handleOption(option) {
			hide(this.content)
			disable(this.buttons[this.options.indexOf(option)])
			show(beforeWork[option].content)
			resetScroll()
		},

		init() {
			for (let i = 0; i < 3; i++) {
				this.buttons[i].onclick = function() {
					this.handleOption(this.options[i])
				}.bind(this)
			}
		}
	},

	wait: {
		content: getId("s4-1"),
		b: getId("b4-1-1"),

		progress() {
			hide(this.content)
			show(atWork.fromBus.content)
			resetScroll()
		},

		init() {
			this.b.onclick = this.progress.bind(this)
		}
	},

	uber: {
		content: getId("s4-2"),
		b: getId("b4-2-1"),

		progress() {
			hide(this.content)
			show(atWork.fromUber.content)
			resetScroll()
		},

		init() {
			this.b.onclick = this.progress.bind(this)
		}
	},

	home: {
		content: getId("s4-3"),
		b: getId("b4-3-1"),

		progress() {
			hide(this.content)
			death.show()
			resetScroll()
		},

		init() {
			this.b.onclick = this.progress.bind(this)
		}
	},

	init() {
		this.main.init()
		this.wait.init()
		this.uber.init()
		this.home.init()
	}
}

const atWork = {
	fromBus: {
		content: getId("s5-1"),
		b: getId("b5-1"),

		progress() {
			hide(this.content)
			death.show()
			resetScroll()
		},

		init() {
			this.b.onclick = this.progress.bind(this)
		}
	},

	fromUber: {
		content: getId("s5-2"),
		b: getId("b5-2"),

		progress() {
			hide(this.content)
			death.show()
			resetScroll()
		},

		init() {
			this.b.onclick = this.progress.bind(this)
		}
	},

	init() {
		this.fromBus.init()
		this.fromUber.init()
	}
}

const death = {
	content: getId("s6"),
	b1: getId("b6-1"),
	b2: getId("b6-2"),

	show() {
		show(this.content)
		if (iteration == 3) {
			hide(this.b1)
			show(this.b2)
		}
	},

	init() {
		this.b1.onclick = function() {
			hide(this.content)
			iteration++

			morningOpening.alarm.b1.disabled = false
			morningOpening.main.setEnabled()
			show(morningOpening.alarm.content)
			resetScroll()
		}.bind(this)
	}
}

prologue.init()
morningOpening.init()
beforeWork.init()
atWork.init()
death.init()

// Testing
/*
prologue.progress()
morningOpening.alarm.progress()
morningOpening.main.buttons[0].click()
morningOpening.progress.progress()
beforeWork.main.buttons[0].click()
beforeWork.wait.progress()
atWork.fromBus.progress()
*/
