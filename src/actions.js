import fetch from "cross-fetch";

export const REQUEST_CITIES = "REQUEST_CITIES";
export const RECEIVE_CITIES = "RECEIVE_CITIES";
export const SELECT_CITY = "SELECT_CITY";
export const INVALIDATE_CITY = "INVALIDATE_CITY";
export const REQUEST_CATEGORIES = "REQUEST_CATEGORIES";
export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES";
export const SAVE_CATEGORY = "SAVE_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const EDIT_CATEGORY = "EDIT_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";


export function invalidateCity(cityId) {
  return {
    type: INVALIDATE_CITY,
    cityId
  };
}

function receiveCategories(cityId, json) {
  return {
    type: RECEIVE_CATEGORIES,
    cityId,
    categories: json,
    receivedAt: Date.now()
  };
}

function requestCategories(cityId) {
  return {
    type: REQUEST_CATEGORIES,
    cityId
  };
}

function fetchCategories(cityId) {
  return dispatch => {
    dispatch(requestCategories(cityId));
    return fetch(`https://dwbc-payback-api.herokuapp.com/api/v1/cities/${cityId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": 1234
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveCategories(cityId, json)))
  };
}

function shouldFetchCategories(state, cityId) {
  const categories = state.categoriesByCity[cityId];
  if (!categories) {
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
    type: SAVE_CATEGORY,
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
    return fetch(`https://dwbc-payback-api.herokuapp.com/api/v1/cities/${cityId}/categories`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": 1234
        }
      })
      .then(response => response.json())
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

export function selectCity(cityObj) {
  return {
    type: SELECT_CITY,
    cityObj
  };
}

function requestCities() {
  return {
    type: REQUEST_CITIES
  };
}

function receiveCities(allCities) {
  return {
    type: RECEIVE_CITIES,
    cityList: allCities,
    receivedAt: Date.now()
  };
}

function fetchCities() {
  return dispatch => {
    dispatch(requestCities());
    return fetch(`https://dwbc-payback-api.herokuapp.com/api/v1/cities/list`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": 1234
      }
    })
      .then(response => response.json())
      .then(allCities => dispatch(receiveCities(allCities)))
      .then(allCities => dispatch(selectCity(allCities.cityList[0])));
  };
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

export function fetchCitiesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCities(getState())) {
      return dispatch(fetchCities());
    }
  };
}

function deletingCategory() {
  return {
    type: DELETE_CATEGORY
  };
}

export function deleteCategory(cityId, catId) {
  return dispatch => {
    dispatch(deletingCategory());
    return fetch(`https://dwbc-payback-api.herokuapp.com/api/v1/cities/${cityId}/categories/${catId}`,
    {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": 1234
      }
    })
    .then(response => response.json())
    .then(json => dispatch(receiveCategories(cityId, json.categories)))
  }
}

function updatingCategory(cityId, catName) {
  return {
    type: UPDATE_CATEGORY,
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
    return fetch(`https://dwbc-payback-api.herokuapp.com/api/v1/cities/${cityId}/categories/${category._id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": 1234
        }
      })
      .then(response => response.json())
      .then(json => dispatch(receiveCategories(cityId, json.categories)))
  }
}