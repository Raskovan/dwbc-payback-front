import React from 'react'
import { Card, Button } from 'semantic-ui-react'

export default function UserCard(props) {
	const { user, handleClick } = props
	let approveButtonColor = user.is_approved ? 'red' : 'green'
	return (
		<Card>
			<Card.Content>
				<Button
					basic={!user.is_admin}
					size='mini'
					color='grey'
					content='Admin'
					style={{ float: 'right' }}
					value={user}
					onClick={() => handleClick(user, 'admin')}
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
						onClick={() => handleClick(user, 'update')}>
						{user.is_approved ? 'Revoke Access' : 'Approve'}
					</Button>
					<Button
						basic
						color='black'
						value={user}
						type='button'
						onClick={() => handleClick(user, 'delete')}>
						Delete User
					</Button>
				</div>
			</Card.Content>
		</Card>
	)
}