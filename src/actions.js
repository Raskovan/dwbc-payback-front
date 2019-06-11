import * as api from './api'

export function invalidateCity(cityId) {
	return {
		type: 'INVALIDATE_CITY',
		cityId
	}
}

function receiveCategories(cityId, json) {
	return {
		type: 'RECEIVE_CATEGORIES',
		cityId,
		categories: json,
		receivedAt: Date.now()
	}
}

function requestCategories(cityId) {
	return {
		type: 'REQUEST_CATEGORIES',
		cityId
	}
}

function fetchCategories(cityId) {
	return dispatch => {
		dispatch(requestCategories(cityId))
		api
			.fetchCategoryFromApi(cityId)
			.then(json => dispatch(receiveCategories(cityId, json)))
	}
}

function shouldFetchCategories(state, cityId) {
	const categories = state.categoriesByCity[cityId]
	const city = state.selectedCity.city_name
	if (!city) {
		return false
	} else if (!categories) {
		return true
	} else if (categories.isFetchingCategory) {
		return false
	} else {
		return categories.didInvalidateCategory
	}
}

export function fetchCategoriesForCityIfNeeded(cityId) {
	return (dispatch, getState) => {
		if (shouldFetchCategories(getState(), cityId)) {
			return dispatch(fetchCategories(cityId))
		}
	}
}

const savingCategory = (cityId, catName) => ({
	type: 'SAVE_CATEGORY',
	cityId,
	catName
})

function saveCategory(cityId, catName, catPrice) {
	let data = {
		category_name: catName,
		category_price: catPrice
	}
	return dispatch => {
		dispatch(savingCategory(cityId, catName))
		api
			.saveCategoryToApi(cityId, data)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
	}
}

function shouldSaveCategory(state, cityId, catName) {
	const categories = state.categoriesByCity[cityId].categories
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
	// event.persist()
	return {
		type: 'ON_CHANGE_DATA',
		name: event.target.name,
		value: event.target.value
	}
}

export function selectCity(cityObj) {
	return {
		type: 'SELECT_CITY',
		cityObj
	}
}

function requestCities() {
	return {
		type: 'REQUEST_CITIES'
	}
}

function receiveCities(allCities) {
	return {
		type: 'RECEIVE_CITIES',
		cityList: allCities,
		receivedAt: Date.now()
	}
}

function fetchCities(matchName) {
	return dispatch => {
		dispatch(requestCities())
		api
			.fetchCityListFromApi()
			.then(allCities => dispatch(receiveCities(allCities)))
			.then(allCities => dispatch(selectingCity(allCities, matchName)))
	}
}

function selectingCity(allCities, matchName) {
	return dispatch => {
		if (matchName) {
			for (let i = 0; i < allCities.cityList.length; i++) {
				if (allCities.cityList[i].city_name === matchName)
					dispatch(selectCity(allCities.cityList[i]))
			}
		}
	}
}

function shouldFetchCities(state) {
	if (!state.cities.cityList.length && !state.cities.isFetchingCities) {
		return true
	} else if (state.cities.isFetchingCities) {
		return false
	} else {
		return state.cities.didInvalidateCities
	}
}

export function fetchCitiesIfNeeded(matchName) {
	return (dispatch, getState) => {
		if (shouldFetchCities(getState())) {
			return dispatch(fetchCities(matchName))
		}
	}
}

function deletingCategory() {
	return {
		type: 'DELETE_CATEGORY'
	}
}

export function deleteCategory(cityId, catId) {
	return dispatch => {
		dispatch(deletingCategory())
		api
			.deleteCategoryFromApi(cityId, catId)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
	}
}

function updatingCategory(cityId, catName) {
	return {
		type: 'UPDATE_CATEGORY',
		cityId,
		catName
	}
}

export function updateCategory(cityId, category) {
	let data = {
		category_name: category.category_name,
		category_price: category.category_price
	}
	return dispatch => {
		dispatch(updatingCategory(cityId, category.category_name))
		api
			.updateCategoryToApi(cityId, category, data)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
	}
}

