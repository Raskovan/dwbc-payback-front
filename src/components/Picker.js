import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
	fetchCategoriesForCityIfNeeded,
	selectCity,
	editDataOnChange
} from '../actions'

class Picker extends Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		if (this.props.match.path === '/signup'){
			const { dispatch } = this.props
			dispatch(editDataOnChange(event))
		} else {
			let nextCity
			for (let i = 0; i < this.props.allCities.length; i++) {
				if (this.props.allCities[i].city_id === event.target.value) {
					nextCity = this.props.allCities[i]
				}
			}
			this.props.dispatch(selectCity(nextCity))
			if (nextCity) {
				this.props.dispatch(fetchCategoriesForCityIfNeeded(nextCity.city_id))
				this.props.history.push(
					`/${nextCity.city_name.replace(' ', '_').toLowerCase()}`
				)
			} else this.props.history.push(`/`)
		}
	}

	render() {
		const { isFetchingCities, allCities, selectedCity } = this.props
		return (
			<div>
					<div>
						{isFetchingCities && selectedCity && allCities.length === 0 && (
							<h2>Loading...</h2>
						)}
						{!isFetchingCities && allCities.length === 0 && <h2>Empty.</h2>}
						<div style={{ opacity: isFetchingCities ? 0.5 : 1 }}>
							<select
								name='cityId'
								value={selectedCity.city_id}
								onChange={this.handleChange}>
								<option value=''>Select city...</option>
								{allCities.map(city => (
									<option value={city.city_id} key={city._id}>
										{city.city_name}
									</option>
								))}
							</select>
						</div>
					</div>
			</div>
		)
	}
}

Picker.propTypes = {
	selectedCity: PropTypes.object.isRequired,
	allCities: PropTypes.array.isRequired,
	isFetchingCities: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
	const { cities, selectedCity } = state

	const { isFetchingCities, cityList: allCities } = cities || {
		isFetchingCities: true,
		cityList: []
	}

	return {
		isFetchingCities,
		allCities,
		cities,
		selectedCity
	}
}

export default withRouter(connect(mapStateToProps)(Picker))
