import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Toast, Row, Col, Container } from "react-bootstrap";
import { addCategory } from "../../redux/actions/category-actions/addCategoryAction";
import { useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import DashboardSidebar from "./DashboardSidebar";

// form validation useing Yup
const validate = () =>
  Yup.object({
    name: Yup.string()
      .min(2, "Must be more then one character")
      .required("Category name is required"),
    description: Yup.string()
      .min(10, "Must be more than 10 characters")
      .required("This field is required")
  });

function AddCategoryForm() {
  // dispatch our redux action
  const dispatch = useDispatch();

  /**
   * This method to handle our whole adding process
   * it takes the new category object
   */
  const handleAdd = newCategory => {
    //this promise was returned to handle sucess and error messages
    dispatch(addCategory(newCategory))
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
    <Container fluid>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col>
          <h1 className='dashboard-headline'>Add Category</h1>
          <Formik
            initialValues={{
              name: "",
              description: ""
            }}
            validationSchema={validate}
            onSubmit={(values, { setSubmitting }) => {
              const newCategory = {
                name: values.name,
                description: values.description
              };

              handleAdd(newCategory);

              setSubmitting(false);
            }}>
            <Form className='add-category-form'>
              <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <Field
                  type='text'
                  name='name'
                  className='form-control'
                  placeholder='Enter Category name'
                />
                <ErrorMessage component={Toast} name='name' />
              </div>
              <div className='form-group'>
                <label htmlFor='description'>Description</label>
                <Field
                  as='textarea'
                  name='description'
                  className='form-control'
                  placeholder='Enter Category description'
                />
                <ErrorMessage component={Toast} name='description' />
              </div>
              <Button variant='secondary' type='submit'>
                Add
              </Button>
            </Form>
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}

export default AddCategoryForm;
