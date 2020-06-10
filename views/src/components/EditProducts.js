import React, { useEffect } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/actions/fetchProductsAction";
import { deleteProduct } from "../redux/actions/deleteProductAction";
import UpdateProductForm from "./UpdateProductForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function EditProducts() {
    const { products, loading } = useSelector(state => state.productsss);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const deleteIt = id => {
        dispatch(deleteProduct(id))
            .then(res => {
                toast.success(res, { position: toast.POSITION.BOTTOM_LEFT });
            })
            .catch(error => {
                toast.success(error, {
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
                        <th>Price</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan='4'>
                                <Spinner animation='border' /> loading...{" "}
                            </td>
                        </tr>
                    )}

                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>
                                <span className='btn btn-primary mr-3'>
                                    <UpdateProductForm
                                        id={product._id}
                                        name={product.name}
                                        description={product.description}
                                        category={product.category}
                                        price={product.price}
                                        numberInStock={product.numberInStock}
                                        productImage={product.productImage}
                                    />
                                </span>
                                <Button
                                    className='btn btn-danger'
                                    onClick={() => deleteIt(product._id)}>
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

export default EditProducts;
