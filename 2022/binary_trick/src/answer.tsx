import React from "react"

interface Props {
	value: number
}

export default class Answer extends React.Component<Props, {}> {
	render () {
		if (this.props.value === 0) return <> </>
		else return <p>Your number is {this.props.value}!</p>
	}
}
