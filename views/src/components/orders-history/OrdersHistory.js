import React, { useEffect } from "react";
import { Container, Image, Row, Col, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersHistory } from "../../redux/actions/order-actions/fetchOrdersHistory";
import SettingsSidebar from "../account-settings/SettingsSidebar";
import { Link } from "react-router-dom";

function Cart() {
  const { historyOrders } = useSelector(state => state.historyyy);
  const { loading } = useSelector(state => state.userrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, [dispatch]);

  let loadingSpinner;
  if (loading) {
    loadingSpinner = (
      <div>
        <Spinner animation='border' /> loading...
      </div>
    );
  }

  let emptyMessage;
  if (!loading && historyOrders.length === 0) {
    emptyMessage = <div>No orders to show</div>;
  }

  function checkState(state) {
    if (state.refunded) {
      return <div>Refunded</div>;
    } else if (state.returned) {
      return <div>returned</div>;
    } else if (state.delivered) {
      return <div>delivered</div>;
    } else if (state.shipped) {
      return <div>shipped</div>;
    } else {
      return <div>pending</div>;
    }
  }

  return (
    <Container>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        <Col lg={8}>
          {emptyMessage}
          {loadingSpinner}

          {historyOrders.map(order => {
            let singleOrder = (
              <div className='mb-5' key={order._id}>
                <div>Order ID: #{order._id}</div>
                <div>Order placed on: {order.orderDate}</div>
                {order.deliveredDate && <div>Delivered on: {order.deliveredDate}</div>}
                {order.totalPrice && <div>Total Price: ${order.totalPrice}</div>}

                {order.products.map(productItem => (
                  <Container key={productItem._id}>
                    <Row>
                      <Col>
                        <Link to={`/product/${productItem.product._id}`}>
                          <div>{productItem.product.name}</div>
                        </Link>
                        <br />
                        <div>Quantity:{productItem.quantity}</div>
                        <br />
                      </Col>

                      <Col>
                        <br />
                        <Image
                          src={`${
                            process.env.PUBLIC_URL +
                            "/" +
                            productItem.product.productImage
                          }`}
                          thumbnail
                        />
                      </Col>
                      <Col>
                        <div>${productItem.quantity * productItem.product.price}</div>
                        <br />
                        <div>Description: {productItem.product.description}</div>
                        <br />
                      </Col>
                      <Col>
                        <br />
                        <div>Seller: {productItem.product.seller.username}</div>
                        <br />
                        <div>Order state: {checkState(productItem.orderState)}</div>
                      </Col>
                    </Row>
                  </Container>
                ))}
              </div>
            );

            return singleOrder;
          })}
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
