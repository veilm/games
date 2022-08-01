import React from "react"
import Input from "./Input"

interface Props {
	onExit(): void
}

interface State {
	celsius: number
}

export default class Temperature extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)

		this.state = {
			celsius: 0
		}
	}

	render() {
		const celsius = this.state.celsius

		return (<>
			<Input
				input="Celsius"
				setValue={num => this.setState({celsius: num})}
			/>

			<ul>
				<li>= {celsius * 9/5 + 32} F</li>
				<li>= {celsius + 273.15} K</li>
			</ul>

			<input type="button" value="Back" onClick={this.props.onExit} />
		</>)
	}
}
