import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension'

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
	const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
  return createStore(
		rootReducer,
		preloadedState,
		composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware))
	)}