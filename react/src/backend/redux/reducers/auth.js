import * as types from '../types/index';

var initialState = {
    status: false,
    data: [],
    error: [],
    type: ''
};

var myReducer = (state = initialState, action) => {
    var newState = initialState;
    newState.type = action.type;

    switch (action.type) {
        case types.CHECK_LOGIN:
            newState.status = action.data.status;
            newState.data = action.data.data;
            return {
                ...state,
                ...newState
            };

        case types.HANDLE_LOGIN:
            newState.status = action.data.status;
            newState.data = action.data.data;
            newState.error = action.data.error;
            
            return {
                ...state,
                ...newState
            };

        case types.LOGOUT:
            newState.status = action.data.status;
            return {
                ...state,
                ...newState
            };
            
        default:
            return state
    }
};

export default myReducer;