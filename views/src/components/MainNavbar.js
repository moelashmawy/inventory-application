import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

function MainNavbar() {
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
                    <Link to='/dashboard' className='nav-link'>
                        Dashboard
                    </Link>
                </Nav>
                <Link to='/signup' className='nav-link'>
                    Sign Up
                </Link>
                <Link to='/cart'>
                    <FontAwesomeIcon icon={faShoppingCart} className='mr-5' />
                </Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default MainNavbar;
