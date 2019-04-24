import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  invalidateCity,
  fetchCitiesIfNeeded,
  fetchCategoriesForCityIfNeeded,
  selectCity,
  addCategoryForCity
} from "../actions";
import Picker from '../components/Picker'
import Categories from '../components/Categories'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      category_name: '', 
      category_price: '',
      showCategoryForm: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleCategory = this.handleCategory.bind(this)
    this.handleSubmitCategory = this.handleSubmitCategory.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedCity } = this.props
    dispatch(fetchCitiesIfNeeded())
    dispatch(fetchCategoriesForCityIfNeeded(selectedCity.city_id))
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
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedCity } = this.props
    dispatch(invalidateCity(selectedCity.city_id))
    dispatch(fetchCategoriesForCityIfNeeded(selectedCity.city_id))
  }

  handleCategory(event){
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value})
  }

  handleSubmitCategory(event){
    event.preventDefault()
    const { dispatch, selectedCity } = this.props
    if (this.state.category_name !== ''){
      dispatch(addCategoryForCity(selectedCity.city_id, this.state.category_name, this.state.category_price))
      this.setState({
        category_name: '',
        category_price: '', 
        showCategoryForm: false})
    } else {
      alert('You should enter a name for the category!')
    }
  }

  handleAddCategoryClick = (value) => {
    this.setState({showCategoryForm: value})
    if (!value) {
      this.setState({
				category_name: '',
				category_price: ''
			})
    }
  }
  
  render() {
    const { selectedCity, categories, isFetchingCategory, isFetchingCities, lastUpdatedCategory, allCities } = this.props
    return (
      <div>
        {isFetchingCities && selectedCity && allCities.length === 0 && <h2>Loading...</h2>}
        {!isFetchingCities && allCities.length === 0 && <h2>Empty.</h2>}
        {selectedCity.city_id && allCities.length > 0 && (
          <div style={{ opacity: isFetchingCities ? 0.5 : 1 }}>
            <Picker
              value={selectedCity}
              onChange={this.handleChange}
              options={allCities}
            />
          </div>
        )}
        <p>
          {lastUpdatedCategory && (
            <span>
              Last updated at {new Date(lastUpdatedCategory).toLocaleTimeString()}.{" "}
            </span>
          )}
          {!isFetchingCategory && (
            <button onClick={this.handleRefreshClick}>Refresh</button>
          )}
        </p>
        {isFetchingCategory && categories.length === 0 && <h2>Loading...</h2>}
        {!isFetchingCategory && categories.length === 0 && <h2>Empty.</h2>}
        {categories.length > 0 && (
          <div style={{ opacity: isFetchingCategory ? 0.5 : 1 }}>
            <Categories categories={categories} />
          </div>
        )}
        {this.state.showCategoryForm ? 
        <form onSubmit={this.handleSubmitCategory}>
          <input name="category_name" type="text" value={this.state.category_name} onChange={this.handleCategory}/>
          <input name="category_price" type="number" value={this.state.category_price} onChange={this.handleCategory}/>
          <input type='submit' value='Save Category'/>
          <button type="button" onClick={() => this.handleAddCategoryClick(false)}>Cancel</button>
        </form> : <button type="button" onClick={() => this.handleAddCategoryClick(true)}>Add Category</button>}
      </div>
    );
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
  const { selectedCity, categoriesByCity } = state
  const { isFetchingCategory, lastUpdatedCategory, categories } = categoriesByCity[
    selectedCity.city_id
  ] || {
    isFetchingCategory: true,
    categories: []
  }

  const { cities } = state
  const { isFetchingCities, lastUpdatedCities, cityList: allCities } = cities || {
    isFetchingCities: true,
    cityList: []
  };

  return {
    isFetchingCities,
    lastUpdatedCities,
    isFetchingCategory,
    lastUpdatedCategory,
    allCities,
    categories,
    selectedCity
  };
}

export default connect(mapStateToProps)(App)