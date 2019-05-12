import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Items from './Items'
import Form from './Form'
import {
	deleteCategory,
	updateCategory,
	addItem,
	editData,
	addData
} from '../actions'

class Categories extends Component {
	render() {
		const {
			dataToEdit,
			categories,
			dispatch,
			isFetchingCategory,
			selectedCity
		} = this.props
		return (
			<div>
				{selectedCity.city_id && (
					<div>
						{isFetchingCategory && categories.length === 0 && (
							<h2>Loading...</h2>
						)}
						{!isFetchingCategory && categories.length === 0 && (
							<h2>Empty.</h2>
						)}
						<div style={{ opacity: isFetchingCategory ? 0.5 : 1 }}>
							<ul>
								{categories.map((category, i) => (
									<div key={i}>
										{category._id !== dataToEdit._id ||
										!dataToEdit.category_name ||
										dataToEdit.newCategory ? (
											<li>
												{category.category_price
													? `${category.category_name} - $${
															category.category_price
													  }`
													: `${category.category_name}`}
												<button
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
												</button>
												<button
													type='button'
													onClick={() =>
														dispatch(
															deleteCategory(
																this.props.cityId,
																category._id
															)
														)
													}>
													Delete
												</button>
												{!category.category_price ? (
													<button
														type='button'
														onClick={() =>
															dispatch(
																editData({
																	newCategory: false,
																	cat_id: category._id,
																	item_name: ' ',
																	item_price: ' '
																})
															)
														}>
														Add Item
													</button>
												) : null}
											</li>
										) : (
											<li>
												<Form />
											</li>
										)}
										<Items category={category} />
										{category._id === dataToEdit.cat_id &&
										!dataToEdit.newCategory ? (
											<Form catId={dataToEdit.cat_id} />
										) : null}
									</div>
								))}
							</ul>
						</div>
						{dataToEdit.newCategory ? (
							<Form />
						) : (
							<button
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
							</button>
						)}
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
		const {
			isFetchingCategory,
			categories
		} = categoriesByCity[selectedCity.city_id] || {
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
