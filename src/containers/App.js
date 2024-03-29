import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
	fetchCitiesIfNeeded,
	fetchCategoriesForCityIfNeeded,
	selectCity
} from '../actions'
import Categories from '../components/Categories'
import { Segment } from 'semantic-ui-react'

class App extends Component {
	componentDidMount() {
		const { dispatch, match, user } = this.props
		if (user.is_admin) {
			if (match.params.name) {
				let decodedName = this.decodeParamName(match.params.name)
				dispatch(fetchCitiesIfNeeded(decodedName))
				this.props.history.push(
					`/${match.params.name.replace(' ', '_').toLowerCase()}`
				)
			} else {
				this.props.history.push('/')
			}
		} else if (user.is_approved) {
			dispatch(selectCity({ city_id: user.city_id, city_name: user.city_name }))
			dispatch(fetchCategoriesForCityIfNeeded(user.city_id))
		} else {
			// dispatch(fetchCitiesIfNeeded(user.city_name))
			this.props.history.push(
				`/${user.city_name.replace(' ', '_').toLowerCase()}`
			)
		}
	}

	componentDidUpdate(prevProps) {
		const { dispatch, selectedCity, cities, user } = this.props
		if (user.is_admin) {
			if (this.props.selectedCity !== prevProps.selectedCity) {
				dispatch(fetchCategoriesForCityIfNeeded(selectedCity.city_id))
			} else if (this.props.match.params.name !== prevProps.match.params.name) {
				let decodedName = this.decodeParamName(this.props.match.params.name)
				let newCity = cities.cityList.find(city => {
					return decodedName === city.city_name
				})
				if (newCity) {
					dispatch(selectCity(newCity))
					dispatch(fetchCategoriesForCityIfNeeded(newCity.city_id))
				}
			}
		} else {
			if (this.props.match.params.name === prevProps.match.params.name) {
				let curCity = {
					city_id: user.city_id,
					city_name: user.city_name
				}
				dispatch(fetchCategoriesForCityIfNeeded(curCity.city_id))
			}
		}
	}

	decodeParamName(params) {
		let splitName = params.split('_')
		let decodedName = []
		splitName.forEach(word => {
			decodedName.push(word.charAt(0).toUpperCase() + word.slice(1))
		})
		return (decodedName = decodedName.join(' '))
	}

	render() {
		return (
			<Segment basic style={{ height: '100%' }}>
				<Categories />
				<Segment basic />
			</Segment>
		)
	}
}

App.propTypes = {
	selectedCity: PropTypes.object.isRequired,
	lastUpdatedCategory: PropTypes.number,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { selectedCity, user } = state

	const { cities } = state

	return {
		selectedCity,
		cities,
		user
	}
}

export default withRouter(connect(mapStateToProps)(App))
