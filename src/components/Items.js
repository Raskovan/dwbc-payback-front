import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { deleteItem, updateItem } from '../actions'
import Form from './Form'

class Items extends Component {
	state = {
		itemToEdit: {}
	}

	handleDelete = itemId => {
		this.props.deleteItem(this.props.cityId, this.props.category._id, itemId)
	}

	handleEdit = item => {
		if (item) {
			this.setState({ itemToEdit: item })
		} else {
			this.setState({ itemToEdit: {} })
		}
  }
  
  handleItemChange = event => {
    let itemCopy = { ...this.state.itemToEdit }
    itemCopy[event.target.name] = event.target.value
    this.setState({ itemToEdit: itemCopy })
  }

	handleUpdateItem = event => {
    event.preventDefault()
    this.props.updateItem(
			this.props.cityId,
			this.props.category._id,
			this.state.itemToEdit
    )
    this.setState({ itemToEdit: {} })
  }

	render() {
		return (
			<div>
				{this.props.category.items.map((item, i) => (
					<ul key={i}>
						{this.state.itemToEdit._id === item._id ? (
							<Form
								category={this.state.itemToEdit}
								change={this.handleItemChange}
								cancel={this.handleEdit}
								submit={this.handleUpdateItem}
							/>
						) : (
							<li>
								{item.item_price
									? item.item_name + ' - $' + item.item_price
									: item.item_name}
								<button onClick={() => this.handleEdit(item)}>Edit</button>
								<button onClick={() => this.handleDelete(item._id)}>
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
  category: PropTypes.object.isRequired
};

const mapStateToProps = state => {
	return {
		cityId: state.selectedCity.city_id
	}
}

export default connect(
	mapStateToProps,
	{ deleteItem, updateItem }
)(Items)