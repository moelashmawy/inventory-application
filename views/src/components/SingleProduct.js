import React, { useEffect } from "react";
import { Container, ProgressBar, Image, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchSingleProductAction } from "../redux/actions/product-actions/fetchSingleProductAction";

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
          </Col>
          <Col>
            <Button>Add to cart</Button>
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

export default SingleProduct;
