import React from "react";
import { Row, Col } from "react-bootstrap";
import ProductsCarousel from "./ProductsCarousel";

const DealsOfTheDay = () => {
  return (
    <Row className='deals-of-the-day'>
      <Col lg='3' className='title'>
        <p>Deals of</p>
        <p> the Day</p>
        <p>08:32:18</p>
      </Col>
      <Col lg='9'>
        <ProductsCarousel productsNumber='3' />
      </Col>
    </Row>
  );
};

export default DealsOfTheDay;
