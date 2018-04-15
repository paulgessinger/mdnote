// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
//import counter from './counter';
import entries from './entries';

const rootReducer = combineReducers({
  //counter,
  router,
  entries,
});

export default rootReducer;
