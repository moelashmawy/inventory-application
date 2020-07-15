import React, { Fragment } from "react";
import { Row, Col, Image } from "react-bootstrap";
import poster1 from "./../../assets/pictures/poster1.jpg";
import poster2 from "./../../assets/pictures/poster2.jpg";
import poster3 from "./../../assets/pictures/poster3.jpg";

const ExploreMore = () => {
  return (
    <div className='explore-more'>
      <h2>Explore More</h2>
      <Row>
        <Col className='item'>
          <a href='/category/shoes'>
            <Image src={poster1} />
          </a>
        </Col>
        <Col className='item'>
          <a href='/category/shoes'>
            <Image src={poster2} />
          </a>
        </Col>
        <Col className='item'>
          <a href='/category/shoes'>
            <Image src={poster3} />
          </a>
        </Col>
      </Row>
    </div>
  );
};

export default ExploreMore;
