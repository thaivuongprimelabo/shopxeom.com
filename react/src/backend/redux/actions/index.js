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

export const getData = (params) => {
    return (dispatch) => {
        dispatch(callAxios({
            method: 'GET',
            url : Api.API_GETDATA,
            params: params
        }));
    }
}

export const getSelectData = (key) => {
    return (dispatch) => {
        dispatch(callAxios({
            method: 'GET',
            url : Api.API_GETSELECTDATA,
            params: {
                key: key
            }
        }));
    }
}

export const save = (form) => {
    return (dispatch) => {
        dispatch(callAxios({
            method: 'POST',
            url : Api.API_SAVE,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            data: JSON.stringify(form)
        }));
    }
}

export const edit = (row) => {
    return {
        type: types.EDIT,
        data: row
    }
}

export const checkLogin = () => {
    return (dispatch) => {
        dispatch(callAxios({
            method: 'POST',
            url : Api.API_CHECK_LOGIN,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            }
        }));
    }
}

export const handleLogin = (form) => {

    return (dispatch) => {
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
        dispatch(callAxios({
            method: 'POST',
            url : Api.API_LOGOUT,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            }
        }));
    }
}


export const sendReducer = (obj) => {
    return obj;
}

/** ============================== AXIOS ================================== */
export const callAxios = (params) => {
    return (dispatch) => {
        dispatch(startProgress());
        axios(params)
        .then(res => handleSuccess(res.data, params, dispatch))
        .catch(error => handleException(error, dispatch));
    }
}

export const handleSuccess = (res, params, dispatch) => {

    switch(params.url) {
        case Api.API_LANG:
            dispatch(sendReducer({type: types.LOAD_LANG, data: res}));
            break;
        case Api.API_HANDLE_LOGIN:
            dispatch(sendReducer({type: types.HANDLE_LOGIN, data: res }));
            break;
        case Api.API_LOGOUT:
            dispatch(sendReducer({type: types.LOGOUT, data: res }));
            break;
        case Api.API_CHECK_LOGIN:
            dispatch(sendReducer({type: types.CHECK_LOGIN, data: res }));
            break;
        case Api.API_CONFIG:
            dispatch(sendReducer({type: types.LOAD_CONFIG, data: res}));
            break;
        case Api.API_GETDATA:
            dispatch(sendReducer({type: types.GET_DATA, data: res}));
            break;
        case Api.API_GETSELECTDATA:
            dispatch(sendReducer({type: types.GET_SELECT_DATA, data: res, key: params.params.key}));
            break;
        case Api.API_SAVE:
            dispatch(sendReducer({type: types.SAVE, data: res}));
            if(res.status) {
                dispatch(alertSuccess(res.message));
            } else {
                dispatch(handleValidate(res.error));
            }
            break;
        default:

            break;
    }

    dispatch(endProgress());
    
}

export const handleException = (error, dispatch) => {
    dispatch(alertError(error.response.statusText));
    dispatch(endProgress());
}

export const handleValidate = (error) => {
    return {
        type: types.VALIDATE,
        error: error
    }
}

/** ============================== PROGRESS ================================== */
export const startProgress = () => {
    return (dispatch) => {
        dispatch(clearAlert());
        dispatch({ type: types.START_PROGRESS });
    }
}

export const endProgress = () => {
    return {
        type: types.END_PROGRESS
    }
}

/** ============================== ALERT ================================== */
export const clearAlert = () => {
    return {
        type: types.ALERT,
        message: '',
        cssClass: ''
    }
}

export const alertError = (message) => {
    return {
        type: types.ALERT,
        message: message,
        cssClass: 'alert alert-danger'
    }
}

export const alertSuccess = (message) => {
    return {
        type: types.ALERT,
        message: message,
        cssClass: 'alert alert-success'
    }
}

/** ============================== CONFIG ================================== */
export const loadConfig = () => {
    return (dispatch) => {
        dispatch(callAxios({
            method: 'GET',
            url : Api.API_CONFIG
        }));
    }
}