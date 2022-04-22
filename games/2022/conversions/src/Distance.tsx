import React from "react"
import Input from "./Input"

interface Props {
	onExit(): void
}

interface State {
	meters: number
}

export default class Distance extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)

		this.state = {
			meters: 0
		}
	}

	render() {
		const meters = this.state.meters

		return (<>
			<Input
				input="Meters"
				setValue={num => this.setState({meters: num})}
			/>

			<ul>
				<li>= {meters / 1000} km</li>
				<li>= {meters * 3.28084} ft</li>
				<li>= {meters * 39.3701} in</li>
				<li>= {meters * 100} cm</li>
			</ul>

			<input type="button" value="Back" onClick={this.props.onExit} />
		</>)
	}
}
