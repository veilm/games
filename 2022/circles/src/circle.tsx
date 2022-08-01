import React from "react"
import ShapeInput from "./input"

interface State {
	radius: number
	diameter: number
	circumfrence: number
	area: number
}

export default class Circle extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props)
		this.state = {
			radius: 0,
			diameter: 0,
			circumfrence: 0,
			area: 0
		}
	}

	handleRadius(radius: number) {
		this.setState({
			radius: radius,
			diameter: 2 * radius,
			circumfrence: 2 * Math.PI * radius,
			area: Math.PI * radius * radius
		})
	}

	handleChange(value: string) {
		const num = parseInt(value)

		if (isNaN(num)) this.handleRadius(0)
		else this.handleRadius(num)
	}

	render() {
		return (<>
			<h4>Circle</h4>
			<ol>
				<ShapeInput
					onChange={(value: string) => this.handleChange(value)}
					input="radius"
				/>
				<li>diameter: {this.state.diameter} u</li>
				<li>circumfrence: {this.state.circumfrence} u</li>
				<li>area: {this.state.area} u²</li>
			</ol>
		</>)
	}
}
