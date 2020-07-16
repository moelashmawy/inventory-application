import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/actions/product-actions/fetchProductsAction";
import { addToCart } from "../redux/actions/cart-actions/addToCart";
import { addToWishlist } from "./../redux/actions/wishlist-actions/addToWishlist";
import { toast, Slide } from "react-toastify";
import DashboardSpinner from "./dashboard/DashboardSpinner";

function AllProducts() {
  const { products, loading, error } = useSelector(state => state.productsss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

  return (
    <Container fluid className='all-products'>
      <Row>
        {loading && <DashboardSpinner />}
        {error && <Col>{error}</Col>}
        {!loading &&
          products.map(product => {
            return (
              <Col lg={3} key={product._id} className='product-card'>
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
                    <Row>
                      <Col>
                        <i
                          class='fa fa-cart-plus add-to-cart'
                          aria-hidden='true'
                          onClick={e => {
                            e.preventDefault();
                            addTo(addToCart(product._id));
                          }}
                          title='Add to cart'
                        />
                      </Col>
                      <Col>
                        <i
                          onClick={() => {
                            addTo(addToWishlist(product._id));
                          }}
                          class='fa fa-heart-o add-to-wishlist'
                          aria-hidden='true'
                          title='Add to wish list'
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
}

export default AllProducts;
