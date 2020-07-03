import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartProducts } from "../../redux/actions/cart-actions/fetchCartProducts";
import { removeFromCart } from "../../redux/actions/cart-actions/removeFromCart";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Cart() {
  const { cartInfo, cartItems, loading } = useSelector(state => state.carttt);

  const [totalMoney, setTotalMoney] = useState(0);

  const dispatch = useDispatch();

  // will use this method to merge both arrays' objects depending on the _id
  let hash = new Map();
  cartInfo.concat(cartItems).forEach(function (obj) {
    hash.set(obj._id, Object.assign(hash.get(obj._id) || {}, obj));
  });
  let cart = Array.from(hash.values());

  // this function to sum the products price
  let total = cart.reduce(function (a, b) {
    return a + b.price * b.orderQuantity;
  }, 0);

  useEffect(() => {
    dispatch(fetchCartProducts());
    setTotalMoney(total);
  }, [dispatch, total]);

  return (
    <Container>
      <Button>Proceed to pay</Button>
      <p>Total: {totalMoney}</p>
      <Table striped bordered hover variant='dark'>
        <thead>
          <tr>
            <th>Item</th>
            <th>quantity</th>
            <th>Total Price</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan='3'>
                <Spinner animation='border' /> loading...{" "}
              </td>
            </tr>
          )}
          {!loading &&
            cart.map(item => {
              return (
                <tr key={item._id}>
                  <td>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </td>
                  <td>{item.orderQuantity}</td>

                  <td>${item.orderQuantity * item.price}</td>
                  <td>
                    <Button
                      className='btn btn-danger'
                      onClick={() => dispatch(removeFromCart(item._id))}>
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

export default Cart;
