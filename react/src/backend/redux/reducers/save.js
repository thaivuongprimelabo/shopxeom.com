import * as types from '../types/index';

var initialState = {
    status: false,
    data: [],
    error: []
};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SAVE:
            return {
                ...state,
                status: action.data.status,
                data: action.data.data,
                error: action.data.error
            };
        default:
          return state
    }
};

export default myReducer;