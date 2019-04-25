import React, { Component } from 'react'

export default class Form extends Component {
  render() {
		return (
			<form onSubmit={this.props.submit}>
				<input
					name={this.props.data.category_name ? 'category_name' : 'item_name'}
					type='text'
					value={
						this.props.data.item_name ||
						this.props.data.category_name
					}
					onChange={this.props.change}
				/>
				{(this.props.data.items && this.props.data.items.length === 0) ||
				'item_name' in this.props.data ? (
					<input
						name={'category_price' in this.props.data ? 'category_price' : 'item_price'}
						type='text'
						value={
							this.props.data.item_price ||
							this.props.data.category_price
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
