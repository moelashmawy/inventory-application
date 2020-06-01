import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainNavbar from './components/MainNavbar';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import CategoryProducts from './components/CategoryProducts';
import Products from './components/Products';
import SingleProduct from './components/SingleProduct';
import EditCategories from './components/EditCategories';
import EditProducts from './components/EditProducts';

function App() {
  return (
    <Router>
      <div className="App">
        <MainNavbar />
      </div>
      <Switch>
        <Route path='/' component={Products} exact />
        <Route path='/dashboard' component={Dashboard} exact />
        <Route path='/categories' component={Categories} exact />
        <Route path='/editCategories' component={EditCategories} exact />
        <Route path='/category/:id' component={CategoryProducts} exact />
        <Route path='/products' component={Products} exact />
        <Route path='/editProducts' component={EditProducts} exact />
        <Route path='/product/:id' component={SingleProduct} exact />
      </Switch>
    </Router>
  );
}

export default App;
