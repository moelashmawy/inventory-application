import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/actions/product-actions/fetchProductsAction";
import Slider from "./Slider";
import ProductsCarousel from "./ProductsCarousel";
import DealsOfTheDay from "./DealsOfTheDay";
import ExploreMore from "./ExploreMore";

function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
