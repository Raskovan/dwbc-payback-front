import React, { Component } from 'react'
import { logOut } from '../actions'
import logo from '../assets/logo.svg'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Picker from '../components/Picker'
import { Menu, Button, Header, Segment, Image } from 'semantic-ui-react'

class HeaderMenu extends Component {
	render() {
		const { dispatch, user, history, selectedCity } = this.props
		let headerLink
		let headerText
		if (history.location.pathname === '/users') {
			headerLink = `/${selectedCity.city_name}`
			headerText = 'Manage Cities'
		} else {
			headerLink = '/users'
			headerText = 'Manage Users'
		}
		return (
			<div>
				<Menu
					attached='top'
					borderless
					fluid
					style={{ background: '#e6e6e6' }}>
					<Menu.Item disabled as={Link} to='/'>
						<Image src={logo} alt='Logo' />
					</Menu.Item>
					<Menu.Header
						as='h1'
						style={{ fontWeight: '300' }}
						content='PaiBack'
					/>
					{user.loggedIn && (
						<Menu.Menu position='right'>
							<Menu.Item>{user.is_admin && <Picker />}</Menu.Item>
							{user.is_admin && (
								<Menu.Item>
									<Button
										size='tiny'
										as={Link}
										to={headerLink}
										color='blue'
										style={{ marginRight: '-25px' }}>
										{headerText}
									</Button>
								</Menu.Item>
							)}
							<Menu.Item>
								<Button
									size='tiny'
									type='button'
									color='grey'
									onClick={() => dispatch(logOut())}>
									Log Out
								</Button>
							</Menu.Item>
						</Menu.Menu>
					)}
				</Menu>
				{user.username && (
					<Segment
						basic
						size='tiny'
						style={{ paddingTop: '0', marginTop: '5px' }}>
						<Header as='h5' floated='right' style={{ fontWeight: '300' }}>
							Logged in as {user.username}
						</Header>
					</Segment>
				)}
			</div>
		)
	}
}

HeaderMenu.propTypes = {
	user: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { user, selectedCity } = state

	return {
		user,
		selectedCity
	}
}

export default withRouter(connect(mapStateToProps)(HeaderMenu))