export function updateItemsInCategory(cityId, category, newItems) {
	let data = {
		items: newItems
	}
	return dispatch => {
		dispatch(updatingCategory(cityId, category.category_name))
		api
			.updateCategoryToApi(cityId, category, data)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
	}
}

function addingItem(cityId, catName) {
	return {
		type: 'ADD_CATEGORY',
		cityId,
		catName
	}
}

export function addItem(cityId, catId, itemObj) {
	return dispatch => {
		dispatch(addingItem(cityId, catId))
		api
			.addItemToCategoryInApi(cityId, catId, itemObj)
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
		dispatch(deletingItem())
		api
			.deleteItemInCategoryInApi(cityId, catId, itemId)
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
		dispatch(updatingItem(cityId, catId, itemObj))
		api
			.updateItemInCategoryInApi(cityId, catId, itemObj, data)
			.then(json => dispatch(fetchCategories(cityId)))
	}
}

// LOGIN
export function handleLogin(loginObj, history) {
	let data
	if (loginObj.email) {
		data = {
			username: loginObj.email.toLowerCase(),
			password: loginObj.password
		}
	}
	return (dispatch, getState) => {
		dispatch(loggingIn(loginObj.email))
		api
			.sendLoginDetails(data)
			.then(data => {
				if (data.message) {
					dispatch(errorHandling(data.message))
					dispatch(clearError())
				} else if (data.user.is_approved) {
					dispatch(findCityForUser(data, history))
				} else {
					dispatch(
						errorHandling(
							"Sorry, but your account wasn't approved yet! Meditate!"
						)
					)
					dispatch(clearError())
				}
			})
			.catch(err => console.log('ERROR FROM API', err))
	}
}

function findCityForUser(userData, history) {
	const cityToSelect = {
		city_name: userData.user.city_name,
		city_id: userData.user.city_id
	}
	return dispatch => {
		dispatch(canLogin(userData, history, cityToSelect))
		dispatch(selectCity(cityToSelect))
		dispatch(fetchCategoriesForCityIfNeeded(cityToSelect.city_id))
		history.push(`/${cityToSelect.city_name}`)
	}
}

function loggingIn(username) {
	return {
		type: 'LOG_IN',
		username
	}
}

function isApproved(userObj) {
	if (userObj.user.is_approved) {
		return userObj.user.is_approved
	} else {
		return false
	}
}

function canLogin(userObj, history, city) {
	return (dispatch, getState) => {
		if (isApproved(userObj)) {
			return dispatch(logedIn(userObj, history, city))
		}
	}
}

function logedIn(userObj, history, city) {
	return {
		type: 'LOGED_IN',
		userObj,
		history,
		city
	}
}

export function getUser(token) {
	return dispatch => {
		dispatch(gettingUser())
		api
			.getUserFromApi(token)
			.then(res => {
				let userObj = {
					user: {
						username: res.username,
						city_id: res.city_id,
						city_name: res.city_name,
						is_approved: res.is_approved,
						is_admin: res.is_admin
					},
					token: token
				}
				dispatch(logedIn(userObj))
			})
			.catch(err => dispatch(logOut()))
	}
}

function gettingUser() {
	return {
		type: 'GETTING_USER'
	}
}

export function logOut() {
	return {
		type: 'LOG_OUT'
	}
}

function cityExists(state, loginObj) {
	if (loginObj.city) {
		let foundCity = state.cities.cityList.filter(
			city => city.city_name === loginObj.city
		)
		if (foundCity.length > 0) return true
		else return false
	} else return false
}

