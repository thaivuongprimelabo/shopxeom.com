import * as types from '../types/index';

var initialState = {};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.VALIDATE:
            state = action.error;
            return {
                ...state
            };
        default:
          return state
    }
};

export default myReducer;