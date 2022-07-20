import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { rankReducer as rank } from '~/reducers/rank.js';

const reducer = combineReducers({rank});

export { rankActions } from '~/reducers/rank.js';
export default configureStore({ reducer });