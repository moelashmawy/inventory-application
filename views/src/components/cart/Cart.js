import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartProducts } from "../../redux/actions/cart-actions/fetchCartProducts";
import { removeFromCart } from "../../redux/actions/cart-actions/removeFromCart";
import { changeCartQuantity } from "../../redux/actions/cart-actions/changeCartQuantity";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Page404 from "./../404";
import ChooseAddressToDeliver from "./ChooseAddressToDeliver";

function Cart() {
  const { cart, totalPrice, loading } = useSelector(state => state.carttt);
  const { user } = useSelector(state => state.userrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartProducts());
  }, [dispatch]);

  /* handle loading spinner  */
  let loadingSpinner;
  if (loading && cart.length === 0) {
    loadingSpinner = (
      <tr>
        <td colSpan='3'>
          <Spinner animation='border' /> loading...{" "}
        </td>
      </tr>
    );
  }

  /* handle empty message */
  let emptyMessage;
  if (!loading && cart.length === 0) {
    emptyMessage = <td>Your cart is empty</td>;
  }

  // number in stock range
  function options(numberInStock) {
    let arr = [];

    for (let i = 1; i <= numberInStock; i++) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return arr;
  }

  if (!user && !loading) {
    return <Page404 />;
  } else if (cart) {
    return (
      <Container className='cart'>
        <Row>
          <Col className='total-price'>
            <p>Total: ${totalPrice}</p>
          </Col>
          <Col>
            {cart.length > 0 && (
              <Link className='cart-pay' to='/checkout'>
                <Button variant='secondary'>Proceed to pay</Button>
              </Link>
            )}
          </Col>
        </Row>

        <Table striped bordered hover variant='dark' className='cart-table'>
          <thead>
            <tr>
              <th>Item</th>
              <th>quantity</th>
              <th>Total Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {emptyMessage}
            {loadingSpinner}
            {cart.length > 0 &&
              cart.map(item => {
                return (
                  <tr key={item._id}>
                    <td>
                      <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                    </td>

                    <td>
                      <select
                        className='custom-select'
                        value={item.quantity}
                        onChange={e => {
                          let quantity = { orderQuantity: e.target.value };
                          dispatch(changeCartQuantity(item._id, quantity));
                        }}>
                        {options(item.product.numberInStock)}
                      </select>
                    </td>

                    <td className='cart-product-price'>
                      ${item.quantity * item.product.price}
                    </td>
                    <td>
                      <Button
                        className='btn btn-danger'
                        onClick={() => dispatch(removeFromCart(item.product._id))}>
                        <FontAwesomeIcon icon={faTrash} />
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
}

export default Cart;
