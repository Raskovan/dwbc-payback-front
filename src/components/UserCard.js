import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { userUpdate } from '../actions'

class UserCard extends Component {
	handleClick(user, action) {
    const {dispatch} = this.props
    dispatch(userUpdate(user, action))
	}

	render() {
		const { user } = this.props
		return (
			<div>
				Username: {user.username} | City: {user.city_name} |
				<button
					value={user}
					type='button'
					onClick={() => this.handleClick(user, 'update')}>
					{user.is_approved ? 'Revoke' : 'Approve'}
				</button>
				| {user.is_admin ? 'Admin | ' : null}
				<button
					value={user}
					type='button'
					onClick={() => this.handleClick(user, 'delete')}>
					Delete
				</button>
				<hr />
			</div>
		)
	}
}

UserCard.propTypes = {
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { selectedCity, dataToEdit } = state

	return {
		cityId: selectedCity.city_id,
		dataToEdit
	}
}

export default connect(mapStateToProps)(UserCard)
