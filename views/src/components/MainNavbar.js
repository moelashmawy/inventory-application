import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { logout } from "./../redux/actions/auth-actions/logoutAction";
import { useDispatch, useSelector } from "react-redux";

function MainNavbar(props) {
  const { user, isAuthenticated } = useSelector(state => state.userrr);

  const dispatch = useDispatch();
  let history = useHistory();

  const logoutUser = () => {
    dispatch(logout());
    history.push("/");
  };

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
          {isAuthenticated && (
            <Link to='/dashboard' className='nav-link'>
              Dashboard
            </Link>
          )}
        </Nav>

        {!isAuthenticated && (
          <Link to='/signup' className='nav-link'>
            Sign Up
          </Link>
        )}

        {!isAuthenticated && (
          <Link to='/login' className='nav-link'>
            Login
          </Link>
        )}
        {isAuthenticated && <span className='nav-link'>Welcome {user.name}</span>}
        {isAuthenticated && (
          <Button onClick={logoutUser} variant='link'>
            Log out
          </Button>
        )}

        <Link to='/cart'>
          <FontAwesomeIcon icon={faShoppingCart} className='mr-5' />
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;
