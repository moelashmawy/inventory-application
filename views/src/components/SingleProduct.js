import React, { useEffect } from "react";
import { Container, ProgressBar, Image, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchSingleProductAction } from "../redux/actions/product-actions/fetchSingleProductAction";
import { toast, Slide } from "react-toastify";
import { addToCart } from "./../redux/actions/cart-actions/addToCart";
import { addToWishlist } from "./../redux/actions/wishlist-actions/addToWishlist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Page404 from "./404";

function SingleProduct(props) {
  const { product, loading, error } = useSelector(state => state.singleProducttt);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleProductAction(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  const prodCategory = () => {
    if (product.category !== null) {
      return <div>Category: {product.category.name}</div>;
    } else {
      return <div>Category: undefined "please consider edit this product"</div>;
    }
  };

  // handle add to cart and wishlist
  const addTo = addFunction => {
    dispatch(addFunction)
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
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
      <Container>
        {loading && <ProgressBar animated now={100} />}
        {error && <div>{error}</div>}
        {product.category !== undefined && (
          <Row>
            <Col>
              <div>{product.name}</div>
              <br />
              <Image
                src={`${process.env.PUBLIC_URL + "/" + product.productImage}`}
                thumbnail
              />
            </Col>
            <Col>
              <div>${product.price}</div>
              <br />
              <div>Description: {product.description}</div>
              <br />
              <div>Stock: {product.numberInStock}</div>
              <br />
            </Col>
            <Col>
              <Button
                onClick={() => {
                  addTo(addToCart(product._id));
                }}>
                Add to cart
              </Button>
              <FontAwesomeIcon
                onClick={() => {
                  addTo(addToWishlist(product._id));
                }}
                color='red'
                size='lg'
                icon={faHeart}
                className='ml-5'
              />
              <br />
              <br />
              <div>Condition: New</div>
              <br />
              <div>Sold by: {product.seller.username}</div>
              <br />
              {prodCategory()}
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

export default SingleProduct;
