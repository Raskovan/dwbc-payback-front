import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { deleteItem, editData } from '../actions'
import FormEdit from './FormEdit'
import { Card, Button } from 'semantic-ui-react'

class Items extends Component {
	render() {
		const { dispatch, dataToEdit, cityId } = this.props
		return (
			<div>
				{this.props.category.items.map((item, i) => (
					<Card key={i} fluid>
						{dataToEdit._id === item._id && !dataToEdit.newCategory ? (
							<Card.Content>
								<FormEdit catId={this.props.category._id} />
							</Card.Content>
						) : (
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
				))}
			</div>
		)
	}
}

Items.propTypes = {
	category: PropTypes.object.isRequired,
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
