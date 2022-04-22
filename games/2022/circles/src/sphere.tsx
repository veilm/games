import React from "react"
import ShapeInput from "./input"

interface State {
	radius: number
	surface_area: number
	volume: number
}

export default class Sphere extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props)
		this.state = {
			radius: 0,
			surface_area: 0,
			volume: 0
		}
	}

	handleRadius(radius: number) {
		this.setState({
			radius: radius,
			surface_area: 4 * Math.PI * radius * radius,
			volume: 4/3 * Math.PI * Math.pow(radius, 3),
		})
	}

	handleChange(value: string) {
		const num = parseInt(value)

		if (isNaN(num)) this.handleRadius(0)
		else this.handleRadius(num)
	}

	render() {
		return (<>
			<h4>Sphere</h4>
			<ol>
				<ShapeInput
					onChange={(value: string) => this.handleChange(value)}
					input="radius"
				/>
				<li>surface_area: {this.state.surface_area} u²</li>
				<li>volume: {this.state.volume} u³</li>
			</ol>
		</>)
	}
}

