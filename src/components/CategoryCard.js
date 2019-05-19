import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Items from './Items'
import FormEdit from './FormEdit'
import { Card, Button, Ref } from 'semantic-ui-react'
import {
	deleteCategory,
	updateCategory,
	editData,
	itemsReorder
} from '../actions'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

class CategoryCard extends Component {
	onDragEnd = result => {
		// REODERING
		const { selectedCity, dispatch } = this.props
		const { destination, source, draggableId } = result

		if (!destination){
			return
		}

		if (destination.droppableId === source.droppableId && 
			destination.index === source.index
			){
				return
			}

			dispatch(
				itemsReorder(
					destination,
					source,
					draggableId,
					selectedCity.city_id
				)
			)
	}

	render() {
		const { dataToEdit, dispatch, isFetchingCategory, category, i } = this.props
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Card
					fluid
					key={i}
					style={{
						background: '#f5f2f2',
						opacity: isFetchingCategory ? 0.5 : 1
					}}>
					{category._id !== dataToEdit._id || dataToEdit.newCategory ? (
						<Card.Content>
							<Button.Group size='mini' floated='right'>
								<Button
									basic
									color='green'
									type='button'
									onClick={() =>
										dispatch(
											editData(
												Object.assign({}, category, {
													newCategory: false
												})
											)
										)
									}>
									Edit
								</Button>
								<Button
									basic
									color='red'
									type='button'
									onClick={() =>
										dispatch(
											deleteCategory(this.props.cityId, category._id)
										)
									}>
									Delete
								</Button>
							</Button.Group>
							<Card.Header>
								{category.category_price
									? `${i}. ${category.category_name} - $${
											category.category_price
									  }`
									: `${i}. ${category.category_name}`}
							</Card.Header>
						</Card.Content>
					) : (
						<Card.Content>
							<FormEdit />
						</Card.Content>
					)}
					{/* Items in Category */}

					<Droppable droppableId={category._id}>
						{provided => (
							<Ref innerRef={provided.innerRef}>
							<Card.Content
								{...provided.droppableProps}
								style={{ borderTop: '0' }}>
								{category.items.map((item, i) => (
									<Items item={item} index={i} key={i} category={category} />
								))}
								{provided.placeholder}
							</Card.Content>
							</Ref>
						)}
					</Droppable>

					{category._id === dataToEdit.cat_id && !dataToEdit.newCategory ? (
						<Card.Content>
							<FormEdit catId={dataToEdit.cat_id} />
						</Card.Content>
					) : null}

					{!category.category_price ? (
						<Card.Content style={{ borderTop: '0' }}>
							<Button
								fluid
								type='button'
								onClick={() =>
									dispatch(
										editData({
											newCategory: false,
											cat_id: category._id,
											item_name: '',
											item_price: ''
										})
									)
								}>
								Add Item
							</Button>
						</Card.Content>
					) : null}
				</Card>
			</DragDropContext>
		)
	}
}

CategoryCard.propTypes = {
	categories: PropTypes.array.isRequired,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { selectedCity, categoriesByCity, dataToEdit } = state
	const { isFetchingCategory, categories } = categoriesByCity[
		selectedCity.city_id
	] || {
		isFetchingCategory: true,
		categories: []
	}
	return {
		dataToEdit,
		categories,
		cityId: selectedCity.city_id,
		deleteCategory,
		isFetchingCategory,
		updateCategory,
		editData,
		selectedCity
	}
}

export default connect(mapStateToProps)(CategoryCard)
