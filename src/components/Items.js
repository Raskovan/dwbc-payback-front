import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deleteItem, editData } from '../actions'
import FormEdit from './FormEdit'
import { Card, Button, Ref } from 'semantic-ui-react'
import { Draggable } from 'react-beautiful-dnd'
import '../styles/categories.css'

function Items(props) {
	const { dispatch, dataToEdit, cityId, item, index } = props

	return (
		<Draggable draggableId={item._id} key={item._id} index={index}>
			{(provided, snapshot) => (
				<Ref innerRef={provided.innerRef}>
					<Card {...provided.draggableProps} fluid>
						{dataToEdit._id === item._id && !dataToEdit.newCategory ? (
							<Card.Content className='item_color'>
								<FormEdit catId={props.category._id} />
							</Card.Content>
						) : (
							// Card Item
							<Card.Content
								className='item_color'
								style={{
									background: snapshot.isDragging ? '#ebf3f9' : null
								}}>
								<strong {...provided.dragHandleProps}>
									{item.item_price
										? item.item_name + ' - $' + item.item_price
										: item.item_name}
								</strong>
								<Button.Group size='mini' floated='right'>
									<Button
										basic
										color='green'
										content='Edit'
										onClick={() => dispatch(editData(item))}
									/>
									<Button
										basic
										color='red'
										content='Delete'
										onClick={() =>
											dispatch(deleteItem(cityId, props.category._id, item._id))
										}
									/>
								</Button.Group>
							</Card.Content>
						)}
					</Card>
				</Ref>
			)}
		</Draggable>
	)
}

Items.propTypes = {
	dispatch: PropTypes.func.isRequired,
	dataToEdit: PropTypes.object.isRequired,
	item: PropTypes.object.isRequired,
	cityId: PropTypes.string.isRequired
}

function mapStateToProps(state) {
	const { selectedCity, dataToEdit, error } = state

	return {
		cityId: selectedCity.city_id,
		dataToEdit,
		error
	}
}

export default connect(mapStateToProps)(Items)
