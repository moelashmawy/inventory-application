import React, { useState } from "react";
import { Button, Modal, Toast } from "react-bootstrap";
import { Form, ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { editShipperInfo } from "../../redux/actions/shippers-actions/editShipperInfo";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//validate our form inputs and handle the errors using YUP
const validationSchema = () =>
  Yup.object({
    company: Yup.string()
      .min(1, "Please enter a name more than 1 character")
      .required("This field is required"),
    area: Yup.string()
      .min(1, "Must be more than 1 characters")
      .required("This field is requried"),
    phone: Yup.number()
      .min(10, "Must be more than 10 characters")
      .required("This field is requried")
  });

function EditShipperForm(props) {
  const [show, setShow] = useState(false);

  // dispatch our redux action
  const dispatch = useDispatch();

  //handle modal show and close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /**
   * This method to handle our whole update process
   * it takes the targeted category id and the category object
   */
  const handleEditShipperInfo = shipper => {
    //this promise was returned to handle sucess and error messages
    dispatch(editShipperInfo(shipper))
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

  return (
    <div>
      <Button className='btn' variant='primary' onClick={handleShow}>
        <FontAwesomeIcon icon={faEdit} />{" "}
      </Button>
      <Modal show={show} onHide={handleClose} className='edit-modal'>
        <Modal.Header closeButton>
          <Modal.Title> Add New Category </Modal.Title>{" "}
        </Modal.Header>{" "}
        <Modal.Body>
          <Formik
            initialValues={{
              company: props.shipper.company,
              area: props.shipper.area,
              phone: props.shipper.phone
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const newShipper = {
                shipperId: props.shipper._id,
                company: values.company,
                area: values.area,
                phone: values.phone
              };

              handleEditShipperInfo(newShipper);

              setSubmitting(false);
            }}>
            <Form method='put'>
              <div className='form-group'>
                <label htmlFor='name'>Company</label>
                <Field type='text' name='company' className='form-control' />
                <ErrorMessage component={Toast} name='company' />
              </div>
              <div className='form-group'>
                <label htmlFor='name'>Area</label>
                <Field as='select' name='area' className='form-control'>
                  <option value='' disabled selected>
                    Choose City
                  </option>
                  <option value='Cairo'>Cairo</option>
                  <option value='Alexandria'>Alexandria</option>
                </Field>
                <ErrorMessage component={Toast} name='area' />
              </div>
              <div className='form-group'>
                <label htmlFor='name'>Phone</label>
                <Field type='text' name='phone' className='form-control' />
                <ErrorMessage component={Toast} name='phone' />
              </div>
              <Button variant='primary' type='submit'>
                Submit{" "}
              </Button>{" "}
              <Button variant='secondary' onClick={handleClose}>
                Close{" "}
              </Button>{" "}
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EditShipperForm;
