import React, { useEffect } from "react";
import { Container, Table, Button, Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/actions/category-actions/fetchCategoriesAction";
import { deleteCategory } from "../../redux/actions/category-actions/deleteCategoryAction";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast, Slide } from "react-toastify";
import UpdateCategoryForm from "./EditCategoryForm";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";

function EditCategories() {
  const { categories, loading } = useSelector(state => state.categoriesss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = id => {
    dispatch(deleteCategory(id))
      .then(res => {
        toast.success(res.data.message, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
      })
      .catch(err => {
        toast.error(err.response.data.message, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  return (
    <Container fluid>
      <Row>
        <Col md='3'>
          <DashboardSidebar />
        </Col>
        <Col>
          <h1 className='dashboard-headline'>Edit Categories</h1>
          {loading && <DashboardSpinner />}
          {!loading && (
            <Table striped bordered hover variant='dark'>
              <thead>
                <tr>
                  <th>category</th>
                  <th>Description</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id}>
                    <td>
                      <Link to={`/category/${category._id}`}>{category.name}</Link>
                    </td>
                    <td>{category.description}</td>
                    <td>
                      <UpdateCategoryForm
                        categoryId={category._id}
                        categoryName={category.name}
                        categoryDescription={category.description}
                      />
                      <Button
                        variant='danger'
                        className='ml-3'
                        onClick={() => handleDelete(category._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EditCategories;
