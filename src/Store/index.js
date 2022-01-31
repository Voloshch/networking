import promiseMiddleware from 'redux-promise-middleware';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { ComputeStore } from '../AppReducer';
import { logger } from 'redux-logger';
import { reducer as reduxFormReducer } from 'redux-form';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewareList = [promiseMiddleware, thunk, logger];

const enhancer = composeEnhancers(
    applyMiddleware(...middlewareList)
);

const reducer = combineReducers({
    ComputeStore,
    form: reduxFormReducer
});

export const store = createStore(reducer, enhancer);
