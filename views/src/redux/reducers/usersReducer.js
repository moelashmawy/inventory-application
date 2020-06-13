import { REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS } from "../actions/types";

let initialState = {
    user: {},
    success: null,
    error: null
};

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_SUCCESS:
            return {
                user: action.payload.user,
                error: null,
                success: action.payload.successMessage
            };
        case REGISTER_USER_FAILURE:
            return {
                error: action.payload.error,
                success: null
            };

        default:
            return state;
    }
};

export default usersReducer;
