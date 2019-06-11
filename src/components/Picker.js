import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
	fetchCategoriesForCityIfNeeded,
	selectCity,
	editDataOnChange
} from '../actions'
import { Dropdown } from 'semantic-ui-react'

function Picker(props) {
	const { dispatch, isFetchingCities, allCities, selectedCity } = props

	const handleChange = (event, data) => {
		//event and data are semantic specs passed from onChange
		if (props.match.path === '/signup') {
			let combinedEvent = {
				target: {
					name: data.name,
					value: data.value
				}
			}
			dispatch(editDataOnChange(combinedEvent))
		} else {
			let nextCity
			for (let i = 0; i < props.allCities.length; i++) {
				if (props.allCities[i].city_id === data.value) {
					nextCity = props.allCities[i]
				}
			}
			dispatch(selectCity(nextCity))
			if (nextCity) {
				dispatch(fetchCategoriesForCityIfNeeded(nextCity.city_id))
				props.history.push(
					`/${nextCity.city_name.replace(' ', '_').toLowerCase()}`
				)
			} else props.history.push(`/`)
		}
	}

	let cityOptions = allCities.map(city => ({
		value: city.city_id,
		key: city._id,
		text: city.city_name
	}))
	let fluidValue = false
	if (props.match.path === '/signup') {
		fluidValue = true
	}

		return (
			<div>
					<div style={{ opacity: isFetchingCities ? 0.5 : 1 }}>
						<Dropdown
							loading = {isFetchingCities && selectedCity && allCities.length === 0 ? true : false}
							name='cityId'
							placeholder={
								!isFetchingCities && allCities.length === 0
									? 'Empty'
									: 'Select a city to manage'
							}
							fluid={fluidValue}
							selection
							clearable
							value={selectedCity.city_id}
							onChange={handleChange}
							options={cityOptions}
						/>
					</div>
			</div>
		)
}

Picker.propTypes = {
	selectedCity: PropTypes.object.isRequired,
	allCities: PropTypes.array.isRequired,
	isFetchingCities: PropTypes.bool.isRequired
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
