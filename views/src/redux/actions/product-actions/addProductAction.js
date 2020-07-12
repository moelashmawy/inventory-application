import { ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE } from "../types";
import axios from "axios";
import { tokenConfig } from "../auth-actions/tokenConfig";

export const addProduct = product => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    // send our data as a multipart/form-data instead of application/json
    const formData = new FormData();
    for (const x in product) {
      if (x === "productImage") {
        for (let i = 0; i < product.productImage.length; i++) {
          formData.append(x, product.productImage[i]);
        }
      }
      formData.append("productImage", product.productImage);
    }
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("numberInStock", product.numberInStock);

    axios
      .post("/api/product/create", formData, tokenConfig(getState))
      .then(res => {
        let newProduct = res.data.product;
        let successMessage = res.data.message;

        dispatch(addProductSuccess(newProduct, successMessage));
        resolve(successMessage);
      })
      .catch(error => {
        dispatch(addProductFailure(error.response));
        reject(error.response.data.message);
      });
  });
};

const addProductSuccess = (product, successMessage) => {
  return {
    type: ADD_PRODUCT_SUCCESS,
    payload: {
      product,
      successMessage
    }
  };
};

const addProductFailure = error => {
  return {
    type: ADD_PRODUCT_FAILURE,
    payload: {
      error
    }
  };
};
