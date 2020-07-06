import React, { useEffect } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartProducts } from "../../redux/actions/cart-actions/fetchCartProducts";
import { removeFromCart } from "../../redux/actions/cart-actions/removeFromCart";
import { placeOrder } from "../../redux/actions/order-actions/placeOrderAction";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Page404 from "./../404";
import { toast, Slide } from "react-toastify";

function Cart() {
  const { cart } = useSelector(state => state.carttt);
  const { user, loading } = useSelector(state => state.userrr);

  //const [totalMoney, setTotalMoney] = useState(0);

  const dispatch = useDispatch();
  /* 
  // will use this method to merge both arrays' objects depending on the _id
  let hash = new Map();
  cartInfo.concat(cartItems).forEach(function (obj) {
    hash.set(obj._id, Object.assign(hash.get(obj._id) || {}, obj));
  });
  let cart = Array.from(hash.values());

  // this function to sum the products price
  let total = cart.reduce(function (a, b) {
    return a + b.price * b.orderQuantity;
  }, 0); */

  useEffect(() => {
    dispatch(fetchCartProducts());
    //setTotalMoney(total);
  }, [dispatch]);

  const placeNewOrder = () => {
    dispatch(placeOrder())
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

  if (!user && !loading) {
    return <Page404 />;
  } else if (cart) {
    return (
      <Container>
        <Button onClick={() => placeNewOrder()}>Proceed to pay</Button>
        <p>Total: {}</p>
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
                    <td>{item.quantity}</td>

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
