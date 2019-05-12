import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from "react-redux";
import configureStore from "../configureStore";
import App from "./App";
import LogIn from "../components/LogIn";
import SignUp from "../components/SignUp";
import Auth from "../components/Auth";
import Users from "../components/Users";

const store = configureStore();

export default class Root extends Component {
	
	render() {
    return (
			<Provider store={store}>
				<Router>
					<Switch>
						<Route path='/login' exact component={LogIn} />
						<Route path='/signup' exact component={SignUp} />
						<Route path='/users' exact component={Auth(Users)} />
						<Route path='/:name' exact component={Auth(App)} />
						<Route path='/' exact component={Auth(App)} />
					</Switch>
				</Router>
			</Provider>
		)
  }
}
