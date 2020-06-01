import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { addCategory } from '../redux/actions/addCategoryAction'
import { useDispatch } from 'react-redux';

function AddCategoryForm() {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    const onNameChange = (e) => {
        setName(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        const newCategory = {
            name,
            description
        }
        dispatch(addCategory(newCategory));
        handleClose();
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Add Category
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} method='post' action='/api/category/create'>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control onChange={onNameChange} type="text" placeholder="Enter category name" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Description</Form.Label>
                            <Form.Control onChange={onDescriptionChange} type="text" placeholder="Enter category description" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddCategoryForm;