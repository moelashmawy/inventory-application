import React, { useEffect, useState } from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersHistory } from "../../redux/actions/orders-history/fetchOrdersHistory";
import SettingsSidebar from "../account-settings/SettingsSidebar";
import { Link } from "react-router-dom";

function Cart() {
  const { historyOrders, loading } = useSelector(state => state.historyyy);

  const [totalMoney, setTotalMoney] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersHistory());
    //setTotalMoney(total);
  }, [dispatch]);

  return (
    <Container>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        <Col lg={8}>
          {historyOrders.map(function (order) {
            let single = (
              <div className='mb-5'>
                <div>Order ID: #{order.orderId}</div>
                <div>Order placed on: {order.dateOfPurchase}</div>

                {order.products.map(productItem => (
                  <Container key={productItem._id}>
                    <Row>
                      <Col>
                        <Link to={`/product/${productItem._id}`}>
                          <div>{productItem.product.name}</div>
                        </Link>
                        <br />
                        <div>Quantity:{productItem.orderQuantity}</div>
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
                        <div>
                          ${productItem.orderQuantity * productItem.product.price}
                        </div>
                        <br />
                        <div>Description: {productItem.product.description}</div>
                        <br />
                      </Col>
                      <Col>
                        <br />
                        <div>Seller: {productItem.product.seller.username}</div>
                        <br />
                      </Col>
                    </Row>
                  </Container>
                ))}
              </div>
            );

            return single;
          })}
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
