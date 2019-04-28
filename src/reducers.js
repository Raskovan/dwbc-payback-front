import { combineReducers } from "redux";
import {
	SELECT_CITY,
	REQUEST_CITIES,
	RECEIVE_CITIES,
	INVALIDATE_CITY,
	RECEIVE_CATEGORIES,
	REQUEST_CATEGORIES,
	EDIT_CATEGORY,
	ON_CHANGE_CATEGORY
} from './actions'


function selectedCity(state = {
  city_id: '5c99a5ec3ad97b001795d699',
  city_name: "New York"
}, action) {
  switch (action.type) {
    case SELECT_CITY:
      return Object.assign({}, state, {
        city_id: action.cityObj.city_id,
        city_name: action.cityObj.city_name
      });
    default:
      return state;
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
        selectedCity: action.cityList[0].city_name
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
    case EDIT_CATEGORY:
      state = {}
      return Object.assign({}, state, action.catObj)
    case ON_CHANGE_CATEGORY:
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
