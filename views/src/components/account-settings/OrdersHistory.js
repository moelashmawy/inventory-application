import React, { useEffect } from "react";
import { Container, Image, Row, Col, Alert, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersHistory } from "../../redux/actions/order-actions/fetchOrdersHistory";
import SettingsSidebar from "./SettingsSidebar";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import OrderProgress from "./OrderProgress";

function Cart() {
  const { historyOrders, loading } = useSelector(state => state.historyyy);
  const { user } = useSelector(state => state.userrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  let loadingSpinner;
  if (loading && historyOrders.length === 0) {
    loadingSpinner = (
      <Loader type='Circles' color='#123' height={100} width={100} className='spinner' />
    );
  }

  let emptyMessage;
  if (!user && !loading && historyOrders.length === 0) {
    emptyMessage = <Alert variant='warning'>No orders to show</Alert>;
  }

  return (
    <Container fluid className='orders-history'>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        {/*
         ******************* My orders History *********
         */}
        <Col lg={8}>
          <Row className='heading'>Orders History</Row>
          {emptyMessage}
          {loadingSpinner}

          {historyOrders.map(order => {
            let singleOrder = (
              <Row className='single-order' key={order._id}>
                <Row className='single-order-heading'>
                  <Col>
                    <div className='order-time'>
                      Order placed <span>{order.orderDate}</span>
                    </div>
                  </Col>
                  <Col>
                    {order.totalPrice && (
                      <div className='order-todal-price'>
                        Total: <span>${order.totalPrice}</span>
                      </div>
                    )}
                  </Col>
                  <Col>
                    Shipped to:{" "}
                    <span>{order.address.firstName + " " + order.address.lastName}</span>
                  </Col>
                  <Col>
                    <div className='order-id'>
                      Order ID: #<span>{order._id}</span>
                    </div>
                  </Col>
                </Row>

                <Row className='order-delivered-time'>
                  {order.deliveredDate && <div>Delivered on: {order.deliveredDate}</div>}
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
                          <Button variant='secondary'>Return</Button>
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

export default Cart;
