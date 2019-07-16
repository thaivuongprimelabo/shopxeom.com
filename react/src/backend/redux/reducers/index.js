import { combineReducers } from 'redux';
import lang from './lang';
import auth from './auth';
import progress from './progress';
import alert from './alert';
import config from './config';
import list from './list';

const reducer = combineReducers({
    lang,
    auth,
    progress,
    alert,
    config,
    list
});

export default reducer;