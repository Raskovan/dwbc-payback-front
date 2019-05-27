import React, { Component } from 'react'
import { connect } from 'react-redux'
import Picker from '../components/Picker'
import {
	editDataOnChange,
	handleSignUp,
	fetchCitiesIfNeeded
} from '../actions'
import { Grid, Form, Header, Button, Icon } from 'semantic-ui-react'

class SignUp extends Component {
	state = {
		showAddCity: false
	}

	handleAddCityClick() {
		this.setState({
			showAddCity: !this.state.showAddCity
		})
	}
	componentDidMount() {
		const { dispatch, match } = this.props
		dispatch(fetchCitiesIfNeeded(match.params.name))
	}

	render() {
    const { dispatch, dataToEdit, history, error } = this.props
		return (
			<div style={{ height: '100%' }}>
				{error.message && alert(error.message)}
				<Grid
					stackable
					style={{ height: '90%' }}
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
								{!this.state.showAddCity ? (
									<Form.Field>
										{/* <label>Select a city:</label> */}
										<Picker />
									</Form.Field>
								) : null}
								<Form.Field>
									<label onClick={()=>this.handleAddCityClick()} style={{color: 'grey'}}>
										<Icon name={this.state.showAddCity ? 'minus square' : 'plus square'} color='grey'/>
										add a new city
									</label>
								</Form.Field>
								{this.state.showAddCity ? (
									<Form.Field>
										<input
											name='city'
											type='text'
											placeholder='Add a city'
											value={dataToEdit.city ? dataToEdit.city : ''}
											onChange={e => dispatch(editDataOnChange(e))}
										/>
									</Form.Field>
								) : null}

								<Button fluid size='big' type='submit' value='Request'>
									Request Access
								</Button>
							</Form>
						</Grid.Column>
					</Grid.Row>
				</Grid>
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
