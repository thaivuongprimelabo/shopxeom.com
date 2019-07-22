import * as types from '../types/index';

var initialState = {
    data: [],
    searchCondition: {},
    pageNo: 1,
    type: types.GET_DATA
};

var myReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_DATA:
            state = action.data.data;
            return {
                ...state,
                list: action.data.data.data,
                searchCondition: action.searchCondition,
                pageNo: action.pageNo,
                type: action.type
            };
        case types.REMOVE:
            return {...state, type: action.type};
        default:
          return state
    }
};

export default myReducer;