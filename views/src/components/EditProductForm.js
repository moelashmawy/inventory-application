import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../redux/actions/fetchCategoriesAction';
import { updateProduct } from '../redux/actions/updateProductAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';


function EditProductForm(props) {
    //handle modal show and hide
    const [show, setShow] = useState(false);

    //save the state of every input
    const [state, setState] = useState({
        name: props.name,
        description: props.description,
        category: props.category,
        price: props.price,
        numberInStock: props.numberInStock,
        productImage: props.productImage
    });

    // importing categories and laoding state from out store
    const { categories, loading } = useSelector(state => state.categoriesss)

    // handle modal show and close
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // react redux method to dispatch our functions
    const dispatch = useDispatch();

    // fetch all the the categories with dispatch before our component render
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch])

    // handle every input change
    const handleChange = e => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // handle submit our form
    const handleSubmit = e => {
        e.preventDefault();

        const newProduct = {
            name: state.name,
            description: state.description,
            category: state.category,
            price: state.price,
            numberInStock: state.numberInStock,
            productImage: state.productImage
        }

        dispatch(updateProduct(props.id, newProduct));

        handleClose();
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form action={`/api/product/${props.id}/update`} method="post" enctype="multipart/form-data">
                        <input
                            className="form-control mb-2"
                            type='text'
                            placeholder="Enter Product name"
                            name='name'
                            onChange={handleChange}
                            value={state.name}
                        />

                        <input
                            className="form-control mb-2"
                            type='text' placeholder="Enter Product description"
                            name='description'
                            onChange={handleChange}
                            value={state.description}
                        />

                        <select className="custom-select mb-2" onChange={handleChange} name='category' value={state.category}>
                            {loading && <option>loading...</option>}
                            {
                                categories.map(cat => {
                                    return (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    )
                                })
                            }
                        </select>

                        <input
                            className="form-control mb-2"
                            type='text'
                            placeholder="Enter Product price"
                            name='price'
                            onChange={handleChange}
                            value={state.price}
                        />

                        <input
                            className="form-control mb-2"
                            type='text'
                            placeholder="Enter Product numberInStock"
                            name='numberInStock'
                            onChange={handleChange}
                            value={state.numberInStock}
                        />

                        <input
                            className="custom custom-file mb-2"
                            type='file'
                            name='productImage'
                            onChange={handleChange}
                        />

                        <input
                            className='btn btn-primary mb-2'
                            type='submit'
                            onSubmit={handleSubmit}
                            value='Edit'
                        />

                        <input
                            className='btn btn-danger mb-2'
                            type='submit'
                            onClick={handleClose}
                            value='Close'
                        />

                    </form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditProductForm;