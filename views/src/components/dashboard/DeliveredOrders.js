import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/order-actions/fetchOrdersToDeliver";
//import { markOrderShipped } from "../../redux/actions/order-actions/markOrderShipped";
import { Link } from "react-router-dom";
import { Container, Table, Spinner, Button } from "react-bootstrap";

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

  return (
    <Container>
      {emptyMessage}
      {loading && (
        <tr>
          <td colSpan='3'>
            <Spinner animation='border' /> loading...{" "}
          </td>
        </tr>
      )}
      {deliveredOrders &&
        deliveredOrders.map(order => {
          let singleOrder = (
            <div className='mb-5' key={order._id}>
              <div>Order ID: #{order._id}</div>
              <div>Order placed on: {order.orderDate}</div>
              {order.totalPrice && <div>Total Price: ${order.totalPrice}</div>}
              <div>Address: {order.address.state + " " + order.address.city}</div>
              <div>
                Recipient: {order.address.firstName + " " + order.address.lastName}
              </div>
              <div>Phone No.: {order.address.phoneNumber}</div>

              <Table striped bordered hover variant='dark'>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>quantity</th>
                    <th>Total Price</th>
                    <th>Mark as Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map(product => (
                    <tr key={product._id}>
                      <td>{product.product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.product.price * product.quantity}</td>
                      <td>Delivered</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          );

          return singleOrder;
        })}
    </Container>
  );
}

export default DeliveredOrders;
