import * as types from '../types/index';

var initialState = false;

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.START_PROGRESS:
          state = true;
          return state;
        case types.END_PROGRESS:
          state = false;
          return state;
        default:
          return state
    }
};

export default myReducer;