import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
	fetchCitiesIfNeeded,
	fetchCategoriesForCityIfNeeded,
	selectCity
} from '../actions'
import Picker from '../components/Picker'
import Categories from '../components/Categories'
import Header from '../components/Header'

class App extends Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}

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
		} else {
			dispatch(fetchCitiesIfNeeded(user.city_name))
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
				dispatch(selectCity(newCity))
				if (newCity) dispatch(fetchCategoriesForCityIfNeeded(newCity.city_id))
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

	handleChange(event) {
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

	render() {
		const { selectedCity, allCities, user } = this.props
		return (
			<div>
				<Header />

				<h1>{user.city_name ? user.city_name : selectedCity.city_name}</h1>

				{user.is_admin ? (
					<Picker
						city={selectedCity || ''}
						onChange={this.handleChange}
						options={allCities}
					/>
				) : null}
				<Categories />
			</div>
		)
	}
}

App.propTypes = {
	selectedCity: PropTypes.object.isRequired,
	allCities: PropTypes.array.isRequired,
	lastUpdatedCategory: PropTypes.number,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { selectedCity, dataToEdit, user } = state

	const { cities } = state
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
		selectedCity,
		dataToEdit,
		cities,
		user
	}
}

export default withRouter(connect(mapStateToProps)(App))
