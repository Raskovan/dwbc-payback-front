import React, { Component } from 'react'
import { logOut } from '../actions'
import logo from '../assets/logo.svg'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Menu, Button } from 'semantic-ui-react'

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
			<Menu
				attached='top'
				borderless
				fluid
				size='large'
				style={{ background: '#e6e6e6' }}>
				<Menu.Item disabled as={Link} to='/'>
					<img src={logo} alt='Logo' />
				</Menu.Item>
				<Menu.Header as='h2' style={{ marginTop: '15px', fontWeight: '300' }}>
					PaiBack
				</Menu.Header>
				{user.loggedIn && (
					<Menu.Menu position='right'>
						<Menu.Item>Hi, {user.username}</Menu.Item>
						{user.is_admin && (
							<Menu.Item>
								<Button as={Link} to={headerLink} color='blue' style={{marginRight: '-25px'}}>
									{headerText}
								</Button>
							</Menu.Item>
						)}
						<Menu.Item>
							<Button
							size='small'
								type='button'
								color='grey'
								onClick={() => dispatch(logOut())}>
								Log Out
							</Button>
						</Menu.Item>
					</Menu.Menu>
				)}
			</Menu>
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
