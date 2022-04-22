import React from "react"

interface Props {
	onChange(screen: string): void
}

interface State {
	buttons: JSX.Element[]
}

export default class MainMenu extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)

		let buttons: JSX.Element[] = []

		const screens = ["Temperature", "Digital Storage", "Distance"]
		screens.forEach((screen, i) => {
			buttons.push(<input
				type="button"
				value={screen}
				onClick={() => {this.props.onChange(screen)}}
				key={i}
			/>)
		})

		this.state = {
			buttons: buttons
		}
	}

	render() {
		return this.state.buttons
	}
}
