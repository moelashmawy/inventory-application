import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { updateCategory } from '../redux/actions/updateCategoryAction';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

function EditCategoryForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState(props.categoryName);
    const [description, setDescription] = useState(props.categoryDescription);

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
        dispatch(updateCategory(props.categoryId, newCategory));
        handleClose();
    }

    return (
        <div>
            <Button className='btn' variant="primary" onClick={handleShow}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} method='post'>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                onChange={onNameChange}
                                type="text"
                                placeholder="Enter category name"
                                value={name}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                onChange={onDescriptionChange}
                                type="text"
                                placeholder="Enter category description"
                                value={description}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditCategoryForm;