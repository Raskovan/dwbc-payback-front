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
import { Card, Button, Container } from 'semantic-ui-react'

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
		
		// let oneArray
		// let splitedArray = this.chunkArray(categories, 2).map(each => {
		// 	return each
		// })
		// // let eachColumn = splitedArray.map((columnCat, i) => {
		// // 		return <CategoryCard category={columnCat} i={i} />
		// // 	}
		// // 	)
		

		return (
			<div>
				{selectedCity.city_id && (
					<Container>
						{isFetchingCategory && categories.length === 0 && (
							<h2>Loading...</h2>
						)}

						{!isFetchingCategory && categories.length === 0 && (
							<h2>Empty.</h2>
						)}

						{/* <div style={{ opacity: isFetchingCategory ? 0.5 : 1 }}> */}

						{categories.map((category, i) => (
							<CategoryCard key={i} category={category} i={i} />
						))} 

						{dataToEdit.newCategory ? (
							<Card>
								<Card.Content>
									<FormEdit />
								</Card.Content>
							</Card>
						) : (
							<Button
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
						)}
					</Container>
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
