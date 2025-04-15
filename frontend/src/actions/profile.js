import axios from "axios";
import { 
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
} from "./types";

export const load_user = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me/`, config);

        if (res.status == 401){
            dispatch({
                type: LOAD_USER_PROFILE_FAIL,
            });
        }else{
            dispatch({
                type: LOAD_USER_PROFILE_SUCCESS,
                payload: res.data
            });
        }

    } catch (err){
        dispatch({
            type: LOAD_USER_PROFILE_FAIL,
        });
    }
};