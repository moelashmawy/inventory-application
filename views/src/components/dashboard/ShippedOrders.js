import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShippedOrders } from "../../redux/actions/order-actions/fetchShippedOrders";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { Container, Col, Row, Image, Button } from "react-bootstrap";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";

function ShippedOrders() {
  const { shippedOrders, loading } = useSelector(state => state.ordersToShippp);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShippedOrders());
  }, [dispatch]);

  let emptyMessage;
  if (!loading && shippedOrders.length === 0) {
    emptyMessage = (
      <tr>
        <td>There are no orders yet</td>
      </tr>
    );
  }

  return (
    <Container fluid className='orders-history'>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        {/*
         ******************* Shipped Order *********
         */}
        <Col>
          <h1 className='dashboard-headline'>Shipped Order</h1>

          {loading && <DashboardSpinner />}

          {emptyMessage}

          {shippedOrders &&
            shippedOrders.map(order => {
              let singleOrder = (
                <Row className='single-order' key={order.products._id}>
                  <Row className='single-order-heading'>
                    <Col>
                      <div className='order-time'>
                        <div>Order placed</div>
                        <Moment format='YYYY-MM-DD HH:mm'>{order.orderDate}</Moment>
                      </div>
                    </Col>
                    <Col>
                      <div className='order-todal-price'>
                        Total:{" "}
                        <span>
                          ${order.products.quantity * order.products.product.price}
                        </span>
                      </div>
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

                  {/* Order product */}
                  <Row className='single-order-item'>
                    <Col md='3'>
                      <Image
                        src={`${
                          process.env.PUBLIC_URL +
                          "/" +
                          order.products.product.productImage[0].path
                        }`}
                        thumbnail
                      />
                    </Col>

                    <Col md='9'>
                      <Row>
                        <Col md='9'>
                          <Link to={`/product/${order.products.product._id}`}>
                            <div>{order.products.product.name}</div>
                          </Link>
                          <div className='quantity'>
                            Quantity: <span>{order.products.quantity}</span>
                          </div>
                          <div className='price'>
                            $Total:
                            <span>
                              {" "}
                              ${order.products.quantity * order.products.product.price}
                            </span>
                          </div>
                        </Col>
                        <Col md='3'>
                          {order.products.orderState.shipped && (
                            <Button variant='success' disabled>
                              Shipped
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Row>
              );

              return singleOrder;
            })}
        </Col>
      </Row>
    </Container>
  );
}

export default ShippedOrders;
