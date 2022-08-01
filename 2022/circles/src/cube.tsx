import React from "react"
import ShapeInput from "./input"

interface State {
	length: number
	surface_area: number
	volume: number
}

export default class Cube extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props)
		this.state = {
			length: 0,
			surface_area: 0,
			volume: 0
		}
	}

	handleLength(length: number) {
		this.setState({
			length: length,
			surface_area: length * length * 6,
			volume: Math.pow(length, 3)
		})
	}

	handleChange(value: string) {
		const num = parseInt(value)

		if (isNaN(num)) this.handleLength(0)
		else this.handleLength(num)
	}

	render() {
		return (<>
			<h4>Cube</h4>
			<ol>
				<ShapeInput
					onChange={(value: string) => this.handleChange(value)}
					input="length"
				/>
				<li>surface_area: {this.state.surface_area} u²</li>
				<li>volume: {this.state.volume} u</li>
			</ol>
		</>)
	}
}
