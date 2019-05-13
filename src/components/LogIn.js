import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editDataOnChange, handleLogin } from '../actions'
import { Link } from 'react-router-dom'
import { fetchCitiesIfNeeded } from '../actions'
import HeaderMenu from './HeaderMenu'
import logo from '../assets/logo.svg'
import {
	Grid,
	Form,
	Button,
	Input,
	Container,
	Image,
	Item,
	Segment,
	Header
} from 'semantic-ui-react'

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
			<Container fluid style={{ height: '100%' }}>
				{error.message && alert(error.message)}
				<Grid
					style={{ height: '100%' }}
					verticalAlign='middle'
					centered
					doubling
					columns={3}>
					<Grid.Row>
						<Grid.Column textAlign='center'>
							<Image fluid size='small' src={logo} centered />
							<Header as='h2' color='grey' style={{margin: '20px'}}>
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
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
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
