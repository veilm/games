import React from "react"

interface Props {
	input: string
	setValue(value: number): void
}

const Input = (props: Props) => {
	return (<>
		<label htmlFor={props.input}>{props.input}: </label>
		<input id={props.input}
			type="number"
			onChange={event => {
				const num = parseInt(event.target.value)
				props.setValue(isNaN(num) ? 0 : num)
			}}
		/>
	</>)
}

export default Input
