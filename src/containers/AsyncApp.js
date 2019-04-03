import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  selectSubreddit,
  fetchPostsIfNeeded,
  invalidateSubreddit,
  fetchCitiesIfNeeded
} from "../actions";
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class AsyncApp extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
    dispatch(fetchCitiesIfNeeded())
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }
  }

  handleChange(nextSubreddit) {
    this.props.dispatch(selectSubreddit(nextSubreddit))
    this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedSubreddit } = this.props
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  render() {
    const { selectedCity, posts, isFetching, isFetchingCities, lastUpdated, allCities } = this.props
    return (
      <div>
        {isFetchingCities && selectedCity && allCities.length === 0 && <h2>Loading...</h2>}
        {!isFetchingCities && allCities.length === 0 && <h2>Empty.</h2>}
        {selectedCity.city_id && allCities.length > 0 && (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Picker
              value={selectedCity}
              onChange={this.handleChange}
              options={allCities}
            />
          </div>
        )}
        <p>
          {lastUpdated && (
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{" "}
            </span>
          )}
          {!isFetching && (
            <button onClick={this.handleRefreshClick}>Refresh</button>
          )}
        </p>
        {isFetching && posts.length === 0 && <h2>Loading...</h2>}
        {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
        {posts.length > 0 && (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

AsyncApp.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  selectedCity: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  allCities: PropTypes.array.isRequired,
  isFetchingCities: PropTypes.bool.isRequired,
  lastUpdatedCities: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedSubreddit, postsBySubreddit } = state
  const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    isFetching: true,
    items: []
  }

  const { selectedCity, cities } = state
  const { isFetchingCities, lastUpdatedCities, cityList: allCities } = cities || {
    isFetchingCities: true,
    cityList: []
  };

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated,
    isFetchingCities,
    lastUpdatedCities,
    allCities,
    selectedCity
  };
}

export default connect(mapStateToProps)(AsyncApp)