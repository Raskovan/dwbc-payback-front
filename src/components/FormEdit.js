import React from 'react'
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
import { Form, Button } from 'semantic-ui-react'

function FormEdit(props) {
	const { dataToEdit, dispatch, selectedCity } = props
	return (
		<Form
			onSubmit={e => {
				e.preventDefault()
				if (dataToEdit.category_name && !dataToEdit.newCategory) {
					dispatch(updateCategory(selectedCity.city_id, dataToEdit))
				} else if (dataToEdit.item_name && !dataToEdit.cat_id) {
					dispatch(updateItem(selectedCity.city_id, props.catId, dataToEdit))
				} else if (props.catId) {
					dispatch(addItem(selectedCity.city_id, props.catId, dataToEdit))
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
			<Form.Field>
				<input
					placeholder={'category_name' in dataToEdit ? 'Category' : 'Item'}
					name={'category_name' in dataToEdit ? 'category_name' : 'item_name'}
					type='text'
					value={dataToEdit.item_name || dataToEdit.category_name || ''}
					onChange={e => dispatch(editDataOnChange(e))}
				/>
			</Form.Field>
			{(dataToEdit.items && dataToEdit.items.length === 0) ||
			'item_name' in dataToEdit ||
			dataToEdit.newCategory ? (
				<Form.Field>
					<input
						placeholder='Price'
						name={
							'category_price' in dataToEdit ? 'category_price' : 'item_price'
						}
						type='number'
						value={dataToEdit.item_price || dataToEdit.category_price || ''}
						onChange={e => dispatch(editDataOnChange(e))}
					/>
				</Form.Field>
			) : null}
			<Button.Group fluid size='small'>
				<Button color='green' type='submit' value='Save' content='Save' />
				<Button
					type='button'
					content='Cancel'
					onClick={() => dispatch(editData(null))}
				/>
			</Button.Group>
		</Form>
	)
}

function mapStateToProps(state) {
	const { dataToEdit, selectedCity } = state

	return {
		selectedCity,
		dataToEdit
	}
}

export default connect(mapStateToProps)(FormEdit)