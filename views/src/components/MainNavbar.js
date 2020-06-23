import React from "react";
import { Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { logout } from "./../redux/actions/auth-actions/logoutAction";
import { useDispatch, useSelector } from "react-redux";

function MainNavbar(props) {
  const { user, auth } = useSelector(state => state.userrr);

  const dispatch = useDispatch();
  let history = useHistory();

  const logoutUser = () => {
    dispatch(logout());
    history.push("/");
  };

  let dashboard;
  if (auth.isAdmin || auth.isSeller) {
    dashboard = (
      <Link to='/dashboard' className='nav-link'>
        Dashboard
      </Link>
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
          {dashboard}
          {/* {auth.isAdmin ||
            (auth.isSeller && (
              <Link to='/dashboard' className='nav-link'>
                Dashboard
              </Link>
            ))} */}
        </Nav>

        {!auth.isCustomer && (
          <Link to='/signup' className='nav-link'>
            Sign Up
          </Link>
        )}

        {!auth.isCustomer && (
          <Link to='/login' className='nav-link'>
            Login
          </Link>
        )}
        {auth.isCustomer && (
          <span className='nav-link'>
            <NavDropdown title={user.lastName} id='basic-nav-dropdown'>
              <NavDropdown.Item href='#action/3.1'>Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                {auth.isCustomer && (
                  <Button onClick={logoutUser} variant='link'>
                    Log out
                  </Button>
                )}
              </NavDropdown.Item>
            </NavDropdown>
          </span>
        )}

        <Link to='/cart'>
          <FontAwesomeIcon icon={faShoppingCart} className='mr-5' />
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;
