import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/order-actions/fetchOrdersToDeliver";
import { markOrderDelivered } from "../../redux/actions/order-actions/markOrderDelivered";
import { Link } from "react-router-dom";
import { Container, Table, Spinner, Button } from "react-bootstrap";

function OrdersToDeliver() {
  const { ordersToDeliver, loading } = useSelector(state => state.ordersToDeliverrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersToDeliver());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && ordersToDeliver.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
      </tr>
    );
  }

  return (
    <Container>
      <Table striped bordered hover variant='dark'>
        <thead>
          <tr>
            <th>Item</th>
            <th>quantity</th>
            <th>Total Price</th>
            <th>Mark as delivered</th>
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
          {ordersToDeliver &&
            ordersToDeliver.map(item => {
              return (
                <tr key={item._id}>
                  <td>
                    <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                  </td>
                  <td>{item.quantity}</td>

                  <td>${item.quantity * item.product.price}</td>
                  <td>
                    <Button onClick={() => dispatch(markOrderDelivered(item._id))}>
                      Mark as shipped
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
}

export default OrdersToDeliver;
