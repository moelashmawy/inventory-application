import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchordersToShip } from "../../redux/actions/order-actions/fetchOrdersToShip";
import { Link } from "react-router-dom";
import { Container, Table, Spinner, Col, Row } from "react-bootstrap";
import DashboardSidebar from "./DashboardSidebar";

function ShippedOrders() {
  const { shippedOrders, loading } = useSelector(state => state.ordersToShippp);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchordersToShip());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && shippedOrders.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
      </tr>
    );
  }
  let loadingSpinner;
  if (loading && shippedOrders.length === 0) {
    loadingSpinner = (
      <tr>
        <td colSpan='3'>
          <Spinner animation='border' /> loading...
        </td>
      </tr>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col>
          <Table striped bordered hover variant='dark'>
            <thead>
              <tr>
                <th>Item</th>
                <th>quantity</th>
                <th>Total Price</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {emptyMessage}
              {loadingSpinner}
              {shippedOrders &&
                shippedOrders.map(item => {
                  return (
                    <tr key={item._id}>
                      <td>
                        <Link to={`/product/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </td>
                      <td>{item.quantity}</td>

                      <td>${item.quantity * item.product.price}</td>
                      <td>Shipped</td>
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

export default ShippedOrders;
