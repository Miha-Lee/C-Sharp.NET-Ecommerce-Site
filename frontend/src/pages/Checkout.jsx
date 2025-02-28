import React, { useState, useMemo, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import country from "country-list-js";
import { formatter } from "../utils/PriceFormatter";
import { AppContext } from "../context/AppContext";
import { Spin } from "antd";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const Checkout = () => {
  const navigation = useNavigate();
  const [delivery, setDelivery] = useState(1);
  const [checkoutInformation, setCheckoutInformation] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    street: "",
    house: "",
    building: "",
    entrance: "",
    floor: "",
    apartment: "",
    comment: "",
    country: "",
    city: "",
    post_code: "",
  });
  const [loading, setLoading] = useState(false);
  const { cart, token, setToken, openNotification } = useContext(AppContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const countryList = useMemo(() => {
    const countryNames = country.names();

    countryNames.sort();

    return countryNames;
  }, []);

  const deliveryMethods = [
    {
      id: 1,
      title: "Pick up from store",
      desc: "Free, tomorrow",
    },
    {
      id: 2,
      title: "Delivery in city",
      desc: "Free, tomorrow",
    },
    {
      id: 3,
      title: "Regional delivery",
      desc: "Postal courier services. Sending to any country",
    },
  ];

  const total = useMemo(() => {
    const totalValue = cart.reduce((prev, curr) => prev + curr.sum, 0);

    return formatter.format(totalValue);
  }, [cart]);

  const deliveryResult = useMemo(() => {
    return deliveryMethods.find((d) => d.id === delivery);
  }, [delivery]);

  useEffect(() => {
    setCheckoutInformation({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      street: "",
      house: "",
      building: "",
      entrance: "",
      floor: "",
      apartment: "",
      comment: "",
      country: "",
      city: "",
      post_code: "",
    });
  }, [delivery]);

  const onCheckout = () => {
    const {
      first_name,
      last_name,
      phone_number,
      email,
      street,
      house,
      building,
      entrance,
      floor,
      apartment,
      comment,
      country,
      city,
      post_code,
    } = checkoutInformation;

    if (cart.length === 0) {
      openNotification(
        "error",
        "Error",
        "To proceed with the payment, the cart should not be empty"
      );

      return;
    }

    if (!first_name || !last_name || !phone_number || !email) {
      openNotification(
        "error",
        "Error",
        "Please do not leave required fields blank"
      );

      return;
    }

    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      openNotification(
        "error",
        "Error",
        "Please input correct format for email"
      );

      return;
    }

    if (delivery === 2) {
      if (!street || !house) {
        openNotification(
          "error",
          "Error",
          "Please do not leave required fields blank"
        );

        return;
      }
    } else if (delivery === 3) {
      if (!country || !city || !post_code || !street || !house) {
        openNotification(
          "error",
          "Error",
          "Please do not leave required fields blank"
        );

        return;
      }
    }

    if (!token) {
      openNotification(
        "error",
        "Error",
        "To proceed with the payment, you have to login"
      );

      return;
    }

    setLoading(true);

    const cartResult = (stripe) => {
      return cart.map((c) => {
        return {
          id: c.id,
          quantity: c.quantity,
          title: c.title,
          unit_price: stripe ? Math.round(c.unit_price * 100) : c.unit_price,
        };
      });
    };

    stripePromise.then((stripe) => {
      fetch(`${apiUrl}/Order/OrderCheckout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_Name: first_name,
          last_Name: last_name,
          phone_Number: phone_number,
          email,
          street,
          house,
          building,
          entrance,
          floor,
          apartment,
          comment,
          country,
          post_Code: post_code,
          cart: cartResult(true),
          delivery,
          cartArr: cartResult(false),
          jsonStringArr: JSON.stringify(cartResult(false)),
        }),
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error("401 Unauthorized");
          }

          if (!response.ok) {
            throw Error(`HTTP error: ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          setLoading(false);

          if (data.success) {
            return stripe.redirectToCheckout({ sessionId: data.id });
          } else {
            if (data.user) {
              navigation("/");
              setToken(null);
              localStorage.removeItem("ecommerce-token");
              openNotification("error", "Error", data.message);
            } else {
              openNotification("error", "Error", data.message);
            }
          }
        })
        .then((result) => {
          if (result.error) {
            console.log(result.error.message);
          }
        })
        .catch((error) => {
          setLoading(false);

          if (error.message === "401 Unauthorized") {
            setToken(null);
            localStorage.removeItem("ecommerce-token");
            navigation("/");
            openNotification(
              "warning",
              "Token has expired",
              "Please Login again"
            );
          } else {
            openNotification("error", "Error", error.message);
          }

          console.log("Error message:", error.message);
        });
    });
  };

  return (
    <section className="checkout-section">
      <div className="checkout-container">
        <div className="checkout-grid">
          <section className="checkout-titles">
            <Link to="/cart" className="checkout-return-cart">
              <span className="checkout-return-cart-icon">
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
                  <polyline
                    fill="none"
                    stroke="#999"
                    points="10 14 5 9.5 10 5"
                  ></polyline>{" "}
                  <line
                    fill="none"
                    stroke="#999"
                    x1="16"
                    y1="9.5"
                    x2="5"
                    y2="9.52"
                  ></line>
                </svg>
              </span>
              Return to cart
            </Link>
            <h1 className="checkout-title">Checkout</h1>
          </section>
          <section className="checkout-forms">
            <div className="checkout-forms-grid">
              <form className="checkout-forms-contact">
                <div className="checkout-forms-contact-medium">
                  <section className="checkout-forms-contact-first">
                    <h2 className="checkout-form-contact-first-title">
                      Contact Information
                    </h2>
                    <div className="checkout-form-contact-first-card">
                      <div className="checkout-form-contact-first-card-grid">
                        <div className="checkout-form-contact-first-columns">
                          <label
                            style={{
                              marginBottom: 0,
                              touchAction: "manipulation",
                            }}
                          >
                            <div className="checkout-form-contact-first-label">
                              First Name
                            </div>
                            <input
                              type="text"
                              className="checkout-form-contact-first-input"
                              value={checkoutInformation.first_name}
                              onChange={(e) => {
                                setCheckoutInformation({
                                  ...checkoutInformation,
                                  first_name: e.target.value,
                                });
                              }}
                              disabled={loading}
                            />
                          </label>
                        </div>
                        <div className="checkout-form-contact-first-columns checkout-top">
                          <label
                            style={{
                              marginBottom: 0,
                              touchAction: "manipulation",
                            }}
                          >
                            <div className="checkout-form-contact-first-label">
                              Last Name
                            </div>
                            <input
                              type="text"
                              className="checkout-form-contact-first-input"
                              value={checkoutInformation.last_name}
                              onChange={(e) => {
                                setCheckoutInformation({
                                  ...checkoutInformation,
                                  last_name: e.target.value,
                                });
                              }}
                              disabled={loading}
                            />
                          </label>
                        </div>
                        <div
                          className="checkout-form-contact-first-columns"
                          style={{ marginTop: 15 }}
                        >
                          <label
                            style={{
                              marginBottom: 0,
                              touchAction: "manipulation",
                            }}
                          >
                            <div className="checkout-form-contact-first-label">
                              Phone Number
                            </div>
                            <input
                              type="text"
                              className="checkout-form-contact-first-input"
                              value={checkoutInformation.phone_number}
                              onChange={(e) => {
                                setCheckoutInformation({
                                  ...checkoutInformation,
                                  phone_number: e.target.value,
                                });
                              }}
                              disabled={loading}
                            />
                          </label>
                        </div>
                        <div
                          className="checkout-form-contact-first-columns"
                          style={{ marginTop: 15 }}
                        >
                          <label
                            style={{
                              marginBottom: 0,
                              touchAction: "manipulation",
                            }}
                          >
                            <div className="checkout-form-contact-first-label">
                              Email
                            </div>
                            <input
                              type="text"
                              className="checkout-form-contact-first-input"
                              value={checkoutInformation.email}
                              onChange={(e) => {
                                setCheckoutInformation({
                                  ...checkoutInformation,
                                  email: e.target.value,
                                });
                              }}
                              disabled={loading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="checkout-forms-contact-second">
                    <h2 className="checkout-forms-contact-second-title">
                      Shipping
                    </h2>
                    <div className="checkout-forms-contact-second-card">
                      <div className="checkout-forms-contact-second-toggle">
                        {deliveryMethods.map((d) => (
                          <div
                            key={d.id}
                            className="checkout-forms-contact-second-columns"
                          >
                            <span
                              className={
                                delivery === d.id
                                  ? "checkout-forms-contact-second-tags active"
                                  : "checkout-forms-contact-second-tags"
                              }
                              onClick={() => {
                                setDelivery(d.id);
                              }}
                            >
                              <div className="checkout-forms-contact-second-tags-title">
                                {d.title}
                              </div>
                              <div className="checkout-forms-contact-second-tags-desc">
                                {d.desc}
                              </div>
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="checkout-forms-contact-second-switcher">
                        <section
                          className={
                            delivery === 2
                              ? "checkout-forms-contact-second-sections active"
                              : "checkout-forms-contact-second-sections"
                          }
                        >
                          <div className="checkout-forms-contact-second-grid">
                            <div className="checkout-forms-contact-second-expand">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div">
                                  Street
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.street}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      street: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-1-3">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div">
                                  House
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.house}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      house: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                          </div>
                          <div
                            className="checkout-forms-contact-second-grid"
                            style={{
                              marginBottom: 0,
                              marginTop: 15,
                            }}
                          >
                            <div className="checkout-forms-contact-second-gird-columns">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Building
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.building}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      building: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-gird-columns">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Entrance
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.entrance}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      entrance: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-gird-columns">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Floor
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.floor}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      floor: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-gird-columns checkout-top">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Apartment
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.apartment}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      apartment: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-grid-column-expand">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Comment
                                </div>
                                <textarea
                                  className="checkout-forms-contact-second-label-textarea"
                                  rows="5"
                                  placeholder="Additional information: phone numbers or doorphone code"
                                  value={checkoutInformation.comment}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      comment: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                ></textarea>
                              </label>
                            </div>
                          </div>
                        </section>
                        <section
                          className={
                            delivery === 3
                              ? "checkout-forms-contact-second-sections active"
                              : "checkout-forms-contact-second-sections"
                          }
                        >
                          <div className="checkout-forms-contact-second-regional-grid">
                            <div className="checkout-forms-contact-second-regional-country">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div">
                                  Country
                                </div>
                                <select
                                  className="checkout-forms-contact-second-country"
                                  value={checkoutInformation.country}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      country: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                >
                                  <option className="checkout-forms-contact-second-country-color">
                                    Choose the country
                                  </option>
                                  {countryList.map((c, i) => (
                                    <option
                                      key={i}
                                      value={c}
                                      className="checkout-forms-contact-second-country-color"
                                    >
                                      {c}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          </div>
                          <div
                            className="checkout-forms-contact-second-regional-grid"
                            style={{ marginTop: 15 }}
                          >
                            <div className="checkout-forms-contact-second-regional-expand">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div">
                                  City
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.city}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      city: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-regional-3-1">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div">
                                  Post Code
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.post_code}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      post_code: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                          </div>
                          <div
                            className="checkout-forms-contact-second-regional-grid"
                            style={{ marginTop: 15 }}
                          >
                            <div className="checkout-forms-contact-second-regional-expand">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div">
                                  Street
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.street}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      street: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-regional-3-1">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div">
                                  House
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.house}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      house: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                          </div>
                          <div
                            className="checkout-forms-contact-second-regional-grid"
                            style={{ marginTop: 15, marginBottom: 0 }}
                          >
                            <div className="checkout-forms-contact-second-regional-columns">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Building
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.building}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      building: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-regional-columns">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Entrance
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.entrance}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      entrance: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-regional-columns">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Floor
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.floor}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      floor: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-regional-columns">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Apartment
                                </div>
                                <input
                                  type="text"
                                  className="checkout-forms-contact-second-label-input"
                                  value={checkoutInformation.apartment}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      apartment: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <div className="checkout-forms-contact-second-regional-columns-textarea">
                              <label className="checkout-forms-contact-second-label">
                                <div className="checkout-forms-contact-second-label-div remove">
                                  Comment
                                </div>
                                <textarea
                                  className="checkout-forms-contact-second-regional-textarea"
                                  rows="5"
                                  placeholder="Additional information: phone numbers or doorphone code"
                                  value={checkoutInformation.comment}
                                  onChange={(e) => {
                                    setCheckoutInformation({
                                      ...checkoutInformation,
                                      comment: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                ></textarea>
                              </label>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </section>
                </div>
              </form>
              <div className="checkout-orders">
                <div className="checkout-card">
                  <section className="checkout-card-body">
                    <h4 className="checkout-card-title">Items in order</h4>
                    <div className="checkout-card-orders-wrapper">
                      {cart.map((c, i) => (
                        <div
                          key={c.id}
                          className="checkout-card-orders"
                          style={{
                            marginTop: i !== 0 ? 15 : 0,
                            marginBottom: 0,
                          }}
                        >
                          <div className="checkout-card-orders-expand">
                            <div className="checkout-card-orders-title">
                              {c.title}
                            </div>
                            <div className="checkout-card-orders-sub-quantity-price">
                              {c.quantity} x {formatter.format(c.unit_price)}
                            </div>
                          </div>
                          <div className="checkout-card-orders-text-right">
                            <div style={{ marginBottom: 0 }}>
                              {formatter.format(c.sum)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="checkout-card-body">
                    <div className="checkout-card-orders">
                      <div className="checkout-card-orders-expand">
                        <div className="checkout-card-orders-shipping">
                          Shipping
                        </div>
                      </div>
                      <div className="checkout-card-orders-text-right">
                        <div>{deliveryResult.title}</div>
                        <div className="checkout-card-orders-text-meta">
                          {deliveryResult.id === 3
                            ? deliveryResult.desc.substring(0, 25)
                            : deliveryResult.desc}
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="checkout-card-body">
                    <div className="checkout-card-price-section">
                      <div className="checkout-card-orders-expand">
                        <div className="checkout-card-orders-total-title">
                          Total
                        </div>
                      </div>
                      <div className="checkout-card-orders-text-right">
                        <div className="checkout-card-order-text-price">
                          {total}
                        </div>
                      </div>
                    </div>
                    <button
                      className={
                        loading
                          ? "checkout-card-button disabled"
                          : "checkout-card-button"
                      }
                      onClick={() => {
                        onCheckout();
                      }}
                      disabled={loading}
                    >
                      proceed to payment
                    </button>
                    {loading && (
                      <div style={{ textAlign: "center" }}>
                        <Spin size="large" />
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
