import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUsersIfNeeded } from '../actions'
import UserCard from './UserCard'
import { Header, Card, Container, Segment } from 'semantic-ui-react'

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
				userElements.push(<UserCard user={user} key={index} />)
			)
		}
		return (
			<div>
				<Segment basic style={{ height: '100%' }}>
					<Container>
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
