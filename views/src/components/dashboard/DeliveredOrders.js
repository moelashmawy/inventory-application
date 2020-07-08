import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/order-actions/fetchOrdersToDeliver";
import { Link } from "react-router-dom";
import { Container, Table, Spinner } from "react-bootstrap";

function DeliveredOrders() {
  const { deliveredOrders, loading } = useSelector(state => state.ordersToDeliverrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersToDeliver());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && deliveredOrders.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
      </tr>
    );
  }
  let loadingSpinner;
  if (loading && deliveredOrders.length === 0) {
    loadingSpinner = (
      <tr>
        <td colSpan='3'>
          <Spinner animation='border' /> loading...
        </td>
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
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {emptyMessage}
          {loadingSpinner}
          {deliveredOrders &&
            deliveredOrders.map(item => {
              return (
                <tr key={item._id}>
                  <td>
                    <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                  </td>
                  <td>{item.quantity}</td>

                  <td>${item.quantity * item.product.price}</td>
                  <td>Delivered</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
}

export default DeliveredOrders;
