import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AddProductForm from './AddProductForm';
import AddCategoryForm from './AddCategoryForm';

function Dashboard() {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <h1>Categories</h1> <br />
                        <AddCategoryForm />
                        <a className='btn btn-success mt-2' href='/categories/edit'> Edit Categories</a>
                    </Col>
                    <Col>
                        <h1>Products</h1> <br />
                        <AddProductForm />
                        <a className='btn btn-success mt-2' href='/products/edit'> Edit Products</a>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;
