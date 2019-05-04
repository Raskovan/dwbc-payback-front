import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from "react-redux";
import configureStore from "../configureStore";
import App from "./App";

const store = configureStore();

export default class Root extends Component {
  render() {
    return (
				<Provider store={store}>
					<Router>
						<Switch>
							<Route path='/:name' component={App} />
							<Route exact path='/' component={App} />
						</Switch>
					</Router>
				</Provider>
		)
  }
}
