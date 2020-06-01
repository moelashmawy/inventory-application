import React, { useEffect } from 'react';
import { Container, Table, Spinner, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/actions/fetchProductsAction';
import { deleteProduct } from '../redux/actions/deleteProductAction';
import EditProductForm from './EditProductForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function EditProducts() {
    const { products, loading, error } = useSelector(state => state.productsss);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    console.log(products);

    return (
        <Container>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>category</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {loading &&
                        <tr>
                            <td colSpan="4"><Spinner animation="border" />  loading... </td>
                        </tr>
                    }
                    {error &&
                        <tr>
                            <td colSpan="4">{error}</td>
                        </tr>
                    }
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>
                                <span className='btn btn-primary mr-3'>
                                    <EditProductForm
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
                                    onClick={() => dispatch(deleteProduct(product._id))}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default EditProducts;