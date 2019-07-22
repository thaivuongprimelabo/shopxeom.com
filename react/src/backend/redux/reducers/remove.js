import * as types from '../types/index';

var initialState = {
    ids: []
};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.REMOVE_IDS:
            return {
                ...state,
                ids: action.ids
            };
        default:
          return state
    }
};

export default myReducer;