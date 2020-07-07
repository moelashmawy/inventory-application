import { DELETE_FROM_WISHLIST_SUCCESS, DELETE_FROM_WISHLIST_FAILURE } from "../types";
import { tokenConfig } from "../auth-actions/tokenConfig";
import axios from "axios";

export const removeFromWishlist = productId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let params = { productId };
    axios
      .get("/api/wishlist/removeFromWishlist", tokenConfig(getState, params))
      .then(res => {
        let successMessage = res.data.message;
        let wishlist = res.data.wishlist.items;

        dispatch(removeFromWishlistSuccess(wishlist, successMessage));
        resolve(successMessage);
      })
      .catch(err => {
        let errorMessge = err.response.data.message;
        dispatch(removeFromWishlistFailure(errorMessge));
        reject(errorMessge);
      });
  });
};

const removeFromWishlistSuccess = (wishlist, message) => {
  return {
    type: DELETE_FROM_WISHLIST_SUCCESS,
    payload: { wishlist, message }
  };
};

const removeFromWishlistFailure = error => {
  return {
    type: DELETE_FROM_WISHLIST_FAILURE,
    payload: { error }
  };
};
