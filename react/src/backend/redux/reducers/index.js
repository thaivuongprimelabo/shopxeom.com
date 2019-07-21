import { combineReducers } from 'redux';
import lang from './lang';
import auth from './auth';
import progress from './progress';
import alert from './alert';
import config from './config';
import list from './list';
import select from './select';
import save from './save';
import validate from './validate';
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
    validate,
    edit
});

export default reducer;