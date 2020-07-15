import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/order-actions/fetchOrdersToDeliver";
import { markOrderDelivered } from "../../redux/actions/order-actions/markOrderDelivered";
import { Container, Table, Spinner, Button, Col, Row } from "react-bootstrap";
import { toast, Slide } from "react-toastify";
import DashboardSidebar from "./DashboardSidebar";

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

  /**
   * This method to handle our whole update process
   * it takes the targeted category id and the category object
   */
  const handleMarkOrderDelivered = orederId => {
    //this promise was returned to handle sucess and error messages
    dispatch(markOrderDelivered(orederId))
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
      })
      .catch(err => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  return (
    <Container fluid>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col>
          {emptyMessage}
          {loading && (
            <tr>
              <td colSpan='3'>
                <Spinner animation='border' /> loading...{" "}
              </td>
            </tr>
          )}
          {ordersToDeliver &&
            ordersToDeliver.map(order => {
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
                          <td>
                            <Button
                              onClick={() => {
                                handleMarkOrderDelivered(product._id);
                              }}>
                              Delivered
                            </Button>
                            {product.orderState.delivered && <span>yes</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              );

              return singleOrder;
            })}
        </Col>
      </Row>
    </Container>
  );
}

export default OrdersToDeliver;
