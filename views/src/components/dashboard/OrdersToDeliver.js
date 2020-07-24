import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/order-actions/fetchOrdersToDeliver";
import { markOrderDelivered } from "../../redux/actions/order-actions/markOrderDelivered";
import { Container, Button, Col, Row, Image, Alert } from "react-bootstrap";
import { toast, Slide } from "react-toastify";
import DashboardSidebar from "./DashboardSidebar";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import DashboardSpinner from "./DashboardSpinner";

function OrdersToDeliver() {
  const { ordersToDeliver, loading } = useSelector(state => state.ordersToDeliverrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersToDeliver());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && ordersToDeliver.length === 0) {
    emptyMessage = <Alert variant='warning'>There are no orders yet</Alert>;
  }

  let loadingSpinner;
  if (loading && ordersToDeliver.length === 0) {
    emptyMessage = <DashboardSpinner />;
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
    <Container fluid className='orders-history'>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        {/*
         ******************* My orders History *********
         */}
        <Col>
          <h1 className='dashboard-headline'>Orders to deliver</h1>
          {loadingSpinner}
          {emptyMessage}
          {ordersToDeliver.map(order => {
            let singleOrder = (
              <Row className='single-order' key={order._id}>
                <Row className='single-order-heading'>
                  <Col>
                    <div className='order-time'>
                      <div>Order placed </div>
                      <Moment format='YYYY-MM-DD HH:mm'>{order.orderDate}</Moment>
                    </div>
                  </Col>
                  <Col>
                    {order.totalPrice && (
                      <div className='order-todal-price'>
                        Total: <span>${order.totalPrice}</span>
                      </div>
                    )}
                  </Col>
                  <Col md='4'>
                    <Col>
                      Recipient:{" "}
                      <span>
                        {order.address.firstName + " " + order.address.lastName}
                      </span>
                    </Col>
                    <Col>
                      Phone: +20<span>{order.address.phoneNumber}</span>
                    </Col>
                  </Col>
                  <Col>
                    <div className='order-id'>
                      Order ID: #<span>{order._id}</span>
                    </div>
                  </Col>
                </Row>

                <Row className='order-delivered-time'>
                  {order.deliveredDate && (
                    <div>
                      Delivered on:{" "}
                      <Moment format='YYYY-MM-DD HH:mm'>{order.deliveredDate}</Moment>
                    </div>
                  )}
                </Row>

                {order.products.map(productItem => (
                  <Row className='single-order-item' key={productItem._id}>
                    <Col md='3'>
                      <Image
                        src={`${
                          process.env.PUBLIC_URL +
                          "/" +
                          productItem.product.productImage[0].path
                        }`}
                        thumbnail
                      />
                    </Col>

                    <Col md='9'>
                      <Row>
                        <Col md='9'>
                          <Link to={`/product/${productItem.product._id}`}>
                            <div>{productItem.product.name}</div>
                          </Link>
                          <div className='quantity'>
                            Quantity: <span>{productItem.quantity}</span>
                          </div>
                          <div className='price'>
                            $Total:
                            <span>
                              {" "}
                              ${productItem.quantity * productItem.product.price}
                            </span>
                          </div>
                        </Col>
                        <Col md='3'>
                          {!productItem.orderState.delivered && (
                            <Button
                              onClick={() => {
                                handleMarkOrderDelivered(productItem._id);
                              }}>
                              Deliver
                            </Button>
                          )}

                          {productItem.orderState.delivered && (
                            <Button variant='secondary' disabled>
                              Delivered
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ))}
              </Row>
            );

            return singleOrder;
          })}
        </Col>
      </Row>
    </Container>
  );
}

export default OrdersToDeliver;
