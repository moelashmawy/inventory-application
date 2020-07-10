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
                <h1>Admin</h1> <br />
                <AddCategoryForm />
                <Link className='btn btn-success mt-2' to='/editCategories'>
                  Edit Categories
                </Link>
                <br />
                <Link className='btn btn-success mt-2' to='/permissions'>
                  Users permissions
                </Link>
                <br />
                <Link
                  className='btn btn-success mt-2'
                  to='/dashboard/admin/admins_permissions'>
                  All Admins
                </Link>
                <br />
                <Link
                  className='btn btn-success mt-2'
                  to='/dashboard/admin/shippers_permissions'>
                  All Shippers
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
                <Button variant='primary'>Products to ship</Button>
                <br />
              </Link>
              <Link className='btn btn-success mt-2' to='/dashboard/delivered_orders'>
                {" "}
                Shipped Orders
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
