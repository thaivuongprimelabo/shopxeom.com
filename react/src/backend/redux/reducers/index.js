import { combineReducers } from 'redux';
import lang from './lang';
import auth from './auth';
import exception from './exception';
import progress from './progress';

const reducer = combineReducers({
    lang,
    auth,
    exception,
    progress
});

export default reducer;