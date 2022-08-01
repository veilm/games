import React from "react"
import ShapeInput from "./input"

interface State {
	length: number
	perimeter: number
	area: number
}

export default class Square extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props)
		this.state = {
			length: 0,
			perimeter: 0,
			area: 0,
		}
	}

	handleLength(length: number) {
		this.setState({
			length: length,
			perimeter: length * 4,
			area: length * length
		})
	}

	handleChange(value: string) {
		const num = parseInt(value)

		if (isNaN(num)) this.handleLength(0)
		else this.handleLength(num)
	}

	render() {
		return (<>
			<h4>Square</h4>
			<ol>
				<ShapeInput
					onChange={(value: string) => this.handleChange(value)}
					input="length"
				/>
				<li>perimeter: {this.state.perimeter} u</li>
				<li>area: {this.state.area} u²</li>
			</ol>
		</>)
	}
}
