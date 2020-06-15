import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, useFormik } from "formik";
import { Button, Toast, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import { fetchCategories } from "./../redux/actions/category-actions/fetchCategoriesAction";
import { addProduct } from "../redux/actions/product-actions/addProductAction";

function AddProductForm() {
  //const theImage = useRef(null);

  const [img, setImg] = useState("");

  const [state, setState] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    numberInStock: ""
    //productImage: ""
  });

  const handleImg = e => {
    console.log(e.target.files[0]);
    setImg(e.target.files[0]);
  };

  // importing categories and laoding state from out store
  const { categories, error, loading } = useSelector(state => state.categoriesss);

  const handleChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
    <Container>
      <form
        action='/api/product/create'
        method='post'
        enctype='multipart/form-data'
        onSubmit={e => {
          e.preventDefault();

          let newProduct = {
            name: state.name,
            description: state.description,
            category: state.category,
            price: state.price,
            numberInStock: state.numberInStock,
            productImage: img
          };

          handleSubmitt(newProduct);
        }}>
        <div className='form-group'>
          <input
            className='form-control mb-2'
            type='text'
            placeholder='Enter Product name'
            name='name'
            required
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control mb-2'
            as='textarea'
            placeholder='Enter Product description'
            name='description'
            required
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <select
            className='custom-select mb-2'
            name='category'
            required
            onChange={handleChange}>
            {loading && <option>loading...</option>}
            {categories.map(cat => {
              return (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className='form-group'>
          <input
            className='form-control mb-2'
            type='text'
            placeholder='Enter Product price'
            name='price'
            required
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control mb-2'
            type='text'
            placeholder='Enter Product numberInStock'
            name='numberInStock'
            required
            onChange={handleChange}
          />
        </div>
        <input
          className='custom custom-file mb-2'
          type='file'
          name='productImage'
          onChange={handleImg}
        />
        <Button variant='primary' type='submit'>
          Submit{" "}
        </Button>{" "}
      </form>
    </Container>
  );
}

export default AddProductForm;
