import {
	fetchCategoryFromApi,
	saveCategoryToApi,
	fetchCityListFromApi,
	deleteCategoryFromApi,
	updateCategoryToApi,
	addItemToCategoryInApi,
	deleteItemInCategoryInApi,
	updateItemInCategoryInApi
} from './api'

export function invalidateCity(cityId) {
  return {
    type: 'INVALIDATE_CITY',
    cityId
  };
}

function receiveCategories(cityId, json) {
  return {
    type: 'RECEIVE_CATEGORIES',
    cityId,
    categories: json,
    receivedAt: Date.now()
  };
}

function requestCategories(cityId) {
  return {
    type: 'REQUEST_CATEGORIES',
    cityId
  };
}

function fetchCategories(cityId) {
  return dispatch => {
    dispatch(requestCategories(cityId));
    fetchCategoryFromApi(cityId)
			.then(json => dispatch(receiveCategories(cityId, json)))
  };
}

function shouldFetchCategories(state, cityId) {
  const categories = state.categoriesByCity[cityId];
  const city = state.selectedCity.city_name
  if (!city){
    return false
  } else if (!categories) {
    return true;
  } else if (categories.isFetchingCategory) {
    return false;
  } else {
    return categories.didInvalidateCategory;
  }
}

export function fetchCategoriesForCityIfNeeded(cityId) {
  return (dispatch, getState) => {
    if (shouldFetchCategories(getState(), cityId)) {
      return dispatch(fetchCategories(cityId));
    }
  };
}

function savingCategory(cityId, catName) {
  return {
    type: 'SAVE_CATEGORY',
    cityId,
    catName
  };
}

function saveCategory(cityId, catName, catPrice) {
  let data = {
    category_name: catName,
    category_price: catPrice
  }
  return dispatch => {
    dispatch(savingCategory(cityId, catName));
    saveCategoryToApi(cityId, data)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
  }
}

function shouldSaveCategory(state, cityId, catName) {
  const categories = state.categoriesByCity[cityId].categories;
  let match = categories.filter(category => category.category_name === catName)
  if (match.length === 0) {
    return true
  } else {
    return false
  }
}

export function addCategoryForCity(cityId, catName, catPrice) {
  return (dispatch, getState) => {
    if (shouldSaveCategory(getState(), cityId, catName)) {
      return dispatch(saveCategory(cityId, catName, catPrice))
    }
  }
}

export function editData(data) {
    return {
			type: 'EDIT_DATA',
			data
		}
}

export function clearData(data) {
    return {
			type: 'CLEAR_DATA',
			data
		}
}

export function addData(data) {
    return {
			type: 'ADD_DATA',
			data
		}
}

export function editDataOnChange(event) {
    return {
			type: 'ON_CHANGE_DATA',
			event
		}
}

export function selectCity(cityObj) {
  return {
    type: 'SELECT_CITY',
    cityObj
  };
}

function requestCities() {
  return {
    type: 'REQUEST_CITIES'
  };
}

function receiveCities(allCities) {
  return {
    type: 'RECEIVE_CITIES',
    cityList: allCities,
    receivedAt: Date.now()
  };
}

function fetchCities(matchName) {
  return dispatch => {
    dispatch(requestCities());
    fetchCityListFromApi()
			.then(allCities => dispatch(receiveCities(allCities)))
			.then(allCities => dispatch(selectingCity(allCities, matchName)))
  };
}

function selectingCity(allCities, matchName) {
  return dispatch => {
    if (matchName){
      for (let i=0; i < allCities.cityList.length; i++){
        if (allCities.cityList[i].city_name === matchName)
          dispatch(selectCity(allCities.cityList[i]))
      }
    }
  }
}

function shouldFetchCities(state) {
  if (state.cities.cityList.length === 0) {
    return true;
  } else if (state.cities.isFetchingCities) {
    return false;
  } else {
    return state.cities.didInvalidateCities;
  }
}

export function fetchCitiesIfNeeded(matchName) {
  return (dispatch, getState) => {
    if (shouldFetchCities(getState())) {
      return dispatch(fetchCities(matchName))
    }
  };
}

function deletingCategory() {
  return {
    type: 'DELETE_CATEGORY'
  };
}

export function deleteCategory(cityId, catId) {
  return dispatch => {
    dispatch(deletingCategory());
    deleteCategoryFromApi(cityId, catId)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
  }
}

function updatingCategory(cityId, catName) {
  return {
    type: 'UPDATE_CATEGORY',
    cityId,
    catName
  };
}

export function updateCategory(cityId, category) {
  let data = {
    category_name: category.category_name,
    category_price: category.category_price
  }
  return dispatch => {
    dispatch(updatingCategory(cityId, category.category_name));
    updateCategoryToApi(cityId, category, data)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
  }
}

function addingItem(cityId, catName) {
  return {
    type: 'ADD_CATEGORY',
    cityId,
    catName
  };
}

export function addItem(cityId, catId, itemObj) {
  return dispatch => {
    dispatch(addingItem(cityId, catId));
    addItemToCategoryInApi(cityId, catId, itemObj)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
  }
}

function deletingItem() {
	return {
		type: 'DELETE_ITEM'
	}
}

export function deleteItem(cityId, catId, itemId) {
  return dispatch => {
    dispatch(deletingItem());
    deleteItemInCategoryInApi(cityId, catId, itemId)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
  }
}

function updatingItem(cityId, catId, itemObj) {
	return {
		type: 'UPDATE_ITEM',
		cityId,
    catId,
    itemObj
	}
}

export function updateItem(cityId, catId, itemObj) {
  let data = {
    item_name: itemObj.item_name,
    item_price: itemObj.item_price
  }
  return dispatch => {
    dispatch(updatingItem(cityId, catId, itemObj));
    updateItemInCategoryInApi(cityId, catId, itemObj, data)
			.then(json => dispatch(fetchCategories(cityId)))
  }
}