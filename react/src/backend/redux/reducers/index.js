import { combineReducers } from 'redux';
import lang from './lang';
import auth from './auth';
import progress from './progress';
import alert from './alert';
import config from './config';
import list from './list';
import select from './select';
import save from './save';
import edit from './edit';

const reducer = combineReducers({
    lang,
    auth,
    progress,
    alert,
    config,
    list,
    select,
    save,
    edit
});

export default reducer;