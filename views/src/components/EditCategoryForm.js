import React, { useState } from "react";
import { Button, Modal /* Form */, Toast } from "react-bootstrap";
import { Form, ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { updateCategory } from "../redux/actions/updateCategoryAction";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

//validate our form inputs and handle the errors using YUP
const validationSchema = () =>
  Yup.object({
    name: Yup.string()
      .min(1, "Please enter a name more than 1 character")
      .required("This field is required"),
    description: Yup.string()
      .min(10, "Must be more than 10 characters")
      .required("This field is requried"),
  });

function EditCategoryForm(props) {
  const [show, setShow] = useState(false);

  //handle modal show and close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // dispatch our redux action
  const dispatch = useDispatch();

  return (
    <div>
      <Button className="btn" variant="primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faEdit} />{" "}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Add New Category </Modal.Title>{" "}
        </Modal.Header>{" "}
        <Modal.Body>
          <Formik
            initialValues={{
              name: props.categoryName,
              description: props.categoryDescription,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const newCategory = {
                name: values.name,
                description: values.description,
              };
              dispatch(updateCategory(props.categoryId, newCategory));
              handleClose();
              setSubmitting(false);
            }}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="name">name</label>
                <Field type="text" name="name" className="form-control" />
                <ErrorMessage component={Toast} name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="description">description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="form-control"
                />
                <ErrorMessage component={Toast} name="description" />
              </div>
              <Button variant="primary" type="submit">
                Submit{" "}
              </Button>{" "}
              <Button variant="secondary" onClick={handleClose}>
                Close{" "}
              </Button>{" "}
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EditCategoryForm;
