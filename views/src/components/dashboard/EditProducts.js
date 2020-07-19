import React, { useEffect, useState } from "react";
import { Container, Table, Button, Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProducts } from "../../redux/actions/product-actions/fetchUserProductsAction";
import { deleteProduct } from "../../redux/actions/product-actions/deleteProductAction";
import UpdateProductForm from "./EditProductForm";
import { toast } from "react-toastify";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSpinner from "./DashboardSpinner";
import MainPagination from "./../MainPagination";

function EditProducts(props) {
  const { loading, products, pagesCount } = useSelector(state => state.userProductsss);

  let [perPageP, setPerPageP] = useState(5);

  const dispatch = useDispatch();

  // get the page number from the url
  const query = new URLSearchParams(props.location.search);
  const page = parseInt(query.get("page") || "1", 10);

  // will let the user decide how many products to show per page
  let perPage = perPageP || 5;

  useEffect(() => {
    dispatch(fetchUserProducts(page, perPage));
  }, [dispatch, page, perPage]);

  // this function will delete the item and trigger a message after it's done
  const deleteIt = id => {
    dispatch(deleteProduct(id))
      .then(res => {
        toast.success(res, { position: toast.POSITION.BOTTOM_LEFT });
      })
      .catch(error => {
        toast.error(error, {
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
          <Row>
            <Col>
              <h1 className='dashboard-headline'>Edit Products</h1>
            </Col>
            <Col className='per-page'>
              <span>Per page</span>
              <select
                className='custom-select'
                onChange={e => setPerPageP(e.target.value)}>
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='15'>15</option>
              </select>
            </Col>
          </Row>

          {loading && <DashboardSpinner />}
          {!loading && (
            <Table striped bordered hover variant='dark'>
              <thead>
                <tr>
                  <th>category</th>
                  <th>Price</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>
                      <UpdateProductForm
                        id={product._id}
                        name={product.name}
                        description={product.description}
                        category={product.category}
                        price={product.price}
                        numberInStock={product.numberInStock}
                        productImage={product.productImage}
                      />
                      <Button
                        variant='danger'
                        className='ml-3 '
                        onClick={() => deleteIt(product._id)}>
                        <i class='fa fa-trash' aria-hidden='true' title='Delete'></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {!loading && <MainPagination path='/editProducts' pagesCount={pagesCount} />}
        </Col>
      </Row>
    </Container>
  );
}

export default EditProducts;
