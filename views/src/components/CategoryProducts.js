import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategoryProducts } from "../redux/actions/category-actions/categoryProductsActions";
import Page404 from "./404";

function CategoryProducts(props) {
  const { categoryName, categoryProducts, loading, error } = useSelector(
    state => state.categoryProductsss
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoryProducts(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  // if the user request an id that doesn't exist, render 404 page
  // else the id does exist, render everything normal
  if (error === "Request failed with status code 404") {
    return <Page404 />;
  } else {
    return (
      <Container>
        {loading && (
          <div>
            <Spinner animation='border' /> loading...{" "}
          </div>
        )}
        {error && <div>{error}</div>}
        <div>{categoryName}</div>
        <Row>
          {categoryProducts.map(product => {
            return (
              <Col lg={4} key={product._id} className='mb-5'>
                <Card>
                  <Card.Img
                    className='product-card-image'
                    variant='top'
                    height='300px'
                    src={process.env.PUBLIC_URL + "/" + product.productImage[0].path}
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
}

export default CategoryProducts;
