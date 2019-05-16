import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { userUpdate } from '../actions'
import { Card, Button, Label } from 'semantic-ui-react';

class UserCard extends Component {
	handleClick(user, action) {
    const {dispatch} = this.props
    dispatch(userUpdate(user, action))
	}

	render() {
		const { user } = this.props
		let approveButtonColor = user.is_approved ? 'red' : 'green'
		return (
			<Card>
				<Card.Content>
						<Button
							basic = {!user.is_admin}
							size='mini'
							color='grey'
							content='Admin'
							style={{ float: 'right' }}
							value={user}
							onClick={() => this.handleClick(user, 'admin')}
						/>
					<Card.Header>{user.username}</Card.Header>
					<Card.Meta>{user.city_name}</Card.Meta>
				</Card.Content>
				<Card.Content extra>
					<div className='ui two buttons'>
						<Button
							basic
							color={approveButtonColor}
							value={user}
							type='button'
							onClick={() => this.handleClick(user, 'update')}>
							{user.is_approved ? 'Revoke Access' : 'Approve'}
						</Button>
						<Button
							basic
							color='red'
							value={user}
							type='button'
							onClick={() => this.handleClick(user, 'delete')}>
							Delete User
						</Button>
					</div>
				</Card.Content>
			</Card>
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
