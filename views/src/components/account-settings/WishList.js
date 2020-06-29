import React, { useEffect } from "react";
import { Container, Table, Spinner, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlistProducts } from "../../redux/actions/wishlist-actions/fetchWishlistProducts";
import { removeFromWishlist } from "../../redux/actions/wishlist-actions/removeFromWishlist";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SettingsSidebar from "./SettingsSidebar";

function WishList() {
  const { wishlistItems, loading } = useSelector(state => state.wishlisttt);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWishlistProducts());
  }, [dispatch]);

  return (
    <Container>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        <Col lg={8}>
          <Table striped bordered hover variant='dark'>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan='3'>
                    <Spinner animation='border' /> loading...{" "}
                  </td>
                </tr>
              )}
              {!loading &&
                wishlistItems.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <Button
                          className='btn btn-danger'
                          onClick={() => dispatch(removeFromWishlist(item._id))}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default WishList;
