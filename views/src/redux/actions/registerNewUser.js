import { REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS } from "./types";
import axios from "axios";

export const registerNewUser = user => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/users/signup", user)
            .then(res => {
                console.log(res);

                dispatch(registerUserSuccess(res.data.user, res.data.message));
                resolve(res.data.message);
            })
            .catch(err => {
                let errorMeaage = err.response.data.message;

                dispatch(registerUserFailure(errorMeaage));
                reject(errorMeaage);
            });
    });
};

const registerUserSuccess = (user, successMessage) => {
    return {
        type: REGISTER_USER_SUCCESS,
        payload: {
            user,
            successMessage
        }
    };
};

const registerUserFailure = error => {
    return {
        type: REGISTER_USER_FAILURE,
        payload: {
            error
        }
    };
};
