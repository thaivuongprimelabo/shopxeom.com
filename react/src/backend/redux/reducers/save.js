import * as types from '../types/index';

var initialState = {
    status: false,
    data: [],
    error: [],
    message: ''
};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SAVE:
            return {
                ...state,
                status: action.data.status,
                data: action.data.data,
                error: action.data.error,
                message: action.data.message
            };
        default:
          return state
    }
};

export default myReducer;