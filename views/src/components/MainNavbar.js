import React from "react";
import { Navbar, Nav, Spinner, NavDropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { logout } from "./../redux/actions/auth-actions/logoutAction";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import Loader from "react-loader-spinner";

import logo from "./../assets/pictures/logo.png";

function MainNavbar(props) {
  const { user, auth, loading } = useSelector(state => state.userrr);

  const dispatch = useDispatch();
  let history = useHistory();

  const logoutUser = () => {
    dispatch(logout());
    history.push("/");
  };

  let dashboard;
  if (auth.isAdmin || auth.isSeller) {
    dashboard = (
      <NavDropdown.Item>
        <Link className='dropdown-item' to='/dashboard'>
          <i class='fa fa-tachometer' aria-hidden='true' />
          Dashboard
        </Link>
      </NavDropdown.Item>
    );
  }

  let signUp;
  if (!auth.isCustomer && !loading) {
    signUp = (
      <Link to='/signup' className='nav-link'>
        Sign Up /
      </Link>
    );
  }

  let login;
  if (!auth.isCustomer && !loading) {
    login = (
      <Link to='/login' className='nav-link'>
        Login
      </Link>
    );
  }

  let userDropDown;
  if (loading) {
    userDropDown = (
      <Loader type='ThreeDots' color='#dd1c1c' width={40} className='mr-5' />
    );
  } else if (user) {
    userDropDown = (
      <span className='nav-link'>
        <NavDropdown title={user.firstName} id='basic-nav-dropdown'>
          <NavDropdown.Item>
            <Link className='dropdown-item' to='/settings'>
              <i class='fa fa-user-o' aria-hidden='true' />
              My Account
            </Link>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <Link className='dropdown-item' to='/my_addresses'>
              <i class='fa fa-address-book-o' aria-hidden='true' />
              My Addresses
            </Link>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <Link className='dropdown-item' to='/wish_list'>
              <i class='fa fa-heart' aria-hidden='true' />
              Wish List
            </Link>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <Link className='dropdown-item' to='/my_orders'>
              <i class='fa fa-folder' aria-hidden='true' />
              My Orders
            </Link>
          </NavDropdown.Item>

          {dashboard}

          <NavDropdown.Divider />

          <NavDropdown.Item onClick={logoutUser}>
            <i class='fa fa-sign-out' aria-hidden='true' />
            Log out
          </NavDropdown.Item>
        </NavDropdown>
      </span>
    );
  }

  return (
    <Navbar bg='light' expand='xxl' className='main-navbar'>
      <div>
        <Navbar.Toggle aria-controls='basic-navbar-nav' className='navbar-toggle' />

        <Link to='/'>
          <img
            src={logo}
            width='100'
            className='d-inline-block align-top'
            alt='React Bootstrap logo'
          />
        </Link>
      </div>

      <Search />

      <div className='navbar-login'>
        {signUp} {login}
      </div>

      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <Link to='/categories' className='nav-link'>
            All Categories
          </Link>
          <Link to='/products' className='nav-link'>
            All Products
          </Link>
        </Nav>
      </Navbar.Collapse>

      {userDropDown}

      {auth.isCustomer && (
        <Link to='/cart'>
          <i class='fa fa-shopping-cart cart-icon' aria-hidden='true' />
        </Link>
      )}
    </Navbar>
  );
}

export default MainNavbar;
