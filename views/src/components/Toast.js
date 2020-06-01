import React, { useState } from 'react';
import { Button, Row, Col, Toast } from 'react-bootstrap';


function Toasta() {
    const [show, setShow] = useState(true);

    return (
        <Row>
            <Col xs={6}>
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded mr-2"
                            alt=""
                        />
                        <strong className="mr-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>Added Succefully</Toast.Body>
                </Toast>
            </Col>

        </Row>
    );
}

export default Toasta;