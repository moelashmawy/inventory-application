import React from "react";
import { Navbar, Nav, Spinner, NavDropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { logout } from "./../redux/actions/auth-actions/logoutAction";
import { useDispatch, useSelector } from "react-redux";

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
          Dashboard
        </Link>
      </NavDropdown.Item>
    );
  }

  let signUp;
  if (!auth.isCustomer && !loading) {
    signUp = (
      <Link to='/signup' className='nav-link'>
        Sign Up
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
    userDropDown = <Spinner animation='grow' variant='info' />;
  } else if (user) {
    userDropDown = (
      <span className='nav-link'>
        <NavDropdown title={user.firstName} id='basic-nav-dropdown'>
          <NavDropdown.Item>
            <Link className='dropdown-item' to='/settings'>
              My Account
            </Link>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <Link className='dropdown-item' to='/my_addresses'>
              My Addresses
            </Link>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <Link className='dropdown-item' to='/wish_list'>
              Wish List
            </Link>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <Link className='dropdown-item' to='/my_orders'>
              My Orders
            </Link>
          </NavDropdown.Item>

          {dashboard}

          <NavDropdown.Divider />

          <NavDropdown.Item onClick={logoutUser}>Log out</NavDropdown.Item>
        </NavDropdown>
      </span>
    );
  }

  return (
    <Navbar bg='light' expand='lg' className='mb-5'>
      <Navbar.Brand>
        <Link to='/' className='nav-link'>
          Shopping
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          <Link to='/categories' className='nav-link'>
            All Categories
          </Link>
          <Link to='/products' className='nav-link'>
            All Products
          </Link>
        </Nav>
        {signUp}
        {login}
        {userDropDown}
      </Navbar.Collapse>
      {auth.isCustomer && (
        <Link to='/cart'>
          <FontAwesomeIcon icon={faShoppingCart} className='mr-5' />
        </Link>
      )}
    </Navbar>
  );
}

export default MainNavbar;
