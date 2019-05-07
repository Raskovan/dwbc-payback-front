import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editDataOnChange, handleLogin } from '../actions'

class LogIn extends Component {
	componentDidMount() {
		const token = localStorage.getItem('token')
		if (token) {
			this.props.history.push('/')
		}
	}

	render() {
		const { dispatch, dataToEdit, history } = this.props
		return (
			<div>
				<h2>Sign In</h2>
				<form
					onSubmit={e => {
						e.preventDefault()
						dispatch(handleLogin(dataToEdit, history))
					}}>
					<input
						name='email'
						type='text'
						placeholder='Email'
						value={dataToEdit.email ? dataToEdit.email : ''}
						onChange={e => dispatch(editDataOnChange(e))}
					/>
					<input
						name='password'
						type='password'
						placeholder='Password'
						value={dataToEdit.password ? dataToEdit.password : ''}
						onChange={e => dispatch(editDataOnChange(e))}
					/>
					<input type='submit' value='Sign In' />
				</form>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { dataToEdit } = state

	return {
		dataToEdit
	}
}

export default connect(mapStateToProps)(LogIn)
