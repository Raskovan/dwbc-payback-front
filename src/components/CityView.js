import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Categories from '../components/Categories'
import { Segment, Container, Header } from 'semantic-ui-react';

class CityView extends Component {
	render() {
		const { selectedCity } = this.props
		return (
			<Segment basic style={{ height: '100%' }}>
				<Container>
					<Header as='h2' color='grey'>
						{selectedCity.city_name
							? selectedCity.city_name
							: 'Pick a City...'}
					</Header>
					<Categories />
				</Container>
			</Segment>
		)
	}
}

CityView.propTypes = {
	user: PropTypes.object.isRequired,
	selectedCity: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	const { selectedCity } = state

	return {
		selectedCity
	}
}

export default withRouter(connect(mapStateToProps)(CityView))
