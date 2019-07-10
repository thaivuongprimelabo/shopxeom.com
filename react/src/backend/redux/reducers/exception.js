import * as types from '../types/index';

var initialState = {
    code: 0,
    error: ''
};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.INIT_EXCEPTION:
            return {
                ...state,
                code: 0,
                error: ''
            };
        case types.EXCEPTION:
            return {
                ...state,
                code: action.data.status,
                error: action.data.statusText
            };
        default:
          return state
    }
};

export default myReducer;