import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatter } from "../utils/PriceFormatter";
import { AppContext } from "../context/AppContext";
import { symbolPrevent } from "../utils/symbolPrevent";

const Cart = () => {
  const { cart, setCart } = useContext(AppContext);

  const total = useMemo(() => {
    return cart.reduce((prev, curr) => prev + curr.sum, 0);
  }, [cart]);

  return (
    <section className="cart-section">
      <div className="cart-container">
        <div className="cart-stack-grid">
          <div className="cart-text-center">
            <h1 className="cart-text">Cart</h1>
          </div>
          {cart.length === 0 ? (
            <h1
              style={{ textAlign: "center", fontSize: "2rem", width: "100%" }}
            >
              There are no items in the cart, please add items to the cart
            </h1>
          ) : (
            <div className="cart-grid-margin">
              <div className="cart-grid-medium">
                <div className="cart-first-column">
                  <div className="cart-first-column-card">
                    <header className="cart-first-column-card-header">
                      <div className="cart-first-column-card-header-grid">
                        <div className="cart-header-column">product</div>
                        <div className="cart-header-column">
                          <div className="cart-header-second">
                            <div className="cart-header-second-columns">
                              price
                            </div>
                            <div className="cart-header-second-columns">
                              quantity
                            </div>
                            <div className="cart-header-second-columns">
                              sum
                            </div>
                            <div className="cart-width-auto">
                              <div style={{ width: 20, marginBottom: 0 }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                    {cart.map((c) => (
                      <div key={c.id} className="cart-item">
                        <div className="cart-item-grid">
                          <div className="cart-item-product-cell">
                            <div className="cart-item-product-cell-grid">
                              <div className="cart-item-product-image">
                                <div className="cart-item-product-image-wrapper">
                                  <Link
                                    to={`/products/${c.id}`}
                                    className="cart-item-product-image-link"
                                  >
                                    <figure className="cart-item-product-image-figure">
                                      <img
                                        src={c.image}
                                        alt={c.title}
                                        className="cart-item-product-image-img"
                                      />
                                    </figure>
                                  </Link>
                                </div>
                              </div>
                              <div className="cart-item-product-title">
                                <div
                                  style={{
                                    fontSize: ".875rem",
                                    lineHeight: 1.4,
                                    color: "#999",
                                  }}
                                >
                                  {c.categoty}
                                </div>
                                <Link
                                  to={`/products/${c.id}`}
                                  className="cart-item-product-title-link"
                                >
                                  {c.title}
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="cart-item-product-cell cart-item-product-cell-top">
                            <div className="cart-item-product-prices">
                              <div className="cart-item-product-first">
                                <div className="cart-item-product-responsive">
                                  Price
                                </div>
                                <div style={{ marginBottom: 0 }}>
                                  {formatter.format(c.unit_price)}
                                </div>
                              </div>
                              <div className="cart-item-product-second">
                                <span
                                  className="cart-item-product-decrement"
                                  onClick={() => {
                                    if (c.quantity >= 2) {
                                      const cartMapping = cart.map((cart) => {
                                        if (cart.id === c.id) {
                                          return {
                                            ...cart,
                                            quantity: c.quantity - 1,
                                            sum:
                                              (c.quantity - 1) *
                                              cart.unit_price,
                                          };
                                        } else {
                                          return {
                                            ...cart,
                                          };
                                        }
                                      });

                                      setCart(cartMapping);
                                    }
                                  }}
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      overflow: "hidden",
                                      transform: "translate(0,0)",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <rect
                                      height="1"
                                      width="18"
                                      y="9"
                                      x="1"
                                    ></rect>
                                  </svg>
                                </span>
                                <input
                                  className="cart-item-product-input"
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
                                  value={c.quantity}
                                  onChange={(e) => {
                                    const value = isNaN(
                                      parseInt(e.target.value)
                                    )
                                      ? 1
                                      : parseInt(e.target.value);

                                    const cartMapping = cart.map((cart) => {
                                      if (cart.id === c.id) {
                                        return {
                                          ...cart,
                                          quantity: value,
                                          sum: value * cart.unit_price,
                                        };
                                      } else {
                                        return { ...cart };
                                      }
                                    });

                                    setCart(cartMapping);
                                  }}
                                />
                                <span
                                  className="cart-item-product-increment"
                                  onClick={() => {
                                    const cartMapping = cart.map((cart) => {
                                      if (cart.id === c.id) {
                                        return {
                                          ...cart,
                                          quantity: c.quantity + 1,
                                          sum:
                                            (c.quantity + 1) * cart.unit_price,
                                        };
                                      } else {
                                        return {
                                          ...cart,
                                        };
                                      }
                                    });

                                    setCart(cartMapping);
                                  }}
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      overflow: "hidden",
                                      transform: "translate(0,0)",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <rect
                                      x="9"
                                      y="1"
                                      width="1"
                                      height="17"
                                    ></rect>{" "}
                                    <rect
                                      x="1"
                                      y="9"
                                      width="17"
                                      height="1"
                                    ></rect>
                                  </svg>
                                </span>
                              </div>
                              <div className="cart-item-product-third">
                                <div className="cart-item-product-responsive">
                                  Sum
                                </div>
                                <div style={{ marginBottom: 0 }}>
                                  {formatter.format(c.sum)}
                                </div>
                              </div>
                              <div className="cart-item-product-delete">
                                <span
                                  className="cart-item-product-danger"
                                  onClick={() => {
                                    const cartFilter = cart.filter(
                                      (cart) => cart.id !== c.id
                                    );

                                    setCart(cartFilter);
                                  }}
                                >
                                  <span className="cart-item-danger-icon">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{
                                        overflow: "hidden",
                                        transform: "translate(0,0)",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      {" "}
                                      <path
                                        fill="none"
                                        stroke="#f0506e"
                                        strokeWidth="1.06"
                                        d="M16,16 L4,4"
                                      ></path>{" "}
                                      <path
                                        fill="none"
                                        stroke="#f0506e"
                                        strokeWidth="1.06"
                                        d="M16,4 L4,16"
                                      ></path>
                                    </svg>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="cart-second-column">
                  <div className="cart-second-card">
                    <div className="cart-second-card-body">
                      <div className="cart-second-card-grid">
                        <div className="cart-second-card-total">Total</div>
                        <div className="cart-second-card-total-price">
                          {formatter.format(total)}
                        </div>
                      </div>
                      <Link to="/checkout" className="cart-checkout-button">
                        checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cart;
