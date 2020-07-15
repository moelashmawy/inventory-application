import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, ProgressBar } from "react-bootstrap";
import { connect } from "react-redux";
import { fetchProducts } from "../../redux/actions/product-actions/fetchProductsAction";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

// custom prev arrow
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return <i onClick={onClick} class='fa fa-arrow-left' aria-hidden='true'></i>;
}

// custom next arrow
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return <i onClick={onClick} class='fa fa-arrow-right' aria-hidden='true'></i>;
}

class ProductsCarousel extends React.Component {
  constructor(props) {
    super(props);
  }

  // will fetch the products before the compnent mounts
  componentDidMount() {
    this.props.fetchP();
  }

  render() {
    let productsNumber = this.props.productsNumber;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: productsNumber,
      slidesToScroll: productsNumber,
      arrows: true,
      nextArrow: <SamplePrevArrow />,
      prevArrow: <SampleNextArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <div className='featured-products'>
        <h2>{this.props.title}</h2>
        {this.props.products.loading && <ProgressBar animated now={100} />}
        <Slider {...settings}>
          {!this.props.products.loading &&
            this.props.products.products.map(product => {
              return (
                <Col key={product._id} className='product-card'>
                  <Card>
                    <Card.Img
                      className='product-card-image'
                      variant='top'
                      src={process.env.PUBLIC_URL + "/" + product.productImage[0].path}
                    />
                    <Card.Body className='product-details'>
                      <Card.Title className='product-name'>
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                      </Card.Title>

                      <Row>
                        <Col>
                          <Card.Text className='product-price'>
                            {"$" + product.price}
                          </Card.Text>
                        </Col>
                        <Col>
                          <Card.Text>
                            <i class='fa fa-star' aria-hidden='true' />
                            <i class='fa fa-star' aria-hidden='true' />
                            <i class='fa fa-star' aria-hidden='true' />
                            <i class='fa fa-star-half-o' aria-hidden='true' />
                            <i class='fa fa-star-o' aria-hidden='true' />
                          </Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Slider>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { productsss } = state;
  return { products: productsss };
}

function mapDispatchToProps(dispatch) {
  return { fetchP: () => dispatch(fetchProducts()) };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductsCarousel);
