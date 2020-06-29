import React, { useEffect } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/actions/category-actions/fetchCategoriesAction";
import { deleteCategory } from "../../redux/actions/category-actions/deleteCategoryAction";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast, Slide } from "react-toastify";
import UpdateCategoryForm from "./EditCategoryForm";

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
    <Container>
      <Table striped bordered hover variant='dark'>
        <thead>
          <tr>
            <th>category</th>
            <th>Description</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan='3'>
                <Spinner animation='border' /> loading...{" "}
              </td>
            </tr>
          )}
          {categories.map(category => (
            <tr key={category._id}>
              <td>
                <Link to={`/category/${category._id}`}>{category.name}</Link>
              </td>
              <td>{category.description}</td>
              <td>
                <span className='btn btn-primary mr-3'>
                  <UpdateCategoryForm
                    categoryId={category._id}
                    categoryName={category.name}
                    categoryDescription={category.description}
                  />
                </span>
                <Button
                  className='btn btn-danger'
                  onClick={() => handleDelete(category._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default EditCategories;
