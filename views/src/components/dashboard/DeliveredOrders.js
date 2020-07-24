import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/order-actions/fetchOrdersToDeliver";
import DashboardSidebar from "./DashboardSidebar";
import { Container, Col, Row, Image, Button } from "react-bootstrap";
import OrderProgress from "./../account-settings/OrderProgress";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import DashboardSpinner from "./DashboardSpinner";

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
    emptyMessage = <DashboardSpinner />;
  }

  return (
    <Container fluid className='orders-history'>
      <Row>
        <Col md={3}>
          <DashboardSidebar />
        </Col>
        {/*
         ******************* My orders History *********
         */}
        <Col md={9}>
          <h1 className='dashboard-headline'>Delivered orders</h1>
          {loadingSpinner}
          {emptyMessage}

          {deliveredOrders.map(order => {
            let singleOrder = (
              <Row className='single-order' key={order._id}>
                <Row className='single-order-heading'>
                  <Col>
                    <div className='order-time'>
                      <div> Order placed</div>
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
                          {productItem.orderState.delivered && (
                            <Button variant='success' disabled>
                              <i class='fa fa-check' aria-hidden='true'></i>
                            </Button>
                          )}
                        </Col>
                      </Row>

                      <OrderProgress state={productItem.orderState} />
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

export default DeliveredOrders;
