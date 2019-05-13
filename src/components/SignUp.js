import React, { Component } from 'react'
import { connect } from 'react-redux'
import Picker from '../components/Picker'
import {
	editDataOnChange,
	handleSignUp,
	fetchCitiesIfNeeded
} from '../actions'
import HeaderMenu from './HeaderMenu';
import { Container, Grid, Form, Header, Button } from 'semantic-ui-react'

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
			<Container fluid style={{ height: '100%' }}>
				<HeaderMenu />
				{error.message && alert(error.message)}
				<Grid
					style={{ height: '100%' }}
					verticalAlign='middle'
					centered
					doubling
					columns={3}>
					<Grid.Row>
						<Grid.Column>
							<Header as='h2' color='grey'>
								Request Access
							</Header>
							<Form
								size='big'
								onSubmit={e => {
									e.preventDefault()
									dispatch(handleSignUp(dataToEdit, history))
								}}>
								<Form.Field>
									{/* <label>Your E-mail:</label> */}
									<input
										name='email'
										type='text'
										placeholder='Email'
										value={dataToEdit.email ? dataToEdit.email : ''}
										onChange={e => dispatch(editDataOnChange(e))}
									/>
								</Form.Field>
								<Form.Field>
									{/* <label>Your Password:</label> */}
									<input
										name='password'
										type='password'
										placeholder='Password'
										value={dataToEdit.password ? dataToEdit.password : ''}
										onChange={e => dispatch(editDataOnChange(e))}
									/>
								</Form.Field>
								<Form.Field>
									{/* <label>Select a city:</label> */}
									<Picker />
								</Form.Field>
								<Form.Field>
									<label>...or add a new city:</label>
									<input
										name='city'
										type='text'
										placeholder='Add a city'
										value={dataToEdit.city ? dataToEdit.city : ''}
										onChange={e => dispatch(editDataOnChange(e))}
									/>
								</Form.Field>
								<Button fluid size='big' type='submit' value='Request'>
									Request
								</Button>
							</Form>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
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
