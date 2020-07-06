import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AddCategoryForm from "./AddCategoryForm";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Page404 from "./../404";

function Dashboard() {
  const { user, loading, auth } = useSelector(state => state.userrr);

  if (!user && !loading) {
    return <Page404 />;
  } else {
    return (
      <div>
        <Container>
          <Row>
            {auth.isAdmin && (
              <Col>
                <h1>Categories</h1> <br />
                <AddCategoryForm />
                <Link className='btn btn-success mt-2' to='/editCategories'>
                  {" "}
                  Edit Categories
                </Link>
              </Col>
            )}
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
            <Col>
              <h1>Seller</h1> <br />
              <Link to='/dashboard/orders_to_deliver'>
                <Button variant='primary'>Products for delivery</Button>
                <br />
              </Link>
              <Link className='btn btn-success mt-2' to='/dashboard/delivered_orders'>
                {" "}
                Delivered Orders
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
