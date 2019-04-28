import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  editData,
  clearData,
	editDataOnChange,
	updateCategory,
	updateItem,
	addItem,
	addCategoryForCity
} from '../actions'


class Form extends Component {
  render() {
    const {
			dataToEdit,
			dispatch,
			selectedCity
		} = this.props
		return (
			<form
				onSubmit={e => {
          e.preventDefault()
					if (dataToEdit.category_name && !dataToEdit.newCategory) {
						dispatch(updateCategory(selectedCity.city_id, dataToEdit))
					} else if (dataToEdit.item_name && !dataToEdit.cat_id) {
						dispatch(
							updateItem(
								selectedCity.city_id,
								this.props.catId,
								dataToEdit
							)
						)
					} else if (this.props.catId) {
						dispatch(
							addItem(
								selectedCity.city_id,
								this.props.catId,
								dataToEdit
							)
						)
					} else if (dataToEdit.newCategory) {
						dispatch(
							addCategoryForCity(
								selectedCity.city_id,
								dataToEdit.category_name,
								dataToEdit.category_price
							)
						)
					}
					dispatch(clearData(null))
				}}>
				<input
					name={
						'category_name' in dataToEdit ? 'category_name' : 'item_name'
					}
					type='text'
					value={dataToEdit.item_name || dataToEdit.category_name}
					onChange={e => dispatch(editDataOnChange(e))}
				/>
				{(dataToEdit.items && dataToEdit.items.length === 0) ||
				'item_name' in dataToEdit ||
				dataToEdit.newCategory ? (
					<input
						name={
							'category_price' in dataToEdit
								? 'category_price'
								: 'item_price'
						}
						type='text'
						value={dataToEdit.item_price || dataToEdit.category_price}
						onChange={e => dispatch(editDataOnChange(e))}
					/>
				) : null}
				<input type='submit' value='Save' />
				<button type='button' onClick={() => dispatch(editData(null))}>
					Cancel
				</button>
			</form>
		)
	}
}

function mapStateToProps(state) {
	const { dataToEdit, selectedCity } = state

	return {
    selectedCity,
		dataToEdit
	}
}

export default connect(mapStateToProps)(Form)