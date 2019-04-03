import fetch from "cross-fetch";

export const REQUEST_POSTS = "REQUEST_POSTS";
export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const SELECT_SUBREDDIT = "SELECT_SUBREDDIT";
export const INVALIDATE_SUBREDDIT = "INVALIDATE_SUBREDDIT";
export const REQUEST_CITIES = "REQUEST_CITIES";
export const RECEIVE_CITIES = "RECEIVE_CITIES";
export const SELECT_CITY = "SELECT_CITY";

export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  };
}

export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  };
}

function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  };
}

function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

function fetchPosts(subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit));
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)));
  };
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit];
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit));
    }
  };
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
