import * as types from '../types/index';

var initialState = {
    status: false,
    data: [],
    error: []
};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.BEFORE_LOGIN:
            return state;
        case types.CHECK_LOGIN:
        case types.LOGIN_SUCCEED:
            return {
                ...state,
                status: action.data.status,
                data: action.data.data
            };

        case types.LOGIN_FAILED:
            return {
                ...state,
                status: action.data.status,
                error: action.data.error
            };
        case types.LOGOUT:
            state.status = action.data.status;
            return {
                ...state,
                status: action.data.status
            };
            
        default:
            return state
    }
};

export default myReducer;