import { combineReducers } from 'redux';
import lang from './lang';
import auth from './auth';
import progress from './progress';
import alert from './alert';
import config from './config';
import list from './list';
import select from './select';

const reducer = combineReducers({
    lang,
    auth,
    progress,
    alert,
    config,
    list,
    select
});

export default reducer;