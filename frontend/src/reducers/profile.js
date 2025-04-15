import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL,
} from '../actions/types';

const initialState = {
    email: '',
    first_name: '',
    last_name: '',
    phone_number: ''
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case LOAD_USER_PROFILE_SUCCESS:
        case UPDATE_USER_PROFILE_SUCCESS:
            return{
                ...state,
                email: payload.email,
                first_name: payload.profile.name,
                last_name: payload.profile.last_name,
                phone_number: payload.profile.phone_number,
            }
        case LOAD_USER_PROFILE_FAIL:
            return{
                ...state,
                email: '',
                first_name: '',
                last_name: '',
                phone_number: '',
            }
        case UPDATE_USER_PROFILE_FAIL:
            return{
                ...state
            }
        default:
            return state
    };
};
