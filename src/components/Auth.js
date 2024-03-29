import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getUser } from '../actions'
import { Loader } from 'semantic-ui-react';

export default function(ComposedComponent) {
	class Authentication extends Component {
    
    componentWillMount() {
			const token = localStorage.getItem('token')
      const { dispatch } = this.props
			if (!this.props.authenticated && !token) {
				this.props.history.push('/login')
			}
      if (token && !this.props.authenticated) {
				dispatch(getUser(token))
				// dispatch(fetchCitiesIfNeeded())
			}
		}

		componentWillUpdate(nextProps) {
			const token = localStorage.getItem('token')
			if (!nextProps.authenticated && !token) {
				this.props.history.push('/login')
			}
    }

		render() {
			return (
				<div style={{height: '70%'}}>
					{this.props.authenticated ? (
						<ComposedComponent {...this.props} />
					): <Loader active/>}
				</div>
			)
		}

		PropTypes = {
			router: PropTypes.object
		}
	}

	function mapStateToProps(state) {
		return {
      authenticated: state.user.loggedIn,
      isApproved: state.user.is_approved,
      loading: state.user.loading,
      city_id: state.user.city_allowed
		}
	}
	return connect(mapStateToProps)(Authentication)
}
