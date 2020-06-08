import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainNavbar from "./components/MainNavbar";
import Dashboard from "./components/Dashboard";
import Categories from "./components/Categories";
import CategoryProducts from "./components/CategoryProducts";
import Products from "./components/Products";
import SingleProduct from "./components/SingleProduct";
import EditCategories from "./components/EditCategories";
import EditProducts from "./components/EditProducts";

function App() {
    return (
        <Router>
            <div className='App'>
                <MainNavbar />
                <ToastContainer />
            </div>
            <Switch>
                <Route path='/' component={Products} exact />
                <Route path='/dashboard' component={Dashboard} />
                <Route path='/categories' component={Categories} />
                <Route path='/editCategories' component={EditCategories} />
                <Route path='/category/:id' component={CategoryProducts} />
                <Route path='/products' component={Products} />
                <Route path='/editProducts' component={EditProducts} />
                <Route path='/product/:id' component={SingleProduct} />
            </Switch>
        </Router>
    );
}

export default App;
