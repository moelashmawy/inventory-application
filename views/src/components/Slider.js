import React from "react";
import img1 from "./../assets/pictures/1 (1).jpg";
import img2 from "./../assets/pictures/1 (2).jpg";
import img3 from "./../assets/pictures/1 (3).jpg";
import img4 from "./../assets/pictures/1 (4).jpg";
import { Carousel } from "react-bootstrap";

const Slider = () => {
  return (
    <Carousel className='main-slider'>
      <Carousel.Item>
        <img className='d-block w-100' src={img1} alt='First slide' />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className='d-block w-100' src={img2} alt='Third slide' />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className='d-block w-100' src={img3} alt='Third slide' />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
