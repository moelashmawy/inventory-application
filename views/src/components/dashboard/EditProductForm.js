import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Button, Container, Toast, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/actions/category-actions/fetchCategoriesAction";
import { updateProduct } from "../../redux/actions/product-actions/updateProductAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast, Slide } from "react-toastify";

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

function EditProductForm(props) {
  //handle modal show and hide
  const [show, setShow] = useState(false);

  const [img, setImg] = useState("");

  const handleImg = e => {
    setImg(e.target.files[0]);
  };

  // importing categories and laoding state from out store
  const { categories, loading } = useSelector(state => state.categoriesss);

  // handle modal show and close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // react redux method to dispatch our functions
  const dispatch = useDispatch();

  // fetch all the the categories with dispatch before our component render
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  //our form initial state
  const initialState = {
    name: props.name,
    description: props.description,
    category: props.category,
    price: props.price,
    numberInStock: props.numberInStock,
    productImage: ""
  };

  // handle submit our form
  const handleSubmit = newProduct => {
    dispatch(updateProduct(props.id, newProduct))
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
      })
      .catch(error => {
        toast.error(error, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  return (
    <Container>
      <Button variant='primary' onClick={handleShow}>
        <FontAwesomeIcon icon={faEdit} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialState}
            validationSchema={validate}
            onSubmit={(values, { setSubmitting }) => {
              const newProduct = {
                name: values.name,
                description: values.description,
                category: values.category,
                price: values.price,
                numberInStock: values.numberInStock,
                productImage: img
              };

              handleSubmit(newProduct);

              setSubmitting(false);
            }}>
            <Form
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
                className='custom custom-file mb-2'
                type='file'
                name='productImage'
                onChange={handleImg}
              />
              <Button variant='primary' type='submit'>
                Update{" "}
              </Button>{" "}
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default EditProductForm;
