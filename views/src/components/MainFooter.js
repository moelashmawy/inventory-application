import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const MainFooter = () => {
  return (
    <Container className='main-footer' fluid>
      <Row>
        <Col sm={3} className='shop-summary'>
          <h2>Shop</h2>
          <p>lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
        </Col>
        <Col sm={2}>
          <h2>Policy Info</h2>
          <ul>
            <li>
              <a href='/'>Privacy policy</a>
            </li>

            <li>
              <a href='/'>Terms of sale</a>
            </li>

            <li>
              <a href='/'>Terms of use</a>
            </li>

            <li>
              <a href='/'>Report product</a>
            </li>

            <li>
              <a href='/'>Some policy</a>
            </li>
          </ul>
        </Col>
        <Col sm={2}>
          <h2>Company</h2>
          <ul>
            <li>
              <a href='/'>About us</a>
            </li>
            <li>
              <a href='/'>Blog</a>
            </li>
            <li>
              <a href='/'>Inroduction</a>
            </li>
            <li>
              <a href='/'>FAQ</a>
            </li>
            <li>
              <a href='/'>Contact us</a>
            </li>
          </ul>
        </Col>
        <Col sm={2}>
          <h2>Business</h2>
          <ul>
            <li>
              <a href='/'>Sell with us</a>
            </li>
            <li>
              <a href='/'>Advertisment</a>
            </li>
            <li>
              <a href='/'>Terms of use</a>
            </li>
            <li>
              <a href='/'>Affliciate sys</a>
            </li>
            <li>
              <a href='/'>Deal of the day</a>
            </li>
          </ul>
        </Col>
        <Col sm={3}>
          <h2>Subscribe</h2>
          <div className='signup'>
            <div className='title'>
              <span className='signup-icon'>S</span>
              <p>Sign up for our Newsletter</p>
            </div>
            <a href='/doSomething' className='signup-1b'>
              SIGN UP
            </a>
            <br />
            <a href='/update' className='signup-2b'>
              Update your preferences »
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainFooter;
