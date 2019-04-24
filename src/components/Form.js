import React, { Component } from 'react'

export default class Form extends Component {
	render() {
		return (
			<form onSubmit={this.props.submit}>
				<input
					name={this.props.category.category_name ? 'category_name' : 'item_name'}
					type='text'
					value={
						this.props.category.item_name ||
						this.props.category.category_name
					}
					onChange={this.props.change}
				/>
				{(this.props.category.items && this.props.category.items.length === 0) ||
				'item_price' in this.props.category ? (
					<input
						name={'category_price' in this.props.category ? 'category_price' : 'item_price'}
						type='text'
						value={
							this.props.category.item_price ||
							this.props.category.category_price
						}
						onChange={this.props.change}
					/>
				) : null}
				<input type='submit' value='Save' />
				<button type='button' onClick={() => this.props.cancel(null, '')}>
					Cancel
				</button>
			</form>
		)
	}
}
