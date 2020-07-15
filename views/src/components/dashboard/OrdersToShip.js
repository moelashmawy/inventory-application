import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchordersToShip } from "../../redux/actions/order-actions/fetchOrdersToShip";
import { markOrderShipped } from "../../redux/actions/order-actions/markOrderShipped";
import { Link } from "react-router-dom";
import { Container, Table, Spinner, Button, Col, Row } from "react-bootstrap";
import DashboardSidebar from "./DashboardSidebar";

function OrdersToShip() {
  const { ordersToShip, loading } = useSelector(state => state.ordersToShippp);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchordersToShip());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && ordersToShip.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
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
                <th>Mark as Shiped</th>
              </tr>
            </thead>
            <tbody>
              {emptyMessage}
              {loading && (
                <tr>
                  <td colSpan='3'>
                    <Spinner animation='border' /> loading...{" "}
                  </td>
                </tr>
              )}
              {ordersToShip &&
                ordersToShip.map(item => {
                  return (
                    <tr key={item._id}>
                      <td>
                        <Link to={`/product/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </td>
                      <td>{item.quantity}</td>

                      <td>${item.quantity * item.product.price}</td>
                      <td>
                        <Button onClick={() => dispatch(markOrderShipped(item._id))}>
                          Mark as shipped
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

export default OrdersToShip;
