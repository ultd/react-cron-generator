/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react'
import cronstrue from 'cronstrue/i18n'
import { metadata, loadHeaders } from './meta'
import shortid from 'shortid'

const defClassNameProps = {
	headersContainerClassName: null,
	headerItemClassName: null,
	headerItemSelectedClassName: null,
	containerClassName: null,
	cronViewClassName: null,
	resultTextCronName: null,
}

export default class Cron extends Component {
	constructor(props) {
		super(props)
		this.props = { ...this.props, ...defClassNameProps }
		this.state = {
			headers: loadHeaders(this.props.options),
			locale: this.props.locale ? this.props.locale : 'en',
		}
	}

	componentWillMount() {
		this.setValue(this.props.value)
		if (this.props.translateFn && !this.props.locale) {
			console.log('Warning !!! locale not set while using translateFn')
		}
		if (this.props.onRef) {
			this.props.onRef(this)
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value && this.state.value) {
			let newVal = ''
			newVal = this.state.value.toString().replace(/,/g, ' ')
			newVal = newVal.replace(/!/g, ',')
			if (nextProps.value !== newVal) {
				this.setValue(nextProps.value)
			}
		}
	}

	setValue(value) {
		let prevState = this.state
		prevState.value = value
		if (prevState.value && prevState.value.split(' ').length === 6) {
			prevState.value += ' *'
		}
		if (!prevState.value || prevState.value.split(' ').length !== 7) {
			prevState.value = ['0', '0', '00', '1/1', '*', '?', '*']
			prevState.selectedTab = prevState.headers[0]
			this.parentChange(prevState.value)
		} else {
			prevState.value = prevState.value.replace(/,/g, '!').split(' ')
		}
		let val = prevState.value
		if (val[1].search('/') !== -1 && val[2] === '*' && val[3] === '1/1') {
			prevState.selectedTab = prevState.headers[0]
		} else if (val[3] === '1/1') {
			prevState.selectedTab = prevState.headers[1]
		} else if (val[3].search('/') !== -1 || val[5] === 'MON-FRI') {
			prevState.selectedTab = prevState.headers[2]
		} else if (val[3] === '?') {
			prevState.selectedTab = prevState.headers[3]
		} else if (val[3].startsWith('L') || val[4] === '1/1') {
			prevState.selectedTab = prevState.headers[4]
		} else {
			prevState.selectedTab = prevState.headers[0]
		}
		// this.parentChange(prevState.value)
		this.setState(prevState)
	}
	tabChanged(tab) {
		this.setState({ selectedTab: tab, value: this.defaultValue(tab) }, () =>
			this.parentChange(this.defaultValue(tab))
		)
	}

	getHeaders() {
		return this.state.headers.map((d) => {
			const classNames = [this.props.headerItemClassName]
			if(this.state.selectedTab === d){
				classNames.push(this.props.headerItemSelectedClassName)
			}
			console.log(classNames)
			return (
				<li
					key={shortid()}
					onClick={this.tabChanged.bind(this, d)}
					className={classNames.join(' ')}
				>
					{this.translate(d)}
				</li>
			)
		})
	}

	onValueChange(val) {
		if (val && val.length) {
			this.setState({ value: val }, () => this.parentChange(val))
		} else {
			val = ['0', '0', '00', '1/1', '*', '?', '*']
			this.setState({ value: val }, () => this.parentChange(val))
		}
	}

	parentChange(val) {
		let newVal = ''
		newVal = val.toString().replace(/,/g, ' ')
		newVal = newVal.replace(/!/g, ',')
		this.props.onChange(newVal)
	}

	getVal() {
		let val = cronstrue.toString(
			this.state.value.toString().replace(/,/g, ' ').replace(/!/g, ','),
			{ locale: this.state.locale }
		)
		if (val.search('undefined') === -1) {
			return val
		}
		return '-'
	}

	defaultValue(tab) {
		const index = this.state.headers.indexOf(tab)
		if (metadata[index] === -1) {
			return
		}
		return metadata[index].initialCron
	}

	getComponent(tab) {
		const index = this.state.headers.indexOf(tab)
		if (metadata[index] === -1) {
			return
		}
		let selectedMetaData = metadata.find(
			(data) => data.component.name === tab + 'Cron'
		)
		if (!selectedMetaData) {
			selectedMetaData = metadata[index]
		}
		if (!selectedMetaData) {
			throw new Error('Value does not match any available headers.')
		}
		const CronComponent = selectedMetaData.component
		return (
			<CronComponent
				cronViewClassName={this.props.cronViewClassName}
				translate={this.translate.bind(this)}
				value={this.state.value}
				onChange={this.onValueChange.bind(this)}
			/>
		)
	}

	translate(key) {
		let translatedText = key
		if (this.props.translateFn) {
			translatedText = this.props.translateFn(key)
			if (typeof translatedText !== 'string') {
				throw new Error('translateFn expects a string translation')
			}
		}
		return translatedText
	}

	render() {
		return (
			<div className={this.props.containerClassName}>
				<ul className={this.props.headersContainerClassName}>
					{this.getHeaders()}
				</ul>
				<div>{this.getComponent(this.state.selectedTab)}</div>
				{this.props.showResultText && (
					<div className={this.props.resultTextCronName}>{this.getVal()}</div>
				)}
				{this.props.showResultCron && (
					<div>
						{this.state.value
							.toString()
							.replace(/,/g, ' ')
							.replace(/!/g, ',')}
					</div>
				)}
			</div>
		)
	}
}
