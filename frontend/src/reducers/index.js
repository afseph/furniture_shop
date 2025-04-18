import {combineReducers} from 'redux';
import profile from './profile';
import auth from './auth';
import categories from './categories';

export default combineReducers({
    categories,
    auth,
    profile
});