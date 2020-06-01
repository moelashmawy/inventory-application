import { combineReducers } from 'redux';
import productReducer from './productsReducer';
import categoryReducer from './categoryReducer';
import categoryProductsReducer from './categoryProductsReducer';
import singleProductReducer from './singleProductReducer';

const rootReducer = combineReducers({
    productsss: productReducer,
    categoriesss: categoryReducer,
    categoryProductsss: categoryProductsReducer,
    singleProducttt: singleProductReducer
});

export default rootReducer;