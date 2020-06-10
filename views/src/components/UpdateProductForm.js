import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form, useFormik } from "formik";
import { Button, Modal, Toast } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/actions/fetchCategoriesAction";
import { updateProduct } from "../redux/actions/updateProductAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast, Slide } from "react-toastify";

// form validation using yup
const validate = () =>
    Yup.object({
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

function UpdateProductForm(props) {
    //handle modal show and hide
    const [show, setShow] = useState(false);

    const [img, setImg] = useState("");

    const handleImg = e => {
        setImg(e.target.files[0]);
    };

    // importing categories and laoding state from out store
    const { categories, error, loading } = useSelector(
        state => state.categoriesss
    );

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
    const handleSubmit = values => {
        const newProduct = {
            name: values.name,
            description: values.description,
            category: values.category,
            price: values.price,
            numberInStock: values.numberInStock,
            productImage: img
        };

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

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: validate,
        onSubmit: handleSubmit
    });

    return (
        <div>
            <Button variant='primary' onClick={handleShow}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        action={`/api/product/${props.id}/update`}
                        method='post'
                        enctype='multipart/form-data'
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
                            {formik.touched.description &&
                            formik.errors.description ? (
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
                            {formik.touched.category &&
                            formik.errors.category ? (
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
                                required
                                onChange={handleImg}
                            />
                            {formik.touched.productImage &&
                            formik.errors.productImage ? (
                                <div>{formik.errors.productImage}</div>
                            ) : null}
                        </div>
                        <Button
                            variant='primary'
                            type='submit'
                            onClick={formik.handleSubmit}>
                            Submit{" "}
                        </Button>{" "}
                    </form>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </div>
    );
}

export default UpdateProductForm;
