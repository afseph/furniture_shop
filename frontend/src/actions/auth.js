import axios from "axios";
import { load_user } from "./profile";
import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    DELETE_USER_FAIL,
    DELETE_USER_SUCCESS,
    ADMIN_FAIL,
    ADMIN_SUCCESS
} from "./types"

export const checkAdmin = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/is_admin/`, config);

        if (res.data.error || res.data.isAdmin === false){
            dispatch({
                type: ADMIN_FAIL,
            });
        }
        else if(res.data.isAdmin === true){
            dispatch({
                type: ADMIN_SUCCESS,
            });
        }
        else {
            dispatch({
                type: ADMIN_FAIL,
            });
        }
    } catch (err) {
        dispatch({
            type: ADMIN_FAIL,
        });
    }
};

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login/`, body, config);

        if(res.data.access_token){
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data.message
            });

            dispatch(load_user());

            return { type: LOGIN_SUCCESS };
        } else {
            dispatch({
                type: LOGIN_FAIL,
            });

            return { type: LOGIN_FAIL };
        }
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL,
        }); 

        return { type: LOGIN_FAIL };
    }
};

export const register = (email, password,  first_name, last_name, phone_number) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const body  = JSON.stringify({ email, password,  first_name, last_name, phone_number });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register/`, body, config);

        if (res.data.message === "Вы успешно зарегистрированы!") {
            dispatch({
                type: REGISTER_SUCCESS
            });
            return { type: REGISTER_SUCCESS }
        } else {
            dispatch({
                type: REGISTER_FAIL
            });

            return { type: REGISTER_FAIL }
        }
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL
        });

        return { type: REGISTER_FAIL, detail: err.response.data.detail }
    }
};

export const logout = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    const body = JSON.stringify({
        'withCredentials': true
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout/`, body, config);

        if(res.data.message){
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        } else {
            dispatch({
                type: LOGOUT_FAIL,
            });
        }
    } catch (err) {
        dispatch({
            type: LOGOUT_FAIL,
        }); 
    }
};


// TODO export const delete_account = () => async dispatch => {
//     const config = {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//         }
//     };

//     const body = JSON.stringify({
//         'withCredentials': true
//     });

//     try {
//         const res = await axios.delete(`${process.env.REACT_APP_API_URL}/auth/delete/`, config, body);

//         if (res.data.success) {
//             dispatch({
//                 type: DELETE_USER_SUCCESS
//             });
//         } else {
//             dispatch({
//                 type: DELETE_USER_FAIL
//             });
//         }
//     } catch (err) {
//         dispatch({
//             type: DELETE_USER_FAIL
//         });
//     }
// };