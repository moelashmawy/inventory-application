import React, { useEffect } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses } from "../../redux/actions/address-actions/fetchAddressesAction";
import { deleteAddress } from "../../redux/actions/address-actions/deleteAddressAction";
import SettingsSidebar from "./SettingsSidebar";
import { Link } from "react-router-dom";
import { toast, Slide } from "react-toastify";

function Addresses() {
  const { addresses, loading } = useSelector(state => state.addresss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // handle submit our form
  const handleDelete = id => {
    dispatch(deleteAddress(id))
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
      <Row key={address._id}>
        <h3>
          {address.firstName} {address.lastName}
        </h3>
        <div>
          {address.city}, {address.state}, {address.country}
        </div>
        <div>+20{address.phoneNumber}</div>
        <Link to={`/my_addresses/edit_address?addressId=${address._id}`}>Edit</Link>
        <Button variant='danger' onClick={() => handleDelete(address._id)}>
          Delete
        </Button>
      </Row>
    ));
  }

  return (
    <Container>
      <Row>
        <Col lg={4}>
          <SettingsSidebar />
        </Col>
        <Col lg={8}>
          <Row>
            <Col>
              <h3>Shipping Addresses</h3>
            </Col>
            <Col>
              <Link to='/my_addresses/add_address'>
                <Button>Add new Address</Button>
              </Link>
            </Col>
          </Row>
          {allAddresses}
        </Col>
      </Row>
    </Container>
  );
}

export default Addresses;
