import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, useFormik } from "formik";
import { Button, Toast, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import { fetchCategories } from "../redux/actions/fetchCategoriesAction";
import { addProduct } from "../redux/actions/addProductAction";

// form validation using yup
const validate = Yup.object({
    name: Yup.string()
        .required("This field is required")
        .min(2, "Must be more then 2 characters"),
    description: Yup.string()
        .required("This field is required")
        .min(10, "Must be more then 10 characters"),
    category: Yup.string().required("This field is required"),
    price: Yup.number()
        .required("This field is required")
        .positive("Please enter Positive number")
        .integer("Please enter number more than 0"),
    numberInStock: Yup.number()
        .required("This field is required")
        .positive("Please enter Positive number")
        .integer("Please enter number more than 0")
});

// our main function component
function AddProductForm() {
    // importing categories and laoding state from out store
    const { categories, error, loading } = useSelector(
        state => state.categoriesss
    );

    // react redux method to dispatch our functions
    const dispatch = useDispatch();

    // fetch all the the categories with dispatch before our component render
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    //our form initial state
    const initialState = {
        name: "",
        description: "",
        category: "",
        price: "",
        numberInStock: "",
        productImage: ""
    };

    // handle submit our form
    const handleSubmit = function (values) {
        const newProduct = {
            name: values.name,
            description: values.description,
            category: values.category,
            price: values.price,
            numberInStock: values.numberInStock,
            productImage: values.productImage
        };

        dispatch(addProduct(newProduct))
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

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: validate,
        onSubmit: () => handleSubmit(initialState)
    });

    return (
        <Container>
            <form
                action='/api/product/create'
                method='post'
                encType='multipart/form-data'
                onSubmit={formik.handleSubmit}>
                <div className='form-group'>
                    <input
                        className='form-control mb-2'
                        type='text'
                        placeholder='Enter Product name'
                        name='name'
                        required
                        {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div>{formik.errors.name}</div>
                    ) : null}
                </div>
                <div className='form-group'>
                    <input
                        className='form-control mb-2'
                        as='textarea'
                        placeholder='Enter Product description'
                        name='description'
                        required
                        {...formik.getFieldProps("description")}
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <div>{formik.errors.description}</div>
                    ) : null}
                </div>
                <div className='form-group'>
                    <select
                        className='custom-select mb-2'
                        name='category'
                        required
                        {...formik.getFieldProps("category")}>
                        {loading && <option>loading...</option>}
                        {categories.map(cat => {
                            return (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            );
                        })}
                    </select>
                    {formik.touched.category && formik.errors.category ? (
                        <div>{formik.errors.category}</div>
                    ) : null}
                </div>
                <div className='form-group'>
                    <input
                        className='form-control mb-2'
                        type='text'
                        placeholder='Enter Product price'
                        name='price'
                        required
                        {...formik.getFieldProps("price")}
                    />
                    {formik.touched.price && formik.errors.price ? (
                        <div>{formik.errors.price}</div>
                    ) : null}
                </div>
                <div className='form-group'>
                    <input
                        className='form-control mb-2'
                        type='text'
                        placeholder='Enter Product numberInStock'
                        name='numberInStock'
                        required
                        {...formik.getFieldProps("numberInStock")}
                    />
                    {formik.touched.numberInStock &&
                    formik.errors.numberInStock ? (
                        <div>{formik.errors.numberInStock}</div>
                    ) : null}
                </div>
                <div className='form-group'>
                    <input
                        className='custom custom-file mb-2'
                        type='file'
                        name='productImage'
                        //required
                        {...formik.getFieldProps("productImage")}
                    />
                    {formik.touched.productImage &&
                    formik.errors.productImage ? (
                        <div>{formik.errors.productImage}</div>
                    ) : null}
                </div>
                <Button variant='primary' type='submit'>
                    Submit{" "}
                </Button>{" "}
            </form>
        </Container>
    );
}

export default AddProductForm;
