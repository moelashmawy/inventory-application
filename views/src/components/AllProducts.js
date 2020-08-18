import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/actions/product-actions/fetchProductsAction";
import { addToCart } from "../redux/actions/cart-actions/addToCart";
import { addToWishlist } from "./../redux/actions/wishlist-actions/addToWishlist";
import { toast, Slide } from "react-toastify";
import DashboardSpinner from "./dashboard/DashboardSpinner";
import MainPagination from "./MainPagination";

function AllProducts(props) {
  const { products, pagesCount, loading, error } = useSelector(state => state.productsss);

  let [perPageP, setPerPageP] = useState(8);

  const dispatch = useDispatch();

  // get the page number from the url
  const query = new URLSearchParams(props.location.search);
  const page = parseInt(query.get("page") || "1", 10);

  // will let the user decide how many products to show per page
  let perPage = perPageP || 8;

  useEffect(() => {
    dispatch(fetchProducts(page, perPage));
  }, [dispatch, page, perPage]);

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
      {!loading && (
        <Col className='per-page'>
          <span>Per page</span>
          <select className='custom-select' onChange={e => setPerPageP(e.target.value)}>
            <option value='8'>8</option>
            <option value='12'>12</option>
            <option value='20'>20</option>
            <option value='24'>24</option>
          </select>
        </Col>
      )}
      <Row>
        {loading && <DashboardSpinner />}
        {error && <Col>{error}</Col>}
        {!loading &&
          products.map(product => {
            return (
              <Col lg={3} key={product._id} className='product-card'>
                <Card>
                  <Link to={`/product/${product._id}`}>
                    <Card.Img
                      className='product-card-image'
                      variant='top'
                      src={product.productImage[0]}
                    />
                  </Link>

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
                          onClick={() => {
                            let orderQuantity = 1;
                            let quantity = { orderQuantity };
                            addTo(addToCart(product._id, quantity));
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
      {!loading && <MainPagination path='/products' pagesCount={pagesCount} />}
    </Container>
  );
}

export default AllProducts;
