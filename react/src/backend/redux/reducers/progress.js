import * as types from '../types/index';

var initialState = {
  status: false,
  type: ''
};

var myReducer = (state = initialState, action) => {
    var newState = initialState;
    newState.type = action.type;

    switch (action.type) {
        case types.START_PROGRESS:
          newState.status = true;
          return {...state, ...newState};
        case types.END_PROGRESS:
          newState.status = false;
          return {...state, ...newState};
        default:
          return state
    }
};

export default myReducer;