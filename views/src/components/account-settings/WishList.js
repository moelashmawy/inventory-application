import React, { useEffect } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlistProducts } from "../../redux/actions/wishlist-actions/fetchWishlistProducts";
import { removeFromWishlist } from "../../redux/actions/wishlist-actions/removeFromWishlist";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SettingsSidebar from "./SettingsSidebar";
import Loader from "react-loader-spinner";

function WishList() {
  const { wishlistItems, loading } = useSelector(state => state.wishlisttt);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWishlistProducts());
  }, [dispatch]);

  let loadingSpinner;
  if (loading) {
    loadingSpinner = (
      <Loader type='Circles' color='#123' height={100} width={100} className='spinner' />
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        <Col lg={8}>
          {loadingSpinner}
          {!loading && (
            <Table striped bordered hover variant='dark'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.map(item => {
                  return (
                    <tr key={item.product._id}>
                      <td>
                        <Link to={`/product/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </td>
                      <td>${item.product.price}</td>
                      <td>
                        <Button
                          className='btn btn-danger'
                          onClick={() => dispatch(removeFromWishlist(item.product._id))}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default WishList;
