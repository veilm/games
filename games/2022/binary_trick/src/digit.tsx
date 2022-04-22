import React from "react"

interface State {
	output: string
}

interface Props {
	value: number
	onChange(digit: number, check: boolean): void
	toBaseTen(binary: number[]): number
}

export default class Digit extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)

		let numbers: number[] = []
		let binary: number[] = [0, 0, 0, 0, 0]

		binary[4-props.value] = 1
		numbers.push(this.props.toBaseTen(binary))

		// There are 16 numbers so we use k < 15
		// You can't compare arrays with ==
		let k = 0
		while (k < 15) {

			// Get to the first digit that has 0
			let i = 0
			while (binary[4-i] === 1) {
				i++
			}

			binary[4-i] = 1

			// Set previous digits to 0
			for (let j = 0; j < i; j++) {
				binary[4-j] = 0
			}

			// Except for the value, which should always be 1
			binary[4-props.value] = 1

			numbers.push(this.props.toBaseTen(binary))
			k++
		}

		this.state = {
			output: numbers.join(", ")
		}
	}

	render() {
		const id = this.props.value.toString()

		return (<>
			<input
				id={id}
				type="checkbox"
				onChange={(event) => this.props.onChange(this.props.value, event.target.checked)}
			/>
			<label htmlFor={id}> {this.state.output}</label>
			<br />
		</>)
	}
}
