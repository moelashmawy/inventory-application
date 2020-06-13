import { combineReducers } from "redux";
import productReducer from "./productsReducer";
import categoryReducer from "./categoryReducer";
import categoryProductsReducer from "./categoryProductsReducer";
import singleProductReducer from "./singleProductReducer";
import usersReducer from "./usersReducer";

const rootReducer = combineReducers({
    productsss: productReducer,
    categoriesss: categoryReducer,
    categoryProductsss: categoryProductsReducer,
    singleProducttt: singleProductReducer,
    userrr: usersReducer
});

export default rootReducer;
