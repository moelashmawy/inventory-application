import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import DashboardSidebar from "./DashboardSidebar";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Button, Container, Toast, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import { fetchCategories } from "../../redux/actions/category-actions/fetchCategoriesAction";
import { addProduct } from "../../redux/actions/product-actions/addProductAction";

// form validation useing Yup
const validate = () =>
  Yup.object({
    name: Yup.string()
      .min(2, "Must be more then one character")
      .required("This field is required"),
    description: Yup.string()
      .min(10, "Must be more than 10 characters")
      .required("This field is required"),
    category: Yup.string().required("This field is required"),
    price: Yup.number()
      .positive("Must be more than 0")
      .integer("Must be more than 0")
      .required("This field is required"),
    numberInStock: Yup.number()
      .positive("Must be more than 0")
      .integer("Must be more than 0")
      .required("This field is required")
  });

function AddProductForm() {
  const [imgs, setImgs] = useState([]);

  // importing categories and laoding state from out store
  const { categories, loading } = useSelector(state => state.categoriesss);

  // react redux method to dispatch our functions
  const dispatch = useDispatch();

  // fetch all the the categories with dispatch before our component render
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // handle submit our form
  const handleSubmitt = product => {
    dispatch(addProduct(product))
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
          <h1 className='dashboard-headline'>Add product</h1>
          <Formik
            initialValues={{
              name: "",
              description: "",
              category: "",
              price: "",
              numberInStock: ""
            }}
            validationSchema={validate}
            onSubmit={(values, { setSubmitting }) => {
              const newProduct = {
                name: values.name,
                description: values.description,
                category: values.category,
                price: values.price,
                numberInStock: values.numberInStock,
                productImage: imgs
              };

              handleSubmitt(newProduct);

              setSubmitting(false);
            }}>
            <Form
              className='add-category-form'
              action='/api/product/create'
              method='post'
              encType='multipart/form-data'>
              <div className='form-group'>
                <Field
                  type='text'
                  name='name'
                  className='form-control'
                  placeholder='Enter product name'
                />
                <ErrorMessage component={Toast} name='name' />
              </div>
              <div className='form-group'>
                <Field
                  as='textarea'
                  name='description'
                  className='form-control'
                  placeholder='Enter product description'
                />
                <ErrorMessage component={Toast} name='description' />
              </div>
              <div className='form-group'>
                <Field as='select' name='category' className='form-control'>
                  {loading && <option>loading...</option>}
                  {!loading && (
                    <>
                      <option value='' disabled>
                        Choose product category
                      </option>
                      {categories.map(cat => {
                        return (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        );
                      })}
                    </>
                  )}
                </Field>
                <ErrorMessage component={Toast} name='category' />
              </div>
              <div className='form-group'>
                <Field
                  type='text'
                  name='price'
                  className='form-control'
                  placeholder='Enter product price'
                />
                <ErrorMessage component={Toast} name='price' />
              </div>
              <div className='form-group'>
                <Field
                  type='text'
                  name='numberInStock'
                  className='form-control'
                  placeholder='Enter product numberInStock'
                />
                <ErrorMessage component={Toast} name='numberInStock' />
              </div>
              <input
                required
                multiple
                className='custom custom-file mb-2'
                type='file'
                name='productImage'
                onChange={e => {
                  console.log(e.target.files);

                  setImgs(e.target.files);
                }}
              />
              <Button variant='secondary' type='submit'>
                ADD{" "}
              </Button>{" "}
            </Form>
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}

export default AddProductForm;
