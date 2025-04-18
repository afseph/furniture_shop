import {
    CATEGORIES_LOAD_SUCCESS,
    CATEGORIES_LOAD_FAIL
} from '../actions/types';

const initialState = {
    categories: null,
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case CATEGORIES_LOAD_SUCCESS:
            return {
                ...state,
                categories:payload
            }
        case CATEGORIES_LOAD_FAIL:
            return {
                ...state,
                categories: null
            }
        default:
            return state
    };
};
