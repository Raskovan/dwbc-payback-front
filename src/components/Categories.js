import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FormEdit from './FormEdit'
import CategoryCard from './CategoryCard'
import {
	deleteCategory,
	updateCategory,
	addItem,
	editData,
	addData
} from '../actions'
import {
	Card,
	Button,
	Grid,
	Header,
	Container,
	Loader
} from 'semantic-ui-react'

class Categories extends Component {
	chunkArray(myArray, size) {
		var results = []
		while (myArray.length) {
			results.push(myArray.splice(0, size))
		}
		return results
	}

	render() {
		const {
			dataToEdit,
			categories,
			dispatch,
			isFetchingCategory,
			selectedCity
		} = this.props

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
					basic
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

		let countIndex = 0
		let cardInRow = Math.ceil(categories.length / 3)
		let copyArray = [...categories]
		let splitedArray = this.chunkArray(copyArray, cardInRow)
		let eachColumn = splitedArray.map((columnCat, index) => {
			return columnCat.map((eachCat, i) => {
				countIndex++
				if (index === splitedArray.length - 1 && i === columnCat.length - 1) {
					return (
						<div key={i}>
							<CategoryCard category={eachCat} i={countIndex} />
							{dataToEdit.newCategory ? (
								<Card fluid>
									<Card.Content>
										<FormEdit />
									</Card.Content>
								</Card>
							) : (
								addCatButton
							)}
						</div>
					)
				} else {
					return <CategoryCard category={eachCat} i={countIndex} key={i} />
				}
			})
		})

		let catHeader = selectedCity.city_name
			? selectedCity.city_name
			: 'Pick a City...'

		return (
			<Container style={{ margin: '0!important' }}>
				{isFetchingCategory && categories.length === 0 && <Loader />}
				<Grid columns={3} stackable>
					<Grid.Row>
						<Grid.Column>
							<Header as='h2' color='grey'>
								{catHeader}
							</Header>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row style={{ paddingTop: '0' }}>
						{!isFetchingCategory && categories.length === 0 && (
							<Grid.Column>{addCatButton}</Grid.Column>
						)}
						{eachColumn.map((column, i) => (
							<Grid.Column key={i}>{column}</Grid.Column>
						))}
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
		deleteCategory,
		isFetchingCategory,
		updateCategory,
		addItem,
		editData,
		selectedCity
	}
}

export default connect(mapStateToProps)(Categories)
