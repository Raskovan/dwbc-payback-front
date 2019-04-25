import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Items from './Items'
import Form from './Form'
import { deleteCategory, updateCategory, addItem } from '../actions'

class Categories extends Component {
	constructor(props) {
		super(props)
		this.state = {
			categoryToEdit: {},
			itemToAdd: { item_name: ' ', item_price: ' ' }
		}
		this.handleEditAddToCategory = this.handleEditAddToCategory.bind(this)
	}

	handleDelete(category) {
		this.props.deleteCategory(this.props.cityId, category._id)
	}

	handleItemChange = event => {
		let itemCopy = { ...this.state.itemToAdd }
		itemCopy[event.target.name] = event.target.value
		this.setState({ itemToAdd: itemCopy })
	}

	handleCategoryChange = event => {
		let catCopy = { ...this.state.categoryToEdit }
    catCopy[event.target.name] = event.target.value
		this.setState({ categoryToEdit: catCopy })
	}

	handleSaveItem = event => {
		event.preventDefault()
		this.props.addItem(
			this.props.cityId,
			this.state.categoryToEdit._id,
			this.state.itemToAdd
		)
		this.setState({
			itemToAdd: { item_name: ' ', item_price: ' ' },
			categoryToEdit: {}
		})
	}

	handleEditAddToCategory(category, value) {
		if (value === 'category') {
			category.category = true
			category.item = false
		} else if (value === 'item') {
			category.item = true
			category.category = false
		}
		if (category) {
			if (category.category_price === null) {
				category.category_price = ''
			}
			this.setState({ categoryToEdit: category })
		} else {
			this.setState({
				categoryToEdit: {},
				itemToAdd: { item_name: ' ', item_price: ' ' }
			})
		}
	}

	handleUpdateCategory = event => {
    console.log('UPDATE', this.state.categoryToEdit)
    event.preventDefault()
		this.props.updateCategory(this.props.cityId, this.state.categoryToEdit)
		this.setState({ categoryToEdit: {} })
	}

	render() {
		return (
			<ul>
				{this.props.categories.map((category, i) => (
					<div key={i}>
						{category._id !== this.state.categoryToEdit._id ||
						!this.state.categoryToEdit.category ? (
							<li>
								{category.category_price
									? `${category.category_name} - $${category.category_price}`
									: `${category.category_name}`}
								<button
									type='button'
									onClick={() =>
										this.handleEditAddToCategory(category, 'category')
									}>
									Edit
								</button>
								<button
									type='button'
									onClick={() => this.handleDelete(category)}>
									Delete
								</button>
								{!category.category_price ? (
									<button
										type='button'
										onClick={() =>
											this.handleEditAddToCategory(category, 'item')
										}>
										Add Item
									</button>
								) : null}
							</li>
						) : (
							<li>
								<Form
									data={this.state.categoryToEdit}
									submit={this.handleUpdateCategory}
									change={this.handleCategoryChange}
									cancel={this.handleEditAddToCategory}
								/>
							</li>
						)}
						<Items category={category} />
						{category._id === this.state.categoryToEdit._id &&
						this.state.categoryToEdit.item ? (
							<Form
								data={this.state.itemToAdd}
								submit={this.handleSaveItem}
								change={this.handleItemChange}
								cancel={this.handleEditAddToCategory}
							/>
						) : null}
					</div>
				))}
			</ul>
		)
	}
}

Categories.propTypes = {
	categories: PropTypes.array.isRequired
}

const mapStateToProps = state => {
	return {
		cityId: state.selectedCity.city_id
	}
}

export default connect(
	mapStateToProps,
	{ deleteCategory, updateCategory, addItem }
)(Categories)
