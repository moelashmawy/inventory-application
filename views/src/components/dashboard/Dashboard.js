import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AddCategoryForm from "./AddCategoryForm";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1>Categories</h1> <br />
            <AddCategoryForm />
            <Link className='btn btn-success mt-2' to='/editCategories'>
              {" "}
              Edit Categories
            </Link>
          </Col>
          <Col>
            <h1>Products</h1> <br />
            <Link to='/addProduct'>
              <Button variant='primary'>Add Product</Button>
              <br />
            </Link>
            <Link className='btn btn-success mt-2' to='/editProducts'>
              {" "}
              Edit Products
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
