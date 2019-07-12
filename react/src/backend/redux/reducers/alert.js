import * as types from '../types/index';

var initialState = {
    message: '',
    cssClass: ''
};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ALERT:
            state = '';
            return {
                ...state,
                message: action.message,
                cssClass: action.cssClass
            };
        default:
          return state
    }
};

export default myReducer;