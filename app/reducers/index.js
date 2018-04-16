// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
//import counter from './counter';
import entries from './entries';
import edit from './edit';

const rootReducer = combineReducers({
  //counter,
  router,
  entries,
  edit,
});

export default rootReducer;
