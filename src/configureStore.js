import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
// import { createLogger } from "redux-logger";
import reducers from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension'

// const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
	const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 125 });
  return createStore(
		reducers,
		preloadedState,
		composeEnhancers(applyMiddleware(thunkMiddleware))
	)}