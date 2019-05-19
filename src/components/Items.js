import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deleteItem, editData } from '../actions'
import FormEdit from './FormEdit'
import { Card, Button, Ref } from 'semantic-ui-react'
import { Draggable } from 'react-beautiful-dnd'

class Items extends Component {
	render() {
		const { dispatch, dataToEdit, cityId, item, index } = this.props
		return (
			<Draggable
				draggableId={item._id}
				key={item._id}
				index={index}>
				{provided => (
					<Ref innerRef={provided.innerRef}>
						<Card
							{...provided.draggableProps}
							{...provided.dragHandleProps}
							fluid>
							{dataToEdit._id === item._id && !dataToEdit.newCategory ? (
								<Card.Content>
									<FormEdit catId={this.props.category._id} />
								</Card.Content>
							) : (
								// Card Item
								<Card.Content>
									<strong>
										{item.item_price
											? item.item_name + ' - $' + item.item_price
											: item.item_name}
									</strong>
									<Button.Group size='mini' floated='right'>
										<Button
											basic
											color='green'
											onClick={() => dispatch(editData(item))}>
											Edit
										</Button>
										<Button
											basic
											color='red'
											onClick={() =>
												dispatch(
													deleteItem(
														cityId,
														this.props.category._id,
														item._id
													)
												)
											}>
											Delete
										</Button>
									</Button.Group>
								</Card.Content>
							)}
						</Card>
					</Ref>
				)}
			</Draggable>
		)
	}
}

Items.propTypes = {
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { selectedCity, dataToEdit } = state

	return {
		cityId: selectedCity.city_id,
		dataToEdit
	}
}

export default connect(mapStateToProps)(Items)
