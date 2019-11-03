import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../styles/categories.css'
import '../styles/header-menu.css'
import { connect } from 'react-redux'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import FormEdit from './FormEdit'
import CategoryCard from './CategoryCard'
import { addData, categoryReorder, updateCategoriesOrder } from '../actions'
import {
	Card,
	Button,
	Grid,
	Header,
	Container,
	Loader,
	Ref
} from 'semantic-ui-react'

class Categories extends Component {
	chunkArray(myArray, size) {
		var results = []
		while (myArray.length) {
			results.push(myArray.splice(0, size))
		}
		return results
	}

	onDragEnd = (result, cardInRow) => {
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

		let categoriesToReorderArr = Array.from(categories)

		let movedCategory = categoriesToReorderArr.filter(
			category => category._id === draggableId
		)
		let columnNum = destination.droppableId.split('+')[1]

		categoriesToReorderArr.splice(source.index, 1)
		categoriesToReorderArr.splice(
			destination.index + cardInRow * parseInt(columnNum),
			0,
			movedCategory[0]
		)

		dispatch(
			updateCategoriesOrder(selectedCity.city_id, categoriesToReorderArr)
		)

		dispatch(categoryReorder(categoriesToReorderArr, selectedCity.city_id))
	}

	render() {
		const {
			dataToEdit,
			categories,
			dispatch,
			isFetchingCategory,
			selectedCity
		} = this.props
		let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

		let addCatButton
		if (dataToEdit.newCategory) {
			addCatButton = (
				<Card fluid>
					<Card.Content>
						<FormEdit />
					</Card.Content>
				</Card>
			)
		} else {
			addCatButton = (
				<Button
					basic={darkMode ? false : darkMode}
					fluid
					type='button'
					onClick={() =>
						dispatch(
							addData({
								newCategory: true,
								category_name: '',
								category_price: ''
							})
						)
					}>
					Add Category
				</Button>
			)
		}
		// Splitting categories array into 3 columns
		let cardInRow = Math.ceil(categories.length / 3)
		let copyArray = [...categories]
		let splitedArray = this.chunkArray(copyArray, cardInRow)
		let eachColumn = splitedArray.map((columnCat, index) => {
			return (
				<Droppable droppableId={`column+${index}`} index={index}>
					{provided => (
						<Ref innerRef={provided.innerRef}>
							<div {...provided.droppableProps}>
								{columnCat.map((eachCat, i) => {
									return (
										<CategoryCard
											{...provided.droppableProps}
											{...provided.dragHandleProps}
											category={eachCat}
											index={i}
											key={i}
											i={categories.findIndex(
												element => element._id === eachCat._id
											)}
										/>
									)
								})}
								{provided.placeholder}
								{index === splitedArray.length - 1 ? (
									<div>
										{dataToEdit.newCategory ? (
											<Card fluid>
												<Card.Content className='item_color'>
													<FormEdit />
												</Card.Content>
											</Card>
										) : (
											addCatButton
										)}
									</div>
								) : null}
							</div>
						</Ref>
					)}
				</Droppable>
			)
		})

		let catHeader = selectedCity.city_name
			? selectedCity.city_name
			: 'Pick a City...'

		return (
			<Container style={{ margin: '0!important' }}>
				{isFetchingCategory && categories.length === 0 && <Loader />}
				<Grid columns={3} stackable style={{ margin: '0' }}>
					<Grid.Row>
						<Grid.Column>
							<Header
								className='header-title'
								as='h2'
								color={darkMode ? 'white' : '#d5d5d5'}>
								{catHeader}
							</Header>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row style={{ paddingTop: '0' }}>
						{/* If there are no categories show add button */}
						{!isFetchingCategory && categories.length === 0 && (
							<Grid.Column>{addCatButton}</Grid.Column>
						)}
						<DragDropContext
							onDragEnd={result => this.onDragEnd(result, cardInRow)}>
							{eachColumn.map((column, index) => (
								<Droppable
									droppableId='all-columns'
									direction='horizontal'
									type='column'
									key={index}
									index={index}>
									{provided => (
										<Grid.Column {...provided.droppableProps}>
											<Ref innerRef={provided.innerRef}>{column}</Ref>
											{provided.placeholder}
										</Grid.Column>
									)}
								</Droppable>
							))}
						</DragDropContext>
					</Grid.Row>
				</Grid>
			</Container>
		)
	}
}

Categories.propTypes = {
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
		isFetchingCategory,
		selectedCity
	}
}

export default connect(mapStateToProps)(Categories)
