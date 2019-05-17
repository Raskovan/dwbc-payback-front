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
import { Card, Button, Grid } from 'semantic-ui-react'

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
		let copyArray = [...categories]
		let splitedArray = this.chunkArray(copyArray, 3)
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
					return (
						<CategoryCard category={eachCat} i={countIndex} key={i} />
					)
				}
			})
		})

		return (
			<div>
				{selectedCity.city_id && (
					<div>
						{isFetchingCategory && categories.length === 0 && (
							<h2>Loading...</h2>
						)}
						<Grid columns={3} stackable padded='vertically'>
							<Grid.Row style={{paddingTop: '0'}}>
								{!isFetchingCategory && categories.length === 0 && (
									<Grid.Column>{addCatButton}</Grid.Column>
								)}
								{eachColumn.map((column, i) => (
									<Grid.Column key={i}>{column}</Grid.Column>
								))}
							</Grid.Row>
						</Grid>
					</div>
				)}
			</div>
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
