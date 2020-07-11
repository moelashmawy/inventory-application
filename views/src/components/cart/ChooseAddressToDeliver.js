import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses } from "../../redux/actions/address-actions/fetchAddressesAction";
import { chooseOrderAddress } from "../../redux/actions/cart-actions/chooseOrderAddress";
import { Link } from "react-router-dom";

function ChooseAddressToDeliver(props) {
  const [address, setAddress] = useState(null);

  const { addresses, loading } = useSelector(state => state.addresss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  let allAddresses;
  if (loading) {
    allAddresses = (
      <div>
        <Spinner animation='border' role='status' />
        loading...
      </div>
    );
  } else {
    allAddresses = addresses.map(address => (
      <label key={address._id}>
        <input
          type='radio'
          name='address'
          required
          value={address._id}
          onChange={e => {
            dispatch(chooseOrderAddress({ address: e.target.value }));
            setAddress(e.target.value);
          }}
        />
        <h3>
          {address.firstName} {address.lastName}
        </h3>
        <div>
          {address.city}, {address.state}, {address.country}
        </div>
        <div>+20{address.phoneNumber}</div>
        <Link to={`/my_addresses/edit_address?addressId=${address._id}`}>Edit</Link>
      </label>
    ));
  }

  return (
    <Container>
      <Row>
        <Col>
          <h3>Choose shipping address</h3>
        </Col>
        <Col>
          <Link to='/my_addresses/add_address'>
            <Button>Add new Address</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <form>
          {allAddresses}
          <Button
            onClick={() => {
              if (address) props.history.push("/checkout/payment");
            }}
            type='submit'>
            Proceed to pay
          </Button>
        </form>
      </Row>
    </Container>
  );
}

export default ChooseAddressToDeliver;
