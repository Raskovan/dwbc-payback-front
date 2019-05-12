import React, { Component } from 'react'
import { logOut } from '../actions'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Header extends Component {
	render() {
		const { dispatch, user } = this.props
		return (
			<div>
        <h1>PaiBack</h1>
        {user.loggedIn && (
          <div>
            Hi, {user.username}
            <button type='button' onClick={() => dispatch(logOut())}>
              Log Out
            </button>
            {user.is_admin && <Link to='/users'>Manage Users</Link>}
          </div>
        )}
			</div>
		)
	}
}

Header.propTypes = {
	user: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { user } = state

	return {
		user
	}
}

export default withRouter(connect(mapStateToProps)(Header))
