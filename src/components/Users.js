import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUsersIfNeeded, userUpdate } from '../actions'
import UserCard from './UserCard'
import { Header, Card, Container, Segment, Loader } from 'semantic-ui-react'

function Users(props) {
	const { dispatch, allUsers } = props
	useEffect(() => {
		dispatch(fetchUsersIfNeeded())
	})

	const handleClick = (user, action) => {
		dispatch(userUpdate(user, action))
	}

	const userElements = []
	if (allUsers.users) {
		allUsers.users.forEach((user, index) =>
			userElements.push(
				<UserCard user={user} key={index} handleClick={handleClick} />
			)
		)
	}
	return (
		<div>
			<Segment basic style={{ height: '100%' }}>
				<Container>
					{userElements.length === 0 && <Loader />}
					<Header as='h2' color='grey' content='Users' />
					{userElements.length > 0 && (
						<Card.Group doubling stackable itemsPerRow={3}>
							{userElements}
						</Card.Group>
					)}
				</Container>
			</Segment>
		</div>
	)
}

Users.propTypes = {
	dispatch: PropTypes.func.isRequired,
	allUsers: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	const { allUsers } = state

	return {
		allUsers
	}
}

export default connect(mapStateToProps)(Users)
