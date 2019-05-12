import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class Picker extends Component {
	render() {
		const {
			city,
			onChange,
			options,
			isFetchingCities,
			allCities,
			selectedCity
		} = this.props
		return (
			<div>
				{isFetchingCities && selectedCity && allCities.length === 0 && (
					<h2>Loading...</h2>
				)}
				{!isFetchingCities && allCities.length === 0 && <h2>Empty.</h2>}
				<div style={{ opacity: isFetchingCities ? 0.5 : 1 }}>
					<select name='cityId' value={city.city_id} onChange={onChange}>
						<option value=''>Select city...</option>
						{options.map(option => (
							<option value={option.city_id} key={option._id}>
								{option.city_name}
							</option>
						))}
					</select>
				</div>
			</div>
		)
	}
}

Picker.propTypes = {
	selectedCity: PropTypes.object.isRequired,
	allCities: PropTypes.array.isRequired,
	isFetchingCities: PropTypes.bool.isRequired,
	options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
	onChange: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { cities, selectedCity } = state

	const {
		isFetchingCities,
		cityList: allCities
	} = cities || {
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


