import axios from 'axios';
import {
    CATEGORIES_LOAD_FAIL,
    CATEGORIES_LOAD_SUCCESS
} from './types'

export const load_categories = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/categories/`, config)
        if (res.data) {
            dispatch({
                type: CATEGORIES_LOAD_SUCCESS,
                payload: res.data
            })
        } else {
            dispatch({
                type: CATEGORIES_LOAD_FAIL
            })
        }
    } catch (err) {
        dispatch({
            type: CATEGORIES_LOAD_FAIL
        })
    }
}