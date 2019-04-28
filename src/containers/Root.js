import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from "react-redux";
import configureStore from "../configureStore";
import App from "./App";

const store = configureStore();

export default class Root extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    );
  }
}
