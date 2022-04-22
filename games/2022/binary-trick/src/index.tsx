import React from "react"
import ReactDOM from "react-dom"

import Digit from "./digit"
import Answer from "./answer"

import "./sakura.css"

interface State {
	digit_components: JSX.Element[]
	bin_answer: number[]
	answer: number
}

class App extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props)

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)

		let components = []
		for (let i = 0; i < 5; i++) {
			components.push(<Digit
								value={i}
								onChange={this.handleChange}
								toBaseTen={this.toBaseTen}
								key={i}
							/>)
		}

		this.state = {
			digit_components: components,
			bin_answer: [0, 0, 0, 0, 0],
			answer: 0
		}
	}

	toBaseTen(binary: number[]) {
		let baseTen = 0
		for (let i = 0; i < binary.length; i++) {
			baseTen += binary[4-i] * Math.pow(2, i)
		}

		return baseTen
	}

	handleChange(digit: number, check: boolean) {
		let new_answer = this.state.bin_answer
		new_answer[4-digit] = check ? 1 : 0

		this.setState({bin_answer: new_answer})
	}

	handleSubmit() {
		this.setState({answer: this.toBaseTen(this.state.bin_answer)})
	}

	render() {
		return (<>
			<h1>Binary Trick</h1>

			<p>Think of a real integer from 0 to 31. Select all the lists
			that include your number and press submit. After doing
			so, the algorithm will "magically" guess your number.</p>

			<Answer value={this.state.answer} />

			<hr />

			{this.state.digit_components}

			<input
				type="button"
				value="Guess my number"
				onClick={this.handleSubmit}
			/>

			<hr />
			<p>by Michael Skyba</p>
		</>)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("root")
)
