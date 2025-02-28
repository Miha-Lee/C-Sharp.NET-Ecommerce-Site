import React, { useMemo, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "../utils/Product";
import { symbolPrevent } from "../utils/symbolPrevent";
import { brands } from "../utils/Brand";
import { Col, Row } from "antd";
import { formatter } from "../utils/PriceFormatter";
import { AppContext } from "../context/AppContext";

const SingleProduct = () => {
  const { id } = useParams();
  const { cart, setCart, openNotification } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return products.find((p) => p.id === parseInt(id));
  }, [id]);

  return (
    <section className="single-product-container">
      <div className="single-product-inner-container">
        <div className="single-product-grid">
          <div className="single-product-title">
            <h1 className="single-product-text">{product.title}</h1>
          </div>
          <Row style={{ paddingLeft: 30, width: "100%", marginTop: 30 }}>
            <Col
              xs={24}
              lg={15}
              style={{ padding: 30, backgroundColor: "#fff" }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="single-product-image"
              />
            </Col>
            <Col xs={24} lg={9} className="single-product-add-cart">
              <div className="single-product-add-card-body">
                <div>
                  <span style={{ touchAction: "manipulation" }}>
                    <img
                      src={brands[product.brand]}
                      alt={product.brand}
                      className="single-product-add-brand"
                    />
                  </span>
                </div>
                <div className="single-product-add-price">
                  <div className="single-product-add-padding">
                    <div className="single-product-add-stack">
                      <div className="single-product-add-first-column">
                        <div className="single-product-add-stack-price">
                          {formatter.format(product.price)}
                        </div>
                      </div>
                      <div className="single-product-add-second-column">
                        <div className="single-product-add-second-grid">
                          <div className="single-product-add-second-first">
                            <span
                              className="single-product-add-second-decrement"
                              onClick={() => {
                                if (quantity >= 2) {
                                  setQuantity(quantity - 1);
                                }
                              }}
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                className="single-product-add-second-increment-svg"
                              >
                                {" "}
                                <rect height="1" width="18" y="9" x="1"></rect>
                              </svg>
                            </span>
                            <input
                              className="single-product-add-second-number"
                              type="number"
                              min="1"
                              step="1"
                              onKeyDown={(e) => {
                                if (symbolPrevent.includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onPaste={(e) => {
                                if (
                                  symbolPrevent.includes(
                                    e.clipboardData.getData("Text")
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              value={quantity}
                              onChange={(e) => {
                                const value = isNaN(parseInt(e.target.value))
                                  ? 1
                                  : parseInt(e.target.value);
                                setQuantity(value);
                              }}
                            />
                            <span
                              className="single-product-add-second-increment"
                              onClick={() => {
                                setQuantity(quantity + 1);
                              }}
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                className="single-product-add-second-decrement-svg"
                              >
                                {" "}
                                <rect
                                  x="9"
                                  y="1"
                                  width="1"
                                  height="17"
                                ></rect>{" "}
                                <rect x="1" y="9" width="17" height="1"></rect>
                              </svg>
                            </span>
                          </div>
                          <div style={{ paddingLeft: 15 }}>
                            <button
                              className="single-product-add-second-to-cart"
                              onClick={() => {
                                const cartId = parseInt(id);

                                if (cart.find((c) => c.id === cartId)) {
                                  const cartMapping = cart.map((c) => {
                                    if (c.id === cartId) {
                                      const newQuantity = c.quantity + quantity;

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
                                      id: cartId,
                                      title: product.title,
                                      image: product.image,
                                      unit_price: product.price,
                                      quantity,
                                      sum: product.price * quantity,
                                      category: product.category,
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
                              add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="single-product-delivery">
                  <div className="single-product-delivery-padding">
                    <div className="single-product-delivery-grid">
                      <div className="single-product-delivery-first-column">
                        <div className="single-product-delivery-first-grid">
                          <span className="single-product-delivery-span">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              className="single-product-delivery-svg"
                            >
                              {" "}
                              <circle cx="7.3" cy="17.3" r="1.4"></circle>{" "}
                              <circle cx="13.3" cy="17.3" r="1.4"></circle>{" "}
                              <polyline
                                fill="none"
                                stroke="#666"
                                points="0 2 3.2 4 5.3 12.5 16 12.5 18 6.5 8 6.5"
                              ></polyline>
                            </svg>
                          </span>
                          <div style={{ paddingLeft: 0, margin: 0 }}>
                            <div style={{ fontWeight: 500, color: "#666" }}>
                              Delivery
                            </div>
                            <div className="single-product-delivery-words">
                              In stock, free, tomorrow
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="single-product-delivery-second-column">
                        <div className="single-product-delivery-first-grid">
                          <span className="single-product-delivery-span">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              className="single-product-delivery-svg"
                            >
                              {" "}
                              <path
                                fill="none"
                                stroke="#666"
                                strokeWidth="1.01"
                                d="M10,0.5 C6.41,0.5 3.5,3.39 3.5,6.98 C3.5,11.83 10,19 10,19 C10,19 16.5,11.83 16.5,6.98 C16.5,3.39 13.59,0.5 10,0.5 L10,0.5 Z"
                              ></path>{" "}
                              <circle
                                fill="none"
                                stroke="#666"
                                cx="10"
                                cy="6.8"
                                r="2.3"
                              ></circle>
                            </svg>
                          </span>
                          <div style={{ paddingLeft: 0, margin: 0 }}>
                            <div style={{ fontWeight: 500, color: "#666" }}>
                              Pick up from store
                            </div>
                            <div className="single-product-delivery-words">
                              In stock, free, tomorrow
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
