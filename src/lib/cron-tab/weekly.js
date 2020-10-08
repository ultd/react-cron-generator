/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react'
import Minutes from '../minutes-select'
import Hour from '../hour-select'

export default class WeeklyCron extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.onAtHourChange = this.onAtHourChange.bind(this)
		this.onAtMinuteChange = this.onAtMinuteChange.bind(this)
		this.onCheck = this.onCheck.bind(this)
		this.friRef = React.createRef()
	}

	onAtHourChange(e) {
		let val = this.state.value
		val[0] = '0'
		val[2] = `${e.target.value}`
		this.props.onChange(val)
	}

	onAtMinuteChange(e) {
		let val = this.state.value
		val[0] = '0'
		val[1] = `${e.target.value}`
		this.props.onChange(val)
	}

	onCheck(e) {
		let val = this.state.value
		val[0] = '0'
		if (e.target.checked) {
			this.onDayChecked(val, e)
		} else {
			if (val[5].length !== 3) {
				this.onDayUnChecked(val, e)
			}
		}
		this.props.onChange(val)
	}

	onDayChecked(val, e) {
		val[2] = `${val[2]}`.split('/').length > 1 ? '0' : val[2].toString()
		val[3] = '?'
		val[4] = '*'
		if (val[5] === '*' || val[5] === '?' || val[5] === 'MON-FRI') {
			val[5] = e.target.value
		} else {
			val[5] = val[5] + '!' + e.target.value
		}
	}

	onDayUnChecked(val, e) {
		val[5] = val[5].split('!')
		if (val[5].length > 1) {
			val[5].splice(val[5].indexOf(e.target.value), 1)
			val[5] = val[5].toString().replace(/,/g, '!')
		} else {
			val[5] = '*'
		}
	}

	componentDidMount() {
		this.state.value = this.props.value
		if (this.state.value) {
			const newVal = [].concat(this.state.value)
			// newVal[5] = 'FRI'

			this.setState({
				...this.state,
				value: newVal,
			})
			setTimeout(
				() => this.onCheck({ target: { value: 'MON', checked: true } }),
				100
			)
		}
	}

	render() {
		console.log(this.state.value)
		const translateFn = this.props.translate
		if (!this.state.value) {
			return <div></div>
		}
		return (
			<div className={this.props.cronViewClassName}>
				<div>
					<div>
						<div>
							<input
								type='checkbox'
								value='MON'
								onChange={this.onCheck}
								checked={
									this.state.value[5].search('MON') !== -1
										? true
										: false
								}
							/>
							&nbsp;{translateFn('Monday')}
							<br />
							<input
								type='checkbox'
								value='TUE'
								onChange={this.onCheck}
								checked={
									this.state.value[5].search('TUE') !== -1
										? true
										: false
								}
							/>
							&nbsp;{translateFn('Tuesday')}
							<br />
							<input
								type='checkbox'
								value='WED'
								onChange={this.onCheck}
								checked={
									this.state.value[5].search('WED') !== -1
										? true
										: false
								}
							/>
							&nbsp;{translateFn('Wednesday')}
							<br />
							<input
								type='checkbox'
								value='THU'
								onChange={this.onCheck}
								checked={
									this.state.value[5].search('THU') !== -1
										? true
										: false
								}
							/>
							&nbsp;{translateFn('Thursday')}
							<br />
							<input
								type='checkbox'
								value='FRI'
								onChange={this.onCheck}
								checked={
									this.state.value[5].search('FRI') !== -1
										? true
										: false
								}
								ref={this.friRef}
							/>
							&nbsp;{translateFn('Friday')}
							<br />
							<input
								type='checkbox'
								value='SAT'
								onChange={this.onCheck}
								checked={
									this.state.value[5].search('SAT') !== -1
										? true
										: false
								}
							/>
							&nbsp;{translateFn('Saturday')}
							<br />
							<input
								type='checkbox'
								value='SUN'
								onChange={this.onCheck}
								checked={
									this.state.value[5].search('SUN') !== -1
										? true
										: false
								}
							/>
							&nbsp;{translateFn('Sunday')}
							<br />
						</div>
					</div>
				</div>
				<br />
				{translateFn('Start time')}&nbsp;
				<Hour onChange={this.onAtHourChange} value={this.state.value[2]} />
				&nbsp;
				<Minutes onChange={this.onAtMinuteChange} value={this.state.value[1]} />
			</div>
		)
	}
}
