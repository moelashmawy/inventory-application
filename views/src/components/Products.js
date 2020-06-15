import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/actions/product-actions/fetchProductsAction";

function Categories() {
  const { products, loading, error } = useSelector(state => state.productsss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Container>
      <Row>
        {loading && (
          <Col>
            <Spinner animation='border' /> Loading...
          </Col>
        )}
        {error && <Col>{error}</Col>}
        {products.map(product => {
          return (
            <Col lg={4} key={product._id} className='mb-5'>
              <Card>
                <Card.Img
                  className='product-card-image'
                  height='300px'
                  variant='top'
                  src={process.env.PUBLIC_URL + "/" + product.productImage}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{"$" + product.price}</Card.Text>
                  <Link to={`/product/${product._id}`}>
                    <Button variant='primary'>View</Button>
                  </Link>
                  <Button className='ml-3'>Add to cart</Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Categories;
