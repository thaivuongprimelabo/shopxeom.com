import * as types from '../types/index';
import * as Api from '../../constants/api';
import axios from 'axios';

export const loadLang = () => {
    return (dispatch) => {
        dispatch(callAxios({
            method: 'GET',
            url : Api.API_LANG
        }));
    }
}

export const checkLogin = () => {
    return (dispatch) => {
        axios({
            method: 'POST',
            url : Api.API_CHECK_LOGIN,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            }
        })
        .then(res => {
            if(res.data.status) {
                dispatch(callReducer(types.CHECK_LOGIN, res.data));
            }
        })
        .catch((error) =>{
            console.log(error);
        });
    }
}

export const handleLogin = (form) => {

    return (dispatch) => {
        
        dispatch(startProgress());
        dispatch(callAxios({
            method: 'POST',
            url : Api.API_HANDLE_LOGIN,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            data: JSON.stringify(form)
        }));
    }
    
}

export const logout = () => {
    return (dispatch) => {
        axios({
            method: 'POST',
            url : Api.API_LOGOUT,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            }
        })
        .then(res => {
            if(res.data.status) {
                dispatch(callReducer(types.LOGOUT, res.data));
            }
        })
        .catch(handleException(error));
    }
}

export const callReducer = (type, data) => {

    var params = {};
    if(type !== undefined) {
        params.type = type;
    }

    if(data !== undefined) {
        params.data = data;
    }

    return params;
}

export const loginSucceed = (data) => {
    return {
        type: types.LOGIN_SUCCEED,
        data: data
    }
}

export const sendReducer = (obj) => {
    return obj;
}

/** ============================== AXIOS ================================== */
export const callAxios = (params) => {
    return (dispatch) => {
        axios(params)
        .then(res => handleSuccess(res.data, params, dispatch))
        .catch(error => handleException(error, dispatch));
    }
}

export const handleSuccess = (res, params, dispatch) => {
    if(res.status) {
        switch(params.url) {
            case Api.API_LANG:
                dispatch(sendReducer(types.LOAD_LANG, res.data));
                break;
            case Api.API_HANDLE_LOGIN:
                dispatch(sendReducer({type: types.LOGIN_SUCCEED, data: res.data }));
                break;
            case Api.API_LOGOUT:
                dispatch(sendReducer({type: types.LOGOUT, data: res.data }));
                break;
            default:

                break;
        }
        
    }
    dispatch(endProgress());
}

export const handleException = (error, dispatch) => {
    dispatch(callReducer(types.EXCEPTION, error.response));
    dispatch(endProgress());
    
}

/** ============================== PROGRESS ================================== */
export const startProgress = () => {
    return {
        type: types.START_PROGRESS
    }
}

export const endProgress = () => {
    return {
        type: types.END_PROGRESS
    }
}