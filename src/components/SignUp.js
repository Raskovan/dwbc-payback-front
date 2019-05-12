import React, { Component } from 'react'
import { connect } from 'react-redux'
import Picker from '../components/Picker'
import {
	editDataOnChange,
	handleSignUp,
	fetchCitiesIfNeeded
} from '../actions'
import Header from './Header';

class SignUp extends Component {

	componentDidMount() {
		const { dispatch, match } = this.props
		dispatch(fetchCitiesIfNeeded(match.params.name))
	}
  
  handlePickerChange(event) {
    console.log(event.target.value)
  }

	render() {
    const { dispatch, dataToEdit, history, error } = this.props
		return (
			<div>
				{error.message && alert(error.message)}
				<Header />
				<h2>Request Access</h2>
				<form
					onSubmit={e => {
						e.preventDefault()
						dispatch(handleSignUp(dataToEdit, history))
					}}>
					Your E-mail:
					<br />
					<input
						name='email'
						type='text'
						placeholder='Email'
						value={dataToEdit.email ? dataToEdit.email : ''}
						onChange={e => dispatch(editDataOnChange(e))}
					/>
					<br />
					Your Password:
					<br />
					<input
						name='password'
						type='password'
						placeholder='Password'
						value={dataToEdit.password ? dataToEdit.password : ''}
						onChange={e => dispatch(editDataOnChange(e))}
					/>
					<br />
					Select City:
					<Picker />
					<br />
					...or add a new city: <br />
					<input
						name='city'
						type='city'
						placeholder='City'
						value={dataToEdit.city ? dataToEdit.city : ''}
						onChange={e => dispatch(editDataOnChange(e))}
					/>
					<br />
					<input type='submit' value='Request' />
				</form>
			</div>
		)
	}
}

function mapStateToProps(state) {
  const { dataToEdit, error } = state
  const { cities } = state
  const {
    isFetchingCities,
    lastUpdatedCities,
    cityList: allCities
  } = cities || {
    isFetchingCities: true,
    cityList: []
  }

	return {
		dataToEdit,
		isFetchingCities,
		lastUpdatedCities,
		allCities,
		error
	}
}

export default connect(mapStateToProps)(SignUp)
