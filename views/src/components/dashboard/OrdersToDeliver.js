import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrdersToDeliver } from "../../redux/actions/orders-to_deliver/ordersToDeliver";
import { Link } from "react-router-dom";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function OrdersToDeliver() {
  const { ordersToDeliver, loading } = useSelector(state => state.ordersToDeliverrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrdersToDeliver());
  }, [dispatch]);

  console.log(ordersToDeliver);

  return (
    <Container>
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
          {ordersToDeliver &&
            ordersToDeliver.map(item => {
              return (
                <tr key={item._id}>
                  <td>
                    <Link to={`/product/${item._id}`}>{item.product.name}</Link>
                  </td>
                  <td>{item.orderQuantity}</td>

                  <td>${item.orderQuantity * item.product.price}</td>
                  <td>
                    <Button>Mark as shipped</Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
}

export default OrdersToDeliver;
