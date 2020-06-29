import { combineReducers } from "redux";
import productReducer from "./productsReducer";
import userProductsReducer from "./userProductsReducer";
import categoryReducer from "./categoryReducer";
import categoryProductsReducer from "./categoryProductsReducer";
import singleProductReducer from "./singleProductReducer";
import usersReducer from "./usersReducer";
import cartReducer from "./cartReducer";
import addressReducer from "./addressReducer";
import wishlistReducer from "./wishlistReducer";

const rootReducer = combineReducers({
  productsss: productReducer,
  userProductsss: userProductsReducer,
  categoriesss: categoryReducer,
  categoryProductsss: categoryProductsReducer,
  singleProducttt: singleProductReducer,
  userrr: usersReducer,
  carttt: cartReducer,
  addresss: addressReducer,
  wishlisttt: wishlistReducer
});

export default rootReducer;
