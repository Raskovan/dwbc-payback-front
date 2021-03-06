import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editDataOnChange, handleLogin } from '../actions'
import { Link } from 'react-router-dom'
import { fetchCitiesIfNeeded } from '../actions'
import logo from '../assets/logo.svg'
import {
	Grid,
	Form,
	Button,
	Input,
	Image,
	Header,
	Loader,
	Transition
} from 'semantic-ui-react'

class LogIn extends Component {
	state ={
		imageLoaded: false
	}

	componentDidMount() {
		const { dispatch } = this.props

		dispatch(fetchCitiesIfNeeded())
		const token = localStorage.getItem('token')
		if (token) {
			this.props.history.push('/')
		}
	}

	imageLoad = () => {
		this.setState({
			imageLoaded: true
		})
	}

	render() {
		const { dispatch, dataToEdit, history, error, cities } = this.props
		const { imageLoaded } = this.state
		return (
			<div style={{ height: '100%' }}>
				{error.message && alert(error.message)}
				<Grid
					style={{ height: '100%' }}
					verticalAlign='middle'
					centered
					doubling
					stackable
					columns={3}>
					<Grid.Row>
						<Grid.Column textAlign='center'>
							<Image size='small' src={logo} centered onLoad={this.imageLoad}/>
							<Transition
								visible={this.props.cities.cityList.length > 0 && imageLoaded}
								animation='slide up'
								duration={300}>
								<div>
									<Header as='h2' color='grey' style={{ margin: '20px' }}>
										Sign in to PaiBack
									</Header>

									<Form
										size='big'
										onSubmit={e => {
											e.preventDefault()
											dispatch(handleLogin(dataToEdit, history))
										}}>
										<Form.Field>
											<Input
												fluid
												name='email'
												type='text'
												placeholder='Email'
												// style={{ paddingBottom: '5px' }}
												value={dataToEdit.email ? dataToEdit.email : ''}
												onChange={e => dispatch(editDataOnChange(e))}
											/>
										</Form.Field>
										<Form.Field>
											<Input
												fluid
												name='password'
												type='password'
												placeholder='Password'
												// style={{ paddingBottom: '5px' }}
												value={dataToEdit.password ? dataToEdit.password : ''}
												onChange={e => dispatch(editDataOnChange(e))}
											/>
										</Form.Field>
										<Button fluid size='big' type='submit' value='Sign In'>
											Sign In
										</Button>
									</Form>
									<br />
									<Link to='/signup'>Request Access</Link>
								</div>
							</Transition>

							{cities.cityList.length === 0 && (
								<Grid.Column>
									<Loader active />
								</Grid.Column>
							)}
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const { dataToEdit, error, cities } = state

	return {
		dataToEdit,
		cities,
		error
	}
}

export default connect(mapStateToProps)(LogIn)
