import { ADD_TO_WISHLIST_SUCCESS, ADD_TO_WISHLIST_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const addToWishlist = productId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { productId };
    axios
      .get("/api/wishlist/addToWishlist", tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let wishlist = res.data.wishlist.items;

        dispatch(addToWishlistSuccess(wishlist, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;
        dispatch(addToWishlistFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const addToWishlistSuccess = (wishlist, message) => {
  return {
    type: ADD_TO_WISHLIST_SUCCESS,
    payload: { wishlist, message }
  };
};

const addToWishlistFailure = error => {
  return {
    type: ADD_TO_WISHLIST_FAILURE,
    payload: { error }
  };
};
