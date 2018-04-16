import {
  EDITOR_OPEN,
  EDITOR_CLOSE,
} from '../actions/edit';


const initialState = {
  editor_open: false
};

export default function edit(state = initialState, action) {
  switch (action.type) {
    case EDITOR_OPEN:
      return Object.assign({}, state, {editor_open: true});
    case EDITOR_CLOSE:
      return Object.assign({}, state, {editor_open: false});
    default:
      return state;
  }
}
