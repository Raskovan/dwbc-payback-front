import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getUser } from '../actions'

export default function(ComposedComponent) {
	class Authentication extends Component {
		componentWillMount() {
			const token = localStorage.getItem('token')
			if (!this.props.authenticated && !token) {
				this.props.history.push('/login')
			}
		}

		componentWillUpdate(nextProps) {
			const { dispatch } = this.props
			const token = localStorage.getItem('token')
			if (!nextProps.authenticated && !token) {
				this.props.history.push('/login')
			}
			if (token && !nextProps.authenticated) {
				dispatch(getUser(token))
			}
		}

		render() {
			const token = localStorage.getItem('token')
			return <div>{token && <ComposedComponent {...this.props} />}</div>
		}

		PropTypes = {
			router: PropTypes.object
		}
	}

	function mapStateToProps(state) {
		return {
			authenticated: state.auth.loggedIn,
			loading: state.auth.loading
		}
	}
	return connect(mapStateToProps)(Authentication)
}
