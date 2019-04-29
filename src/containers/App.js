import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
	invalidateCity,
	fetchCitiesIfNeeded,
	fetchCategoriesForCityIfNeeded,
	selectCity,
	addData
} from '../actions'
import Picker from '../components/Picker'
import Categories from '../components/Categories'
import Form from '../components/Form'

class App extends Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.handleRefreshClick = this.handleRefreshClick.bind(this)
	}

	componentDidMount() {
		const { dispatch, selectedCity } = this.props
		dispatch(fetchCitiesIfNeeded())
      dispatch(fetchCategoriesForCityIfNeeded(selectedCity.city_id))
      if ('city_id' in selectedCity){
        this.props.history.push(`/${selectedCity.city_id}`)
      } else {
        this.props.history.push('/')
      }
	}

	componentDidUpdate(prevProps) {
		if (this.props.selectedCity !== prevProps.selectedCity) {
			const { dispatch, selectedCity } = this.props
			dispatch(fetchCategoriesForCityIfNeeded(selectedCity.city_id))
		}
	}

	handleChange(nextCityId) {
		let nextCity
		for (let i = 0; i < this.props.allCities.length; i++) {
			if (this.props.allCities[i].city_id === nextCityId) {
				nextCity = this.props.allCities[i]
			}
		}
		this.props.dispatch(selectCity(nextCity))
    this.props.dispatch(fetchCategoriesForCityIfNeeded(nextCity.city_id))
    this.props.history.push(`/${nextCity.city_id}`)
	}

	handleRefreshClick(e) {
		e.preventDefault()

		const { dispatch, selectedCity } = this.props
		dispatch(invalidateCity(selectedCity.city_id))
		dispatch(fetchCategoriesForCityIfNeeded(selectedCity.city_id))
	}

	render() {
		const {
			selectedCity,
			categories,
			isFetchingCategory,
			isFetchingCities,
			lastUpdatedCategory,
      allCities,
      dispatch,
      dataToEdit
		} = this.props
		return (
      <div>
				{isFetchingCities && selectedCity && allCities.length === 0 && (
          <h2>Loading...</h2>
				)}
				{!isFetchingCities && allCities.length === 0 && <h2>Empty.</h2>}
					<div style={{ opacity: isFetchingCities ? 0.5 : 1 }}>
                <Picker
                  value={selectedCity}
                  onChange={this.handleChange}
                  options={allCities}
                />
					</div>
				<p>
					{lastUpdatedCategory && (
            <span>
							Last updated at{' '}
							{new Date(lastUpdatedCategory).toLocaleTimeString()}.{' '}
						</span>
					)}
					{!isFetchingCategory && (
            <button onClick={this.handleRefreshClick}>Refresh</button>
					)}
				</p>
        <Route
          path='/:id'
          render={ renderProps => {
            let cityId = renderProps.match.params.id
            let pathCity = allCities.find(city => {
              return city.city_id === cityId
            })
            dispatch(fetchCategoriesForCityIfNeeded(pathCity.city_id))
          }}>

				{isFetchingCategory && categories.length === 0 && (
					<h2>Loading...</h2>
				)}
				{!isFetchingCategory && categories.length === 0 && <h2>Empty.</h2>}
				{categories.length > 0 && (
					<div style={{ opacity: isFetchingCategory ? 0.5 : 1 }}>
						<Categories />
					</div>
				)}
				{dataToEdit.newCategory ? (
					<Form />
				) : (
					<button
						type='button'
						onClick={() =>
							dispatch(
								addData({
									newCategory: true,
									category_name: '',
									category_price: ''
								})
							)
						}>
						Add Category
					</button>
				)}
      </Route>
			</div>
		)
	}
}

App.propTypes = {
	selectedCity: PropTypes.object.isRequired,
	allCities: PropTypes.array.isRequired,
	isFetchingCities: PropTypes.bool.isRequired,
	isFetchingCategory: PropTypes.bool.isRequired,
	lastUpdatedCities: PropTypes.number,
	lastUpdatedCategory: PropTypes.number,
	dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { selectedCity, categoriesByCity, dataToEdit } = state
	const {
		isFetchingCategory,
		lastUpdatedCategory,
		categories
	} = categoriesByCity[selectedCity.city_id] || {
		isFetchingCategory: true,
		categories: []
	}

	const { cities } = state
	const {
		isFetchingCities,
		lastUpdatedCities,
		cityList: allCities
	} = cities || {
		isFetchingCities: true,
		cityList: []
	}

	return {
		isFetchingCities,
		lastUpdatedCities,
		isFetchingCategory,
		lastUpdatedCategory,
		allCities,
		categories,
    selectedCity,
    dataToEdit
	}
}

export default withRouter(connect(mapStateToProps)(App))