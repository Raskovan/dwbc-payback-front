import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Items from './Items'
import FormEdit from './FormEdit'
import { Card, Button } from 'semantic-ui-react'
import {
	deleteCategory,
	updateCategory,
	editData
} from '../actions'

class CategoryCard extends Component {
  render() {
    		const {
					dataToEdit,
					dispatch,
					isFetchingCategory,
          category,
          i
				} = this.props
    return (
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
									dispatch(deleteCategory(this.props.cityId, category._id))
								}>
								Delete
							</Button>
						</Button.Group>
						<Card.Header>
							{category.category_price
								? `${category.order}. ${category.category_name} - $${
										category.category_price
								  }`
								: `${category.order}. ${category.category_name}`}
						</Card.Header>
					</Card.Content>
				) : (
					<Card.Content>
						<FormEdit />
					</Card.Content>
				)}
				<Card.Content style={{ borderTop: '0' }}>
					<Items category={category} />
				</Card.Content>

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
