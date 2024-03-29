import { combineReducers } from 'redux'

function selectedCity(state = {}, action) {
  switch (action.type) {
    case 'SELECT_CITY':
      return Object.assign({}, state, {
        city_id:
          action.cityObj && action.cityObj.city_id
            ? action.cityObj.city_id
            : '',
        city_name:
          action.cityObj && action.cityObj.city_name
            ? action.cityObj.city_name
            : ''
      })
    case 'LOG_OUT':
      return Object.assign({}, state, {
        city_id: '',
        city_name: ''
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
    case 'INVALIDATE_CITY':
      return Object.assign({}, state, {
        didInvalidateCategory: true
      })
    case 'REQUEST_CATEGORIES':
      return Object.assign({}, state, {
        isFetchingCategory: true,
        didInvalidateCategory: false
      })
    case 'RECEIVE_CATEGORIES':
      return Object.assign({}, state, {
        isFetchingCategory: false,
        didInvalidateCategory: false,
        categories: action.categories,
        lastUpdatedCategory: action.receivedAt
      })
    default:
      return state
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
    case 'REQUEST_CITIES':
      return Object.assign({}, state, {
        isFetchingCities: true,
        didInvalidateCities: false
      })
    case 'RECEIVE_CITIES':
      return Object.assign({}, state, {
        isFetchingCities: false,
        didInvalidateCities: false,
        cityList: action.cityList,
        lastUpdatedCities: action.receivedAt
      })
    default:
      return state
  }
}

function categoriesByCity(state = {}, action) {
  switch (action.type) {
    case 'INVALIDATE_CITY':
    case 'RECEIVE_CATEGORIES':
    case 'REQUEST_CATEGORIES':
      return Object.assign({}, state, {
        [action.cityId]: categories(state[action.cityId], action)
      })
    case 'ITEM_REORDER':
      var elementPos = state[action.selectedCityId].categories
        .map(function(cat) {
          return cat._id
        })
        .indexOf(action.reorderedCategory[0]._id)

      const newCategory = {
        ...action.reorderedCategory[0],
        items: action.reordedItemsArr
      }

      const newState = {
        ...state[action.selectedCityId],
        categories: [
          ...state[action.selectedCityId].categories.slice(0, elementPos),
          newCategory,
          ...state[action.selectedCityId].categories.slice(elementPos + 1)
        ]
      }

      return Object.assign({}, state, {
        [action.selectedCityId]: newState
      })

    case 'CATEGORY_REORDER':
      const { categoriesToReorderArr } = action
      const newStateOne = {
        ...state[action.selectedCityId],
        categories: categoriesToReorderArr
      }
      return Object.assign({}, state, {
        [action.selectedCityId]: newStateOne
      })
    default:
      return state
  }
}

function dataToEdit(state = {}, action) {
  switch (action.type) {
    case 'EDIT_DATA':
    case 'ADD_DATA':
    case 'CLEAR_DATA':
      if (!action.data || (!action.data.city && action.data.city !== '')) {
        state = {}
      }
      return Object.assign({}, state, action.data)
    case 'ON_CHANGE_DATA':
      return Object.assign({}, state, {
        [action.name]: action.value
      })
    case 'LOG_IN':
      return Object.assign({})
    case 'SIGN_UP':
      return Object.assign({}, state)
    default:
      return state
  }
}

function user(
  state = {
    loading: false,
    loggedIn: false,
    is_approved: false
  },
  action
) {
  switch (action.type) {
    case 'LOGED_IN':
      localStorage.setItem('token', action.userObj.token)
      return {
        ...state,
        loading: false,
        loggedIn: true,
        username: action.userObj.user.username,
        token: action.userObj.token,
        city_id: action.userObj.user.city_id,
        city_name: action.userObj.user.city_name,
        is_approved: action.userObj.user.is_approved,
        is_admin: action.userObj.user.is_admin
      }

    case 'LOG_OUT':
      localStorage.removeItem('token')
      return {
        ...state,
        loading: false,
        loggedIn: false,
        username: null,
        token: undefined
      }

    case 'SIGNUP_USER':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: {
          loading: false,
          loggedIn: true,
          username: action.payload.user,
          token: action.payload.token
        }
      }

    case 'GETTING_USER':
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}

function allUsers(state = {}, action) {
  switch (action.type) {
    case 'RECIEVE_USERS':
      return {
        ...state,
        users: action.users
      }
    default:
      return state
  }
}

function error(state = {}, action) {
  switch (action.type) {
    case 'API_ERROR':
      return {
        ...state,
        message: action.message
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        message: ''
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectedCity,
  cities,
  categoriesByCity,
  dataToEdit,
  user,
  allUsers,
  error
})

export default rootReducer
