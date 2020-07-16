import React from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Button, Container, Toast, Row, Col, Breadcrumb } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import { addAddress } from "../../redux/actions/address-actions/addAddressAction";

// form validation useing Yup
const validate = () =>
  Yup.object({
    firstName: Yup.string()
      .min(2, "Must be more then one character")
      .required("This field is required"),
    lastName: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    address1: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    address2: Yup.string().min(2, "Must be more than 10 characters"),
    country: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    state: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    city: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    street: Yup.string()
      .min(2, "Must be more than 10 characters")
      .required("This field is required"),
    building: Yup.string().min(2, "Must be more than 10 characters"),
    floor: Yup.string().min(2, "Must be more than 10 characters"),
    apartment: Yup.string().min(2, "Must be more than 10 characters"),
    phoneNumber: Yup.number()
      .positive("Must be more than 0")
      .integer("Must be more than 0")
      .required("This field is required"),
    postalCode: Yup.number()
      .positive("Must be more than 0")
      .integer("Must be more than 0")
      .required("This field is required")
  });

function AddAddressForm() {
  const dispatch = useDispatch();

  // handle submit our form
  const handleSubmitt = address => {
    dispatch(addAddress(address))
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

  const initialValues = {
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    street: "",
    building: "",
    floor: "",
    apartment: "",
    phoneNumber: "",
    postalCode: ""
  };

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href='/my_addresses'>My Addresses</Breadcrumb.Item>
        <Breadcrumb.Item active>Add address</Breadcrumb.Item>
      </Breadcrumb>

      <Formik
        initialValues={initialValues}
        validationSchema={validate}
        onSubmit={(values, { setSubmitting }) => {
          const newAddress = {
            firstName: values.firstName,
            lastName: values.lastName,
            address1: values.address1,
            address2: values.address2,
            country: values.country,
            state: values.state,
            city: values.city,
            street: values.street,
            building: values.building,
            floor: values.floor,
            apartment: values.apartment,
            phoneNumber: values.phoneNumber,
            postalCode: values.postalCode
          };

          handleSubmitt(newAddress);

          setSubmitting(false);
        }}>
        <Form
          action='/api/product/create'
          method='post'
          encType='multipart/form-data'
          className='add-category-form mb-5'>
          <Row>
            <Col>
              <div className='form-group'>
                <label>First Name *</label>
                <Field
                  type='text'
                  name='firstName'
                  className='form-control'
                  placeholder='Enter first name'
                />
                <ErrorMessage component={Toast} name='firstName' />
              </div>
            </Col>
            <Col>
              <div className='form-group'>
                <label>Last Name *</label>
                <Field
                  type='text'
                  name='lastName'
                  className='form-control'
                  placeholder='Enter last name'
                />
                <ErrorMessage component={Toast} name='lastName' />
              </div>
            </Col>
          </Row>
          <div className='form-group'>
            <label>Address 1 *</label>
            <Field
              type='text'
              name='address1'
              className='form-control'
              placeholder='Enter address'
            />
            <ErrorMessage component={Toast} name='address1' />
          </div>
          <div className='form-group'>
            <label>Address 2</label>
            <Field
              type='text'
              name='address2'
              className='form-control'
              placeholder='Enter address'
            />
            <ErrorMessage component={Toast} name='address2' />
          </div>
          <Row>
            <Col>
              <div className='form-group'>
                <label>Country *</label>
                <Field
                  type='text'
                  name='country'
                  className='form-control'
                  placeholder='Enter country'
                />
                <ErrorMessage component={Toast} name='country' />
              </div>
            </Col>
            <Col>
              <div className='form-group'>
                <label>State *</label>
                <Field as='select' name='state' className='form-control'>
                  <option value='' disabled selected>
                    Choose City
                  </option>
                  <option value='Cairo'>Cairo</option>
                  <option value='Alexandria'>Alexandria</option>
                </Field>
                <ErrorMessage component={Toast} name='state' />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className='form-group'>
                <label>City *</label>
                <Field
                  type='text'
                  name='city'
                  className='form-control'
                  placeholder='Enter City'
                />
                <ErrorMessage component={Toast} name='city' />
              </div>
            </Col>
            <Col>
              <div className='form-group'>
                <label>Street *</label>
                <Field
                  type='text'
                  name='street'
                  className='form-control'
                  placeholder='Enter Street'
                />
                <ErrorMessage component={Toast} name='street' />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className='form-group'>
                <label>Building</label>
                <Field
                  type='text'
                  name='building'
                  className='form-control'
                  placeholder='Enter building'
                />
                <ErrorMessage component={Toast} name='building' />
              </div>
            </Col>
            <Col>
              <div className='form-group'>
                <label>Floor</label>
                <Field
                  type='text'
                  name='floor'
                  className='form-control'
                  placeholder='Enter floor'
                />
                <ErrorMessage component={Toast} name='floor' />
              </div>
            </Col>
            <Col>
              <div className='form-group'>
                <label>Apartment</label>
                <Field
                  type='text'
                  name='apartment'
                  className='form-control'
                  placeholder='Enter apartment'
                />
                <ErrorMessage component={Toast} name='apartment' />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className='form-group'>
                <label>Phone Number *</label>
                <Field
                  type='text'
                  name='phoneNumber'
                  className='form-control'
                  placeholder='Enter Phone Number'
                />
                <ErrorMessage component={Toast} name='phoneNumber' />
              </div>
            </Col>
            <Col>
              <div className='form-group'>
                <label>Postal Code *</label>
                <Field
                  type='text'
                  name='postalCode'
                  className='form-control'
                  placeholder='Enter Postal Code'
                />
                <ErrorMessage component={Toast} name='postalCode' />
              </div>
            </Col>
          </Row>
          <Button variant='primary' type='submit'>
            ADD{" "}
          </Button>{" "}
        </Form>
      </Formik>
    </Container>
  );
}

export default AddAddressForm;
