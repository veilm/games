import React from "react"

interface Props {
	input: string
	onChange(value: string): void,
}

export default class ShapeInput extends React.Component <Props, {}> {
	render() {
		return (<li>
			{this.props.input}: <input
				onChange={(event) => this.props.onChange(event.target.value)}
				type="number"
			/>
		</li>)
	}
}

