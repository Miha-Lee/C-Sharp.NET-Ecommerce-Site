import React, { useContext } from "react";
import { heroImages } from "../utils/HeroImages";
import { categoryImages } from "../utils/CategoryImages";
import { products } from "../utils/Product";
import { Carousel } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { formatter } from "../utils/PriceFormatter";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const navigation = useNavigate();
  const { filters, setFilters, cart, setCart, openNotification } =
    useContext(AppContext);

  return (
    <>
      <Carousel autoplay arrows>
        {heroImages.map((i, index) => (
          <div key={index}>
            <img alt={`Hero-${index}`} src={i} style={{ width: "100%" }} />
          </div>
        ))}
      </Carousel>
      <div className="category">
        <div className="category-container">
          <div className="category-grid">
            {categoryImages.map((ci, index) => (
              <div className="category-item" key={index}>
                <span
                  className="category-link"
                  onClick={() => {
                    navigation("/products");
                    setFilters({
                      ...filters,
                      types: [...filters.types, ci.value],
                      categoryLink: ci.value,
                    });
                  }}
                >
                  <div className="category-image">
                    <div className="category-media">
                      <figure className="category-wrap">
                        <img
                          src={ci.image}
                          alt={ci.title}
                          className="category-wrap-img"
                        />
                      </figure>
                    </div>
                  </div>
                  <div className="margin-small-top">
                    <div className="category-text">{ci.title}</div>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="product">
        <div className="product-container">
          <h2 className="product-title">Trending Items</h2>
          <div className="product-card">
            <div className="product-grid">
              {products.slice(0, 8).map((pi) => (
                <article key={pi.id} className="product-item">
                  <div className="product-media">
                    <div className="product-media-image-wrapper">
                      <Link
                        to={`/products/${pi.id}`}
                        className="product-media-image-link"
                      >
                        <figure className="product-media-image-figure">
                          <img
                            src={pi.image}
                            alt={pi.title}
                            className="product-media-image"
                          />
                        </figure>
                      </Link>
                    </div>
                  </div>
                  <div className="product-card-body">
                    <div>
                      <div className="product-category">{pi.category}</div>
                      <h3 className="product-card-title">
                        <Link
                          to={`/products/${pi.id}`}
                          className="product-card-title-link"
                        >
                          {pi.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="product-price-cart">
                      <div className="product-price">
                        <div className="product-p">
                          {formatter.format(pi.price)}
                        </div>
                      </div>
                      <div className="product-cart">
                        <button
                          className="product-c"
                          onClick={() => {
                            if (cart.find((c) => c.id === pi.id)) {
                              const cartMapping = cart.map((c) => {
                                if (c.id === pi.id) {
                                  const newQuantity = c.quantity + 1;

                                  return {
                                    ...c,
                                    quantity: newQuantity,
                                    sum: newQuantity * c.unit_price,
                                  };
                                } else {
                                  return { ...c };
                                }
                              });

                              setCart(cartMapping);
                            } else {
                              setCart([
                                ...cart,
                                {
                                  id: pi.id,
                                  title: pi.title,
                                  image: pi.image,
                                  unit_price: pi.price,
                                  quantity: 1,
                                  sum: pi.price * 1,
                                  category: pi.category,
                                },
                              ]);
                            }

                            openNotification(
                              "success",
                              "Success",
                              "Add to cart success"
                            );
                          }}
                        >
                          <span className="product-c-span">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              className="cart-svg"
                            >
                              {" "}
                              <circle cx="7.3" cy="17.3" r="1.4"></circle>{" "}
                              <circle cx="13.3" cy="17.3" r="1.4"></circle>{" "}
                              <polyline
                                fill="none"
                                stroke="#fff"
                                points="0 2 3.2 4 5.3 12.5 16 12.5 18 6.5 8 6.5"
                              ></polyline>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="shop-all-center">
            <Link className="shop-all-link" to="/products">
              <span style={{ verticalAlign: "middle" }}>shop all</span>
              <span className="shop-all-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shop-all-svg"
                >
                  {" "}
                  <polyline
                    fill="none"
                    stroke="#999"
                    strokeWidth="1.03"
                    points="7 4 13 10 7 16"
                  ></polyline>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
