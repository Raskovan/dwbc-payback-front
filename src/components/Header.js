import React, { Component } from 'react'
import { logOut } from '../actions'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Header extends Component {
	
	render() {
		const { dispatch, user, history, selectedCity } = this.props
		let headerLink
		if (history.location.pathname === '/users') {
			headerLink = <Link to={`/${selectedCity.city_name}`}>Manage Cities</Link>
		} else {
			headerLink = <Link to='/users'>Manage Users</Link>
						}
		console.log("HISTORY", history)
		return (
			<div>
				<h1>PaiBack</h1>
				{user.loggedIn && (
					<div>
						Hi, {user.username}
						<button type='button' onClick={() => dispatch(logOut())}>
							Log Out
						</button>
						{user.is_admin && headerLink}
					</div>
				)}
				<hr />
			</div>
		)
	}
}

Header.propTypes = {
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

export default withRouter(connect(mapStateToProps)(Header))
