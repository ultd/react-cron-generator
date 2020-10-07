import React, { useState } from 'react'
import Cron from './lib'

const App = () => {
	const [state, setState] = useState({ value: '' })

	return (
		<div>
			<Cron
				onChange={(e) => setState({ value: e })}
				value={state.value}
				showResultText={true}
				showResultCron={true}
			/>
		</div>
	)
}

export default App
