import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editDataOnChange, handleLogin } from '../actions'
import { Link } from 'react-router-dom'
import {
	fetchCitiesIfNeeded
} from '../actions'
import Header from './Header'

class LogIn extends Component {
	componentDidMount() {
    const { dispatch } = this.props

    dispatch(fetchCitiesIfNeeded())
		const token = localStorage.getItem('token')
		if (token) {
			this.props.history.push('/')
		}
	}

	render() {
		const { dispatch, dataToEdit, history, error } = this.props
		return (
			<div>
				<Header />
				{error.message && alert(error.message)}
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
				<div>
					<Link to='/signup'>Request Access</Link>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { dataToEdit, error } = state

	return {
		dataToEdit,
		error
	}
}

export default connect(mapStateToProps)(LogIn)
