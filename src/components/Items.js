import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { deleteItem, editData } from '../actions'
import Form from './Form'

class Items extends Component {

	render() {
    const { dispatch, dataToEdit, cityId } = this.props
		return (
			<div>
				{this.props.category.items.map((item, i) => (
					<ul key={i}>
						{dataToEdit._id === item._id && !dataToEdit.newCategory ? (
							<Form catId={this.props.category._id} />
						) : (
							<li>
								{item.item_price
									? item.item_name + ' - $' + item.item_price
									: item.item_name}
								<button onClick={() => dispatch(editData(item))}>
									Edit
								</button>
								<button
									onClick={() =>
										dispatch(
											deleteItem(cityId, this.props.category._id, item._id)
										)
									}>
									Delete
								</button>
							</li>
						)}
					</ul>
				))}
			</div>
		)
	}
}

Items.propTypes = {
	category: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedCity, dataToEdit } = state

  	return {
      cityId: selectedCity.city_id,
      dataToEdit
		}
}

export default connect(mapStateToProps)(Items)