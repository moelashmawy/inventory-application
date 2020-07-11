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
import ordersHistoryReducer from "./ordersHistoryReducer";
import ordersToShip from "./ordersToShip";
import ordersToDeliver from "./ordersToDeliver";
import permissionsReducer from "./permissionsReducer";
import shippersReducer from "./shippersReducer";

const rootReducer = combineReducers({
  productsss: productReducer,
  userProductsss: userProductsReducer,
  categoriesss: categoryReducer,
  categoryProductsss: categoryProductsReducer,
  singleProducttt: singleProductReducer,
  userrr: usersReducer,
  carttt: cartReducer,
  addresss: addressReducer,
  wishlisttt: wishlistReducer,
  historyyy: ordersHistoryReducer,
  ordersToShippp: ordersToShip,
  ordersToDeliverrr: ordersToDeliver,
  permissionsss: permissionsReducer,
  shippersss: shippersReducer
});

export default rootReducer;
