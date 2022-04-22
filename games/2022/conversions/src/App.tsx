import React from "react"

import MainMenu from "./MainMenu"
import Temperature from "./Temperature"
import DigitalStorage from "./DigitalStorage"
import Distance from "./Distance"

interface State {
	screen: string
}

export default class App extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props)

		this.changeScreen = this.changeScreen.bind(this)
		this.exitScreen = this.exitScreen.bind(this)

		this.state = {
			screen: "Main Menu"
		}
	}

	exitScreen() {
		this.setState({screen: "Main Menu"})
	}

	changeScreen(screen: string) {
		this.setState({screen: screen})
	}

	render() {
		let screen = <MainMenu onChange={this.changeScreen} />

		switch (this.state.screen) {
			case "Temperature":
				screen = <Temperature onExit={this.exitScreen} />
				break

			case "Digital Storage":
				screen = <DigitalStorage onExit={this.exitScreen} />
				break

			case "Distance":
				screen = <Distance onExit={this.exitScreen} />
				break
		}

		return (<>
			<h1>Conversions: {this.state.screen}</h1>
			<hr />

			{screen}

			<hr />
			<p>by Michael Skyba</p>
		</>)
	}
}
