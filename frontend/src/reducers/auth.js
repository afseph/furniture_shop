import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    ADMIN_SUCCESS,
    ADMIN_FAIL,
    LOAD_USER_PROFILE_SUCCESS
} from '../actions/types';

const initialState = {
    isAuthenticated: null,
    isAdmin:false,
    email: '',
    first_name: '',
    phone_number: ''
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case ADMIN_SUCCESS:
            return {
                ...state,
                isAdmin:true
            }
        case ADMIN_FAIL:
            return {
                ...state,
                isAdmin:false
            }
        case REGISTER_SUCCESS:
            return {
                ...state, 
                isAuthenticated: false
            }
        case LOAD_USER_PROFILE_SUCCESS:
            return{
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                email: payload
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                isAdmin: false,
                email: ''
            }
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                email: ''
            }
        case REGISTER_FAIL:
        case LOGIN_FAIL: 
        case LOGOUT_FAIL:
        case DELETE_USER_FAIL:
            return state
        default:
            return state
    };
};
