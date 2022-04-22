import React from 'react'
import ReactDOM from 'react-dom'

import './sakura.css'

import Circle from './circle'
import Sphere from './sphere'
import Square from './square'
import Cube from './cube'

class App extends React.Component {
	render() {
		return (<>
			<h1>Shapes Calculator</h1>
			<p>by Michael Skyba</p>

			<hr />
			<Circle />

			<hr />
			<Sphere />

			<hr />
			<Square />

			<hr />
			<Cube />
		</>);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
)
