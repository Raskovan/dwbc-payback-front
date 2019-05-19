import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'
import LogIn from '../components/LogIn'
import SignUp from '../components/SignUp'
import Auth from '../components/Auth'
import Users from '../components/Users'
import HeaderMenu from '../components/HeaderMenu'
import { Menu } from 'semantic-ui-react'

const store = configureStore()

export default class Root extends Component {
	render() {
		function createPage(Component) {
			return function(props) {
				return (
					<div style={{ height: '100%' }}>
						<HeaderMenu />
						<Component {...props} />
						<Menu
							borderless
							fixed='bottom'
							widths={3}
							style={{
								borderTopColor: 'white',
								borderBottomColor: 'white'
							}}>
							<Menu.Item style={{ color: 'red' }}>ཀ</Menu.Item>
						</Menu>
					</div>
				)
			}
		}

		return (
			<Provider store={store}>
				<Router>
					<Switch>
						<Route path='/login' exact component={LogIn} />
						<Route path='/signup' exact render={createPage(SignUp)} />
						<Route path='/users' exact render={createPage(Auth(Users))} />
						<Route path='/:name' exact component={createPage(Auth(App))} />
						<Route path='/' exact component={createPage(Auth(App))} />
					</Switch>
				</Router>
			</Provider>
		)
	}
}
