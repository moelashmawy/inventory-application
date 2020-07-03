import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainNavbar from "./components/MainNavbar";
import Dashboard from "./components/dashboard/Dashboard";
import Categories from "./components/Categories";
import CategoryProducts from "./components/CategoryProducts";
import Products from "./components/Products";
import SingleProduct from "./components/SingleProduct";
import EditCategories from "./components/dashboard/EditCategories";
import EditProducts from "./components/dashboard/EditProducts";
import AddProductForm from "./components/dashboard/AddProductForm";
import SignUpForm from "./components/login&signup/SignUpForm";
import LoginForm from "./components/login&signup/LoginForm";
import Cart from "./components/cart/Cart";
import AccountSettings from "./components/account-settings/AccountSettings";
import Addresses from "./components/account-settings/Addresses";
import OrdersHistory from "./components/orders-history/OrdersHistory";
import WishList from "./components/account-settings/WishList";
import AddAddressForm from "./components/account-settings/AddAddressForm";
import EditAddressForm from "./components/account-settings/EditAddressForm";
import EditAccountForm from "./components/account-settings/EditAccountForm";
import OrdersToDeliver from "./components/dashboard/OrdersToDeliver";
import Page404 from "./components/404";
import { loadUser } from "./redux/actions/auth-actions/loadUser";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <div className='App'>
        <MainNavbar />
        <ToastContainer />
      </div>
      <Switch>
        <Route path='/' component={Products} exact />
        <Route path='/dashboard' component={Dashboard} exact />
        <Route path='/signup' component={SignUpForm} />
        <Route path='/login' component={LoginForm} />
        <Route path='/categories' component={Categories} />
        <Route path='/editCategories' component={EditCategories} />
        <Route path='/category/:id' component={CategoryProducts} />
        <Route path='/products' component={Products} />
        <Route path='/editProducts' component={EditProducts} />
        <Route path='/addProduct' component={AddProductForm} />
        <Route path='/product/:id' component={SingleProduct} />
        <Route path='/cart' component={Cart} />
        <Route path='/settings' component={AccountSettings} exact />
        <Route path='/settings/edit_account' component={EditAccountForm} />
        <Route path='/my_addresses' component={Addresses} exact />
        <Route path='/my_addresses/add_address' component={AddAddressForm} />
        <Route path='/my_addresses/edit_address' component={EditAddressForm} />
        <Route path='/my_orders' component={OrdersHistory} />
        <Route path='/wish_list' component={WishList} />
        <Route path='/dashboard/orders_to_deliver' component={OrdersToDeliver} />
        {/* if no match just render 404 not found page */}
        <Route component={Page404} />
      </Switch>
    </Router>
  );
}

export default App;
