import React from "react"
import Input from "./Input"

interface Props {
	onExit(): void
}

interface State {
	terabytes: number
}

export default class DigitalStorage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)

		this.state = {
			terabytes: 0
		}
	}

	render() {
		const terabytes = this.state.terabytes

		return (<>
			<Input
				input="Terabytes"
				setValue={num => this.setState({terabytes: num})}
			/>

			<ul>
				<li>= {terabytes * 1000 * 1000} MB</li>
				<li>= {terabytes * 1000} GB</li>
			</ul>

			<input type="button" value="Back" onClick={this.props.onExit} />
		</>)
	}
}
