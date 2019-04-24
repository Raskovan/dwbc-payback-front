import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { deleteItem } from '../actions'

class Items extends Component {

	handleDelete = (itemId) => {
		this.props.deleteItem(this.props.cityId, this.props.category._id, itemId)
  }
  
	render() {
		return (
			<ul>
				{this.props.category.items.map((item, i) =>
					item.item_price ? (
						<li key={i}>
							{item.item_name} - ${item.item_price}
							<button>Edit</button>
							<button onClick={() => this.handleDelete(item._id)}>Delete</button>
						</li>
					) : (
						<li key={i}>
							{item.item_name}
							<button>Edit</button>
							<button onClick={() => this.handleDelete(item._id)}>Delete</button>
						</li>
					)
				)}
			</ul>
		)
	}
}

Items.propTypes = {
  category: PropTypes.object.isRequired
};

const mapStateToProps = state => {
	return {
		cityId: state.selectedCity.city_id
	}
}

export default connect(
	mapStateToProps,
	{ deleteItem }
)(Items)