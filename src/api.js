import fetch from 'cross-fetch'

const HeaderMenu = {
  "Content-Type": "application/json",
  "x-api-key": process.env.REACT_APP_API_KEY,
  "ngrok-skip-browser-warning": "69420"
};

export function fetchCityListFromApi() {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/cities/list`, {
    headers: HeaderMenu
  }).then(response => response.json())
}

// CATEGORY
export function fetchCategoryFromApi(cityId) {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/cities/${cityId}`, {
    headers: HeaderMenu
  }).then(response => response.json())
}

export function updateCategoriesToApi(cityId, data) {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/cities/${cityId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: HeaderMenu
  }).then(response => response.json())
}

export function saveCategoryToApi(cityId, data) {
  return fetch(
    process.env.REACT_APP_API_HOST + `/api/v1/cities/${cityId}/categories`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: HeaderMenu
    }
  ).then(response => response.json())
}

export function deleteCategoryFromApi(cityId, catId) {
  return fetch(
    process.env.REACT_APP_API_HOST +
      `/api/v1/cities/${cityId}/categories/${catId}`,
    {
      method: 'DELETE',
      headers: HeaderMenu
    }
  ).then(response => response.json())
}

export function updateCategoryToApi(cityId, category, data) {
  return fetch(
    process.env.REACT_APP_API_HOST +
      `/api/v1/cities/${cityId}/categories/${category._id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: HeaderMenu
    }
  ).then(response => response.json())
}

// ITEM
export function addItemToCategoryInApi(cityId, catId, itemObj) {
  return fetch(
    process.env.REACT_APP_API_HOST +
      `/api/v1/cities/${cityId}/categories/${catId}/items`,
    {
      method: 'POST',
      body: JSON.stringify(itemObj),
      headers: HeaderMenu
    }
  ).then(response => response.json())
}

export function deleteItemInCategoryInApi(cityId, catId, itemId) {
  return fetch(
    process.env.REACT_APP_API_HOST +
      `/api/v1/cities/${cityId}/categories/${catId}/items/${itemId}`,
    {
      method: 'DELETE',
      headers: HeaderMenu
    }
  ).then(response => response.json())
}

export function updateItemInCategoryInApi(cityId, catId, itemObj, data) {
  return fetch(
    process.env.REACT_APP_API_HOST +
      `/api/v1/cities/${cityId}/categories/${catId}/items/${itemObj._id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: HeaderMenu
    }
  ).then(response => response.json())
}

export function sendLoginDetails(data) {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: HeaderMenu
  }).then(response => response.json())
}

export function getUserFromApi(token) {
  const data = { token: token }
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/getuser`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: HeaderMenu
  }).then(response => response.json())
}

export function sendSignUpDetails(data) {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: HeaderMenu
  }).then(response => response.json())
}

export function getAllUsers() {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/users`, {
    headers: HeaderMenu
  }).then(response => response.json())
}

export function updateUserToApi(userId, data) {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: HeaderMenu
  }).then(response => response.json())
}

export function deleteUserFromApi(userId) {
  return fetch(process.env.REACT_APP_API_HOST + `/api/v1/users/${userId}`, {
    method: 'DELETE',
    headers: HeaderMenu
  }).then(response => response.json())
}
