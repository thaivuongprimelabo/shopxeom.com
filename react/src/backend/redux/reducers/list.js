import * as types from '../types/index';

var initialState = {};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_DATA:
            state = action.data.data;
            return state;
        default:
          return state
    }
};

export default myReducer;