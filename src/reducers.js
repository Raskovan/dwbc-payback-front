import { combineReducers } from "redux";
import {
	SELECT_CITY,
	REQUEST_CITIES,
	RECEIVE_CITIES,
	INVALIDATE_CITY,
	RECEIVE_CATEGORIES,
	REQUEST_CATEGORIES,
  EDIT_DATA,
  CLEAR_DATA,
	ADD_DATA,
	ON_CHANGE_DATA
} from './actions'


function selectedCity(state = {}, action) {
  switch (action.type) {
    case SELECT_CITY:
      return Object.assign({}, state, {
        city_id: action.cityObj.city_id,
        city_name: action.cityObj.city_name
      })
    default:
      return state
  }
}

function categories(
  state = {
    isFetchingCategory: false,
    didInvalidateCategory: false,
    categories: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_CITY:
      return Object.assign({}, state, {
        didInvalidateCategory: true
      });
    case REQUEST_CATEGORIES:
      return Object.assign({}, state, {
        isFetchingCategory: true,
        didInvalidateCategory: false
      });
    case RECEIVE_CATEGORIES:
    return Object.assign({}, state, {
      isFetchingCategory: false,
      didInvalidateCategory: false,
      categories: action.categories,
      lastUpdatedCategory: action.receivedAt
    });
    default:
      return state;
  }
}

function cities(
  state = {
    isFetchingCities: false,
    didInvalidateCities: false,
    cityList: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_CITIES:
      return Object.assign({}, state, {
        isFetchingCities: true,
        didInvalidateCities: false
      });
    case RECEIVE_CITIES:
      return Object.assign({}, state, {
        isFetchingCities: false,
        didInvalidateCities: false,
        cityList: action.cityList,
        lastUpdatedCities: action.receivedAt,
      });
    default:
      return state;
  }
}

function categoriesByCity(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_CITY:
    case RECEIVE_CATEGORIES:
    case REQUEST_CATEGORIES:
      return Object.assign({}, state, {
        [action.cityId]: categories(state[action.cityId], action)
      });
    default:
      return state;
  }
}

function dataToEdit(state = {}, action) {
  switch (action.type) {
    case EDIT_DATA:
    case ADD_DATA:
    case CLEAR_DATA:
      state = {}
      return Object.assign({}, state, action.data)
    case ON_CHANGE_DATA:
      return Object.assign({}, state, {
        [action.event.target.name]: action.event.target.value
      })
		default:
			return state
	}
}

const rootReducer = combineReducers({
	selectedCity,
	cities,
	categoriesByCity,
	dataToEdit
})

export default rootReducer;
