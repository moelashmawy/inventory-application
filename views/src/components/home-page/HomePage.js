import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/actions/product-actions/fetchProductsAction";
import { addToCart } from "../../redux/actions/cart-actions/addToCart";
import { toast, Slide } from "react-toastify";
import Slider from "../Slider";
import ProductsCarousel from "./ProductsCarousel";
import DealsOfTheDay from "./DealsOfTheDay";
import ExploreMore from "./ExploreMore";

function HomePage() {
  const { products, loading, error } = useSelector(state => state.productsss);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const addItemToCart = itemId => {
    dispatch(addToCart(itemId))
      .then(res => {
        toast.success(res, {
          position: toast.POSITION.BOTTOM_LEFT,
          transition: Slide
        });
      })
      .catch(err => {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: false
        });
      });
  };

  return (
    <Container fluid>
      <Slider />
      <ProductsCarousel title='Popular Products' productsNumber='4' />
      <ProductsCarousel title='Featured Products' productsNumber='4' />
      <DealsOfTheDay productsNumber='3' />
      <ExploreMore />
    </Container>
  );
}

export default HomePage;
