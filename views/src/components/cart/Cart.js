import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Button, Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartProducts } from "../../redux/actions/cart-actions/fetchCartProducts";
import { removeFromCart } from "../../redux/actions/cart-actions/removeFromCart";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Cart() {
  const { cartInfo, cartItems, loading } = useSelector(state => state.carttt);

  const [totalMoney, setTotalMoney] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartProducts());
  }, [dispatch]);
  console.log(cartInfo, cartItems);

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
            cartItems.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </td>
                  <td>{cartInfo[index].quantity}</td>

                  <td>${cartInfo[index].quantity * item.price}</td>
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
