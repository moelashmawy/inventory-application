import React, { useEffect } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartProducts } from "../../redux/actions/cart-actions/fetchCartProducts";
import { removeFromCart } from "../../redux/actions/cart-actions/removeFromCart";
import { changeCartQuantity } from "../../redux/actions/cart-actions/changeCartQuantity";
import { placeOrder } from "../../redux/actions/order-actions/placeOrderAction";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Page404 from "./../404";
import { toast, Slide } from "react-toastify";

function Cart() {
  const { cart, totalPrice } = useSelector(state => state.carttt);
  const { user, loading } = useSelector(state => state.userrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartProducts());
  }, [dispatch]);

  let loadingSpinner;
  if (loading) {
    loadingSpinner = (
      <tr>
        <td colSpan='3'>
          <Spinner animation='border' /> loading...{" "}
        </td>
      </tr>
    );
  }

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
      <Container>
        {cart.length > 0 && (
          <Link to='/checkout/select_address'>
            <Button>Proceed to pay</Button>
          </Link>
        )}

        <p>Total: ${totalPrice}</p>

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
                        value={item.quantity}
                        //defaultValue={item.quantity}
                        onChange={e => {
                          let quantity = { orderQuantity: e.target.value };
                          dispatch(changeCartQuantity(item._id, quantity));
                        }}>
                        {options(item.product.numberInStock)}
                      </select>
                    </td>

                    <td>${item.quantity * item.product.price}</td>
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
