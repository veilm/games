/*
The code quality is not good but I am on a strict deadline so I have to take
tech debt
*/

let iteration = 1

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

const style = {
	sakura1: getId("sakura-1"),
	sakura2: getId("sakura-2")
}

const prologue = {
	b1: getId("b1"),
	content: getId("s1"),

	init() {
		this.b1.onclick = function() {
			hide(this.content)
			show(morningOpening.alarm.content)
		}.bind(this)
	}
}

const morningOpening = {
	alarm: {
		b1: getId("b2"),
		content: getId("s2"),

		init() {
			this.b1.onclick = function() {
				disable(this.b1)
				show(morningOpening.main.content)
			}.bind(this)
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

		init() {
			this.b.onclick = function() {
				hide(morningOpening.alarm.content)
				hide(morningOpening.main.content)
				hide(morningOpening.weather.content)
				hide(morningOpening.stocks.content)
				hide(morningOpening.meditation.content)
				hide(this.content)

				show(beforeWork.main.content)
				resetScroll()
			}.bind(this)
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

		init() {
			this.b.onclick = function() {
				hide(this.content)
				show(atWork.fromBus.content)
				resetScroll()
			}.bind(this)
		}
	},

	uber: {
		content: getId("s4-2"),
		b: getId("b4-2-1"),

		init() {
			this.b.onclick = function() {
				hide(this.content)
				show(atWork.fromUber.content)
				resetScroll()
			}.bind(this)
		}
	},

	home: {
		content: getId("s4-3"),
		b: getId("b4-3-1"),

		init() {
			this.b.onclick = function() {
				hide(this.content)
				death.show()
				resetScroll()
			}.bind(this)
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

		init() {
			this.b.onclick = function() {
				hide(this.content)
				death.show()
				resetScroll()
			}.bind(this)
		}
	},

	fromUber: {
		content: getId("s5-2"),
		b: getId("b5-2"),

		init() {
			this.b.onclick = function() {
				hide(this.content)
				death.show()
				resetScroll()
			}.bind(this)
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

		this.b2.onclick = function() {
			hide(this.content)

			style.sakura1.disabled = true
			style.sakura2.disabled = false

			show(epiphany.main.content)
			resetScroll()
		}.bind(this)
	}
}

const epiphany = {
	main: {
		content: getId("s7"),
		b: getId("b7"),

		init() {
			this.b.onclick = function() {
				hide(this.content)

				style.sakura1.disabled = false
				style.sakura2.disabled = true

				show(epiphany.alarm.content)
				resetScroll()
			}.bind(this)
		}
	},

	alarm: {
		content: getId("s7-1"),
		b: getId("b7-1"),

		init() {
			this.b.onclick = function() {
				this.b.disabled = true
				show(epiphany.alarm2.content)
			}.bind(this)
		}
	},

	alarm2: {
		content: getId("s7-2"),
		b: getId("b7-2"),

		init() {
			this.b.onclick = function() {
				hide(epiphany.alarm.content)
				hide(this.content)
				show(epiphany.rehab.content)
				resetScroll()
			}.bind(this)
		}
	},

	rehab: {
		content: getId("s7-3"),
		b: getId("b7-3"),

		init() {
			this.b.onclick = function() {
				hide(this.content)
				show(epiphany.beforeWork.content)
				resetScroll()
			}.bind(this)
		}
	},

	beforeWork: {
		content: getId("s7-4"),
		b: getId("b7-4"),

		init() {
			this.b.onclick = function() {
				hide(this.content)
				show(epiphany.atWork.content)
				resetScroll()
			}.bind(this)
		}
	},

	atWork: {
		content: getId("s7-5"),
		b: getId("b7-5"),

		init() {
			this.b.onclick = function() {
				hide(this.content)
				show(epiphany.death.content)
				resetScroll()
			}.bind(this)
		}
	},

	death: {
		content: getId("s7-6")
	},

	init() {
		this.main.init()
		this.alarm.init()
		this.alarm2.init()
		this.rehab.init()
		this.beforeWork.init()
		this.atWork.init()
	}
}

prologue.init()
morningOpening.init()
beforeWork.init()
atWork.init()
death.init()
epiphany.init()

// Testing
/*
iteration = 3
hide(prologue.content)
death.show()
death.b2.click()
epiphany.main.b.click()
epiphany.alarm.b.click()
epiphany.alarm2.b.click()
epiphany.rehab.b.click()
epiphany.beforeWork.b.click()
*/
