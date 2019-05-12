import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Picker from '../components/Picker'
import Categories from '../components/Categories'

class CityView extends Component {
	render() {
		const { user, selectedCity } = this.props
		return (
			<div>
				<h1>{user.city_name ? user.city_name : selectedCity.city_name}</h1>
				{user.is_admin && <Picker />}
				<Categories />
			</div>
		)
	}
}

CityView.propTypes = {
	user: PropTypes.object.isRequired,
	selectedCity: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	const { user, selectedCity } = state

	return {
		user,
		selectedCity
	}
}

export default withRouter(connect(mapStateToProps)(CityView))
