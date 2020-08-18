import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Breadcrumb } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategoryProducts } from "../redux/actions/category-actions/categoryProductsActions";
import { addToCart } from "../redux/actions/cart-actions/addToCart";
import { addToWishlist } from "./../redux/actions/wishlist-actions/addToWishlist";
import { toast, Slide } from "react-toastify";
import Loader from "react-loader-spinner";
import Page404 from "./404";

function CategoryProducts(props) {
  const { categoryName, categoryProducts, loading, error } = useSelector(
    state => state.categoryProductsss
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoryProducts(props.match.params.id));
  }, [dispatch, props.match.params.id]);

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

  let emptyMessage;
  if (!loading && categoryProducts.length === 0) {
    emptyMessage = <Alert variant='warning'>No items in this category</Alert>;
  }
  if (error === "Request failed with status code 404") {
    // if the user request an id that doesn't exist, render 404 page
    // else the id does exist, render everything normal
    return <Page404 />;
  } else {
    return (
      <Container className='category-products'>
        <Breadcrumb>
          <Breadcrumb.Item href='/categories'>Categories</Breadcrumb.Item>
          <Breadcrumb.Item active>{categoryName}</Breadcrumb.Item>
        </Breadcrumb>

        {loading && (
          <Loader
            type='Circles'
            color='#123'
            height={100}
            width={100}
            className='spinner'
          />
        )}
        {emptyMessage}
        {error && <div>{error}</div>}
        <Row>
          {categoryProducts.map(product => {
            return (
              <Col lg={3} key={product._id} className='product-card'>
                <Card>
                  <Card.Img
                    className='product-card-image'
                    variant='top'
                    src={product.productImage[0]}
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
}

export default CategoryProducts;
