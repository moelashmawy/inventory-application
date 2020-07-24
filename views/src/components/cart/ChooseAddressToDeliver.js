import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses } from "../../redux/actions/address-actions/fetchAddressesAction";
import { chooseOrderAddress } from "../../redux/actions/cart-actions/chooseOrderAddress";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

function ChooseAddressToDeliver(props) {
  const [address, setAddress] = useState(null);

  const { addresses, loading } = useSelector(state => state.addresss);
  const { user } = useSelector(state => state.userrr);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  let addAddressWarning;
  if (addresses.length === 0 && !loading && !user) {
    addAddressWarning = (
      <Alert className='warning' variant='warning'>
        Please add a shipping address for your order
      </Alert>
    );
  }

  let loadingSpinner;
  if (loading && addresses.length === 0) {
    loadingSpinner = (
      <Loader type='Circles' color='#123' height={100} width={100} className='spinner' />
    );
  }

  let allAddresses = () =>
    addresses.map(address => (
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
        <h3 className='recipent'>
          Recipent:{" "}
          <span>
            {" "}
            {address.firstName} {address.lastName}
          </span>
        </h3>
        <div className='address'>
          Address:{" "}
          <span>
            {address.city}, {address.state}, {address.country}
          </span>
        </div>
        <div className='phone'>
          Phone: <span>+20{address.phoneNumber}</span>
        </div>
        <Link to={`/my_addresses/edit_address?addressId=${address._id}`}>Edit</Link>
      </label>
    ));

  return (
    <Container className='choose-address'>
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
      {loadingSpinner}

      {addAddressWarning}

      {addresses.length > 0 && (
        <Row className='address-list'>
          <form>
            {allAddresses()}
            <Button
              variant='secondary'
              onClick={e => {
                if (address) props.clickBtn("choose-payment");
              }}
              type='submit'>
              Proceed to pay
            </Button>
          </form>
        </Row>
      )}
    </Container>
  );
}

export default ChooseAddressToDeliver;
