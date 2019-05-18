import React, { Component } from 'react'
import Categories from '../components/Categories'
import { Segment } from 'semantic-ui-react';

export default class CityView extends Component {
	render() {
		return (
			<Segment basic style={{ height: '100%' }}>
				<Categories />
				<Segment basic/>
			</Segment>
		)
	}
}