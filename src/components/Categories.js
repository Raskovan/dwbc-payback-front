import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Items from './Items'
import { deleteCategory, updateCategory, addItem } from '../actions'

class Categories extends Component {
	constructor(props) {
		super(props)
		this.state = {
			categoryToUpdate: {},
			categoryToAddItem: {},
			itemToAdd: { item_name: '', item_price: '' }
		}
	}

	handleDelete(category) {
		this.props.deleteCategory(this.props.cityId, category._id)
	}

	handleAddItem(category) {
		if (category) {
			this.setState({ categoryToAddItem: category })
		} else {
			this.setState({
				categoryToAddItem: {}
			})
		}
	}

	handleItemChange = event => {
		let itemCopy = { ...this.state.itemToAdd }
		itemCopy[event.target.name] = event.target.value
		this.setState({ itemToAdd: itemCopy })
	}

	handleSaveItem = event => {
		event.preventDefault()
		this.props.addItem(
			this.props.cityId,
			this.state.categoryToAddItem._id,
			this.state.itemToAdd
		)
		this.setState({
			itemToAdd: { item_name: '', item_price: '' },
			categoryToAddItem: {}
		})
	}

	handleEdit(category) {
		if (category) {
			if (!category.category_price) {
				category.category_price = ''
			}
			this.setState({ categoryToUpdate: category })
		} else {
			this.setState({ categoryToUpdate: {} })
		}
	}

	handleUpdateCategory = event => {
		event.preventDefault()
		this.props.updateCategory(this.props.cityId, this.state.categoryToUpdate)
		this.setState({ categoryToUpdate: {} })
	}

	handleCategoryChange = event => {
		let catCopy = { ...this.state.categoryToUpdate }
		catCopy[event.target.name] = event.target.value
		this.setState({ categoryToUpdate: catCopy })
	}

	render() {
		return (
			<ul>
				{this.props.categories.map((category, i) => (
					<div key={i}>
						{category._id !== this.state.categoryToUpdate._id ? (
							<li>
								{category.category_price
									? `${category.category_name} - $${category.category_price}`
									: `${category.category_name}`}
								<button type='button' onClick={() => this.handleEdit(category)}>
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
										onClick={() => this.handleAddItem(category)}>
										Add Item
									</button>
								) : null}
							</li>
						) : (
							<li>
								<form onSubmit={this.handleUpdateCategory}>
									<input
										name='category_name'
										type='text'
										value={this.state.categoryToUpdate.category_name}
										onChange={this.handleCategoryChange}
									/>
									{category.items.length === 0 ? (
										<input
											name='category_price'
											type='number'
											value={this.state.categoryToUpdate.category_price}
											onChange={this.handleCategoryChange}
										/>
									) : null}
									<input type='submit' value='Update' />
									<button type='button' onClick={() => this.handleEdit(null)}>
										Cancel
									</button>
								</form>
							</li>
						)}
						{category._id === this.state.categoryToAddItem._id ? (
							<form onSubmit={this.handleSaveItem}>
								<input
									name='item_name'
									type='text'
									value={this.state.itemToAdd.item_name}
									onChange={this.handleItemChange}
								/>
								<input
									name='item_price'
									type='text'
									value={this.state.itemToAdd.item_price}
									onChange={this.handleItemChange}
								/>
								<input type='submit' value='Save' />
								<button type='button' onClick={() => this.handleAddItem(null)}>
									Cancel
								</button>
							</form>
						) : null}
						<Items items={category.items} />
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
