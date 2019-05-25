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
	itemsReorder,
	updateItemsInCategory
} from '../actions'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

class CategoryCard extends Component {
	onDragEnd = result => {
		// REODERING
		const { selectedCity, dispatch, categories } = this.props
		const { destination, source, draggableId } = result

		if (!destination) {
			return
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return
		}

		let reorderedCategory = categories.filter(
			cat => cat._id === source.droppableId
		)
		let reordedItemsArr = Array.from(reorderedCategory[0].items)
		let movedItem = reordedItemsArr.filter(item => item._id === draggableId)
		reordedItemsArr.splice(source.index, 1)
		reordedItemsArr.splice(destination.index, 0, movedItem[0])

		dispatch(
			updateItemsInCategory(
				selectedCity.city_id,
				reorderedCategory[0],
				reordedItemsArr
			)
		)

		dispatch(
			itemsReorder(reordedItemsArr, reorderedCategory, selectedCity.city_id)
		)
	}

	render() {
		const { dataToEdit, dispatch, isFetchingCategory, category, i } = this.props
		return (
			<Draggable draggableId={category._id} key={category._id} index={i}>
				{(provided, snapshot) => (
					<Ref innerRef={provided.innerRef}>
						<Card
							{...provided.draggableProps}
							{...provided.dragHandleProps}
							fluid>
							{category._id !== dataToEdit._id || dataToEdit.newCategory ? (
								<Card.Content
									style={{
										background: '#f5f2f2',
										opacity: isFetchingCategory ? 0.5 : 1
									}}>
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
											? `${i + 1}. ${category.category_name} - $${
													category.category_price
											  }`
											: `${i + 1}. ${category.category_name}`}
									</Card.Header>
								</Card.Content>
							) : (
								<Card.Content>
									<FormEdit />
								</Card.Content>
							)}
							{/* Items in Category */}
							{category.items.length > 0 ? (
								<DragDropContext onDragEnd={this.onDragEnd}>
									<Droppable droppableId={category._id}>
										{provided => (
											<Ref innerRef={provided.innerRef}>
												<Card.Content {...provided.droppableProps}>
													{category.items.map((item, i) => (
														<Items
															{...provided.droppableProps}
															item={item}
															index={i}
															key={i}
															category={category}
														/>
													))}
													{provided.placeholder}
												</Card.Content>
											</Ref>
										)}
									</Droppable>
								</DragDropContext>
							) : null}

							{category._id === dataToEdit.cat_id &&
							!dataToEdit.newCategory ? (
								<Card.Content>
									<FormEdit catId={dataToEdit.cat_id} />
								</Card.Content>
							) : null}

							{!category.category_price ? (
								<Card.Content
									>
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
					</Ref>
				)}
			</Draggable>
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
