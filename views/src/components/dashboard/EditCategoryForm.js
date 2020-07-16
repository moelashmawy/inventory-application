import React, { useState } from "react";
import { Button, Modal, Toast } from "react-bootstrap";
import { Form, ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { updateCategory } from "../../redux/actions/category-actions/updateCategoryAction";
import { useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//validate our form inputs and handle the errors using YUP
const validationSchema = () =>
  Yup.object({
    name: Yup.string()
      .min(1, "Please enter a name more than 1 character")
      .required("This field is required"),
    description: Yup.string()
      .min(10, "Must be more than 10 characters")
      .required("This field is requried")
  });

function EditCategoryForm(props) {
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
  const handleUpdateCategory = (id, category) => {
    //this promise was returned to handle sucess and error messages
    dispatch(updateCategory(id, category))
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
    <>
      <Button variant='secondary' onClick={handleShow}>
        <i class='fa fa-cog' aria-hidden='true'></i>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Edit Category </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: props.categoryName,
              description: props.categoryDescription
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const newCategory = {
                name: values.name,
                description: values.description
              };

              handleUpdateCategory(props.categoryId, newCategory);

              setSubmitting(false);
            }}>
            <Form action={`/api/product/${props.categoryId}/update`} method='put'>
              <div className='form-group'>
                <label htmlFor='name'>name</label>
                <Field type='text' name='name' className='form-control' />
                <ErrorMessage component={Toast} name='name' />
              </div>
              <div className='form-group'>
                <label htmlFor='description'>description</label>
                <Field as='textarea' name='description' className='form-control' />
                <ErrorMessage component={Toast} name='description' />
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
    </>
  );
}

export default EditCategoryForm;
