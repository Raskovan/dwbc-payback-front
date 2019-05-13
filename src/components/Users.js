import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUsersIfNeeded } from '../actions'
import UserCard from './UserCard'
import HeaderMenu from './HeaderMenu'

class Users extends Component {
	componentDidMount() {
		const { dispatch } = this.props
		dispatch(fetchUsersIfNeeded())
	}

	render() {
    const { allUsers } = this.props
    const userElements = []
    if (allUsers.users) {
			allUsers.users.forEach((user, index) =>
				userElements.push(<UserCard user={user} key={index}/>)
			)
		}
		console.log('AllUsers', allUsers)
		return (
			<div>
				<HeaderMenu />
				{userElements.length && (
					<div>
						<h1>Users: </h1>
						<div>{userElements}</div>
					</div>
				)}
			</div>
		)
	}
}

Users.propTypes = {
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { allUsers } = state

	return {
		allUsers
	}
}

export default connect(mapStateToProps)(Users)