export function handleSignUp(loginObj, history) {
	if (
		loginObj.email &&
		loginObj.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
		loginObj.password &&
		(loginObj.city || loginObj.cityId)
	) {
		let data = {
			username: loginObj.email.toLowerCase(),
			password: loginObj.password,
			city: loginObj.city ? loginObj.city : loginObj.cityId
		}
		return (dispatch, getState) => {
			if (!cityExists(getState(), loginObj)) {
				dispatch(signingUp(loginObj))
				api.sendSignUpDetails(data).then(json => {
					if (json.message) {
						dispatch(errorHandling(json.message))
						dispatch(clearError())
					} else {
						dispatch(errorHandling('Request has been sent. Sit tight!'))
						dispatch(clearError())
					}
				})
				history.push('/login')
			} else {
				data = { city: '' }
				dispatch(clearData(data))
				dispatch(errorHandling('The city exists, select it from the dropdown.'))
				setTimeout(() => {
					dispatch(clearError())
				}, 1000)
			}
		}
	} else {
		return dispatch => {
			dispatch(errorHandling('Something is missing or incorrect!'))
			setTimeout(() => {
				dispatch(clearError())
			}, 1000)
		}
	}
}

function errorHandling(message) {
	return {
		type: 'API_ERROR',
		message
	}
}

export function clearError() {
	return {
		type: 'CLEAR_ERROR'
	}
}

function signingUp(user) {
	return {
		type: 'SIGN_UP',
		user
	}
}

export function fetchUsersIfNeeded(action) {
	return (dispatch, getState) => {
		if (shouldFetchUsers(getState(), action)) {
			return dispatch(fetchUsers())
		}
	}
}

function fetchUsers() {
	return dispatch => {
		dispatch(fetchingUsers())
		api.getAllUsers().then(users => {
			dispatch(recievedAllUsers(users))
		})
	}
}

function shouldFetchUsers(state, action) {
	if (state.allUsers && state.allUsers.users && !action) {
		return false
	} else {
		return true
	}
}

function fetchingUsers() {
	return {
		type: 'FETCHING_USERS'
	}
}

function recievedAllUsers(users) {
	return {
		type: 'RECIEVE_USERS',
		users
	}
}

export function userUpdate(user, action) {
	return dispatch => {
		if (action === 'update') {
			let data = {
				is_approved: !user.is_approved
			}
			dispatch(updatingUser(user.username))
			api
				.updateUserToApi(user._id, data)
				.then(json => dispatch(fetchUsersIfNeeded('update')))
		} else if (action === 'delete') {
			dispatch(deletingUser(user.username))
			api
				.deleteUserFromApi(user._id)
				.then(json => dispatch(fetchUsersIfNeeded('delete')))
		} else if (action === 'admin') {
			let data = {
				is_admin: !user.is_admin
			}
			dispatch(updatingUser(user.username))
			api
				.updateUserToApi(user._id, data)
				.then(json => dispatch(fetchUsersIfNeeded('admin')))
		}
	}
}

function updatingUser(username) {
	return {
		type: 'UPDATE_USER',
		username
	}
}

function deletingUser(username) {
	return {
		type: 'DELETE_USER',
		username
	}
}

//REORDERING ACTIONS
export function itemsReorder(
	reordedItemsArr,
	reorderedCategory,
	selectedCityId
) {
	return {
		type: 'ITEM_REORDER',
		reordedItemsArr,
		reorderedCategory,
		selectedCityId
	}
}

export function categoryReorder(categoriesToReorderArr, selectedCityId) {
	return {
		type: 'CATEGORY_REORDER',
		categoriesToReorderArr,
		selectedCityId
	}
}

export function updatingCityCategoriesOrder(cityId, categories) {
	return {
		type: 'CATEGORIES_REORDER_UPDATE',
		cityId,
		categories
	}
}

export function updateCategoriesOrder(cityId, categories) {
	let data = {
		categories: categories
	}
	return dispatch => {
		dispatch(updatingCityCategoriesOrder(cityId, categories))
		api
			.updateCategoriesToApi(cityId, data)
			.then(json => dispatch(receiveCategories(cityId, json.categories)))
	}
}
