import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchSingleProductAction } from "../redux/actions/product-actions/fetchSingleProductAction";
import { toast, Slide as toastSlide } from "react-toastify";
import { addToCart } from "./../redux/actions/cart-actions/addToCart";
import { addToWishlist } from "./../redux/actions/wishlist-actions/addToWishlist";
import ProductsCarousel from "./home-page/ProductsCarousel";
import Page404 from "./404";
import { Link } from "react-router-dom";
import ExploreMore from "./home-page/ExploreMore";
import Loader from "react-loader-spinner";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  ImageWithZoom
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

function SingleProduct(props) {
  const [orderQuantity, setOrderQuantity] = useState(0);

  // import product, loading, error from redux store
  const { product, loading, error } = useSelector(state => state.singleProducttt);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleProductAction(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  // just in case someone deleted a category
  const prodCategory = () => {
    if (product.category !== null) {
      return (
        <div className='product-category'>
          Category:{" "}
          <Link to={`/category/${product.category._id}`}>{product.category.name}</Link>
        </div>
      );
    } else {
      return <div className='product-category'>Category: undefined "will edit soon"</div>;
    }
  };

  // to return options with just order in stock
  let numberInStock = product.numberInStock;
  function options() {
    let arr = [];

    for (let i = 1; i <= numberInStock; i++) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return arr;
  }

  // handle add to cart and wishlist
  const addTo = addFunction => {
    dispatch(addFunction)
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: toastSlide
        });
      })
      .catch(err => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  // if the user request an id that doesn't exist, render 404 page
  // else the id does exist, render everything normal
  if (error === "Request failed with status code 404") {
    return <Page404 />;
  } else {
    return (
      <Container fluid className='single-product-page'>
        {loading && (
          <Loader
            type='Circles'
            color='#123'
            height={100}
            width={100}
            className='dashboard-spinner'
          />
        )}
        {error && <div>{error}</div>}
        {product.category !== undefined && (
          <Row>
            <Col md='6' sm='12'>
              <CarouselProvider
                naturalSlideWidth={90}
                naturalSlideHeight={90}
                hasMasterSpinner='true'
                totalSlides={product.productImage.length}>
                <Slider>
                  {product.productImage.map(image => {
                    let imgPath = image.path.replace(/\\/g, "/");
                    return (
                      <Slide>
                        <ImageWithZoom
                          className='d-block w-100 product-card-image'
                          src={`${process.env.PUBLIC_URL + "/" + imgPath}`}
                        />
                      </Slide>
                    );
                  })}
                </Slider>
                <ButtonBack>
                  <i class='fa fa-arrow-left' aria-hidden='true'></i>
                </ButtonBack>
                <ButtonNext>
                  <i class='fa fa-arrow-right' aria-hidden='true'></i>
                </ButtonNext>
              </CarouselProvider>
            </Col>

            <Col>
              <h2 className='product-name'>{product.name}</h2>
              <Row>
                <Col>
                  <div className='product-price'>${product.price}</div>
                </Col>
                <Col>
                  <i
                    class='fa fa-heart-o add-to-wish-list'
                    onClick={() => {
                      addTo(addToWishlist(product._id));
                    }}
                    aria-hidden='true'
                    title='Add to wish list'></i>
                </Col>
              </Row>

              <div className='product-desc'>Description: {product.description}</div>
              {product.numberInStock < 67 && (
                <div className='product-stock'>
                  only {product.numberInStock} left in Stock, order soon.
                </div>
              )}

              <Row>
                <Col className='order-quantity'>
                  <span>Quantity:</span>
                  <select
                    className='browser-default custom-select'
                    onChange={e => {
                      setOrderQuantity(e.target.value);
                    }}>
                    {options()}
                  </select>
                </Col>
                <Col>
                  <Button
                    className='add-to-cart'
                    variant='secondary'
                    onClick={() => {
                      let quantity = { orderQuantity };
                      addTo(addToCart(product._id, quantity));
                    }}>
                    Add to cart
                  </Button>
                </Col>
              </Row>
              <div className='sold-by'>Sold by: {product.seller.username}</div>
              {prodCategory()}
            </Col>
          </Row>
        )}

        <ProductsCarousel title='Similar Products' productsNumber='4' />
        <ExploreMore />
      </Container>
    );
  }
}

export default SingleProduct;
