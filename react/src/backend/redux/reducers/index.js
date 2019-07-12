import { combineReducers } from 'redux';
import lang from './lang';
import auth from './auth';
import progress from './progress';
import alert from './alert';
import config from './config';

const reducer = combineReducers({
    lang,
    auth,
    progress,
    alert,
    config
});

export default reducer;