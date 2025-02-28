import React, { useMemo, useEffect, useState, useContext } from "react";
import { products } from "../utils/Product";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatter } from "../utils/PriceFormatter";
import { Spin } from "antd";
import { AppContext } from "../context/AppContext";
import moment from "moment";

const OrderDetail = () => {
  const { id } = useParams();
  const navigation = useNavigate();
  const { token, setToken, openNotification, setPersonal } =
    useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState(undefined);
  const apiUrl = import.meta.env.VITE_API_URL;

  const shippingResult = useMemo(() => {
    const shippingType = orderDetail?.shipping_Type;

    if (shippingType === "pickup_from_store") {
      return {
        html: "",
        title: "Pick up from store",
        desc: "Free, tomorrow",
      };
    } else if (shippingType === "delivery_in_city") {
      return {
        html: (
          <section className="order-detail-contact-section">
            <div className="order-detail-contact-grid">
              <div className="order-detail-contact-expand">
                <label className="order-detail-contact-label">
                  <div className="order-detail-contact-label-div">Street</div>
                  <input
                    type="text"
                    className="order-detail-contact-label-input"
                    disabled
                    defaultValue={orderDetail?.street}
                  />
                </label>
              </div>
              <div className="order-detail-contact-second-1-3">
                <label className="order-detail-contact-label">
                  <div className="order-detail-contact-label-div">House</div>
                  <input
                    type="text"
                    className="order-detail-contact-label-input"
                    disabled
                    defaultValue={orderDetail?.house}
                  />
                </label>
              </div>
            </div>
            <div
              className="order-detail-contact-grid"
              style={{
                marginBottom: 0,
                marginTop: 15,
              }}
            >
              <div className="order-detail-grid-columns">
                <label className="order-detail-contact-label">
                  <div className="order-detail-contact-label-div">Building</div>
                  <input
                    type="text"
                    className="order-detail-contact-label-input"
                    disabled
                    defaultValue={orderDetail?.building}
                  />
                </label>
              </div>
              <div className="order-detail-grid-columns">
                <label className="order-detail-contact-label">
                  <div className="order-detail-contact-label-div">Entrance</div>
                  <input
                    type="text"
                    className="order-detail-contact-label-input"
                    disabled
                    defaultValue={orderDetail?.entrance}
                  />
                </label>
              </div>
              <div className="order-detail-grid-columns">
                <label className="order-detail-contact-label">
                  <div className="order-detail-contact-label-div">Floor</div>
                  <input
                    type="text"
                    className="order-detail-contact-label-input"
                    disabled
                    defaultValue={orderDetail?.floor}
                  />
                </label>
              </div>
              <div className="order-detail-grid-columns person-top">
                <label className="order-detail-contact-label">
                  <div className="order-detail-contact-label-div">
                    Apartment
                  </div>
                  <input
                    type="text"
                    className="order-detail-contact-label-input"
                    disabled
                    defaultValue={orderDetail?.apartment}
                  />
                </label>
              </div>
              <div className="order-detail-grid-column-expand">
                <label className="order-detail-contact-label">
                  <div className="order-detail-contact-label-div">Comment</div>
                  <textarea
                    className="order-detail-textarea"
                    rows="5"
                    placeholder="Additional information: phone numbers or doorphone code"
                    disabled
                    defaultValue={orderDetail?.comment}
                  ></textarea>
                </label>
              </div>
            </div>
          </section>
        ),
        title: "Delivery in city",
        desc: "Free, tomorrow",
      };
    } else {
      return {
        html: (
          <section className="order-detail-contact-section">
            <div className="order-detail-regional-grid">
              <div className="order-detail-regional-country">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Country</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.country}
                  />
                </label>
              </div>
            </div>
            <div
              className="order-detail-regional-grid"
              style={{ marginTop: 15 }}
            >
              <div className="order-detail-regional-expand">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">City</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.city}
                  />
                </label>
              </div>
              <div className="order-detail-regional-3-1">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Post Code</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.post_Code}
                  />
                </label>
              </div>
            </div>
            <div
              className="order-detail-regional-grid"
              style={{ marginTop: 15 }}
            >
              <div className="order-detail-regional-expand">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Street</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.street}
                  />
                </label>
              </div>
              <div className="order-detail-regional-3-1">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">House</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.house}
                  />
                </label>
              </div>
            </div>
            <div
              className="order-detail-regional-grid"
              style={{ marginTop: 15, marginBottom: 0 }}
            >
              <div className="order-detail-regional-columns">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Building</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.building}
                  />
                </label>
              </div>
              <div className="order-detail-regional-columns">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Entrance</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.entrance}
                  />
                </label>
              </div>
              <div className="order-detail-regional-columns">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Floor</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.floor}
                  />
                </label>
              </div>
              <div className="order-detail-regional-columns">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Apartment</div>
                  <input
                    type="text"
                    className="order-detail-label-input"
                    disabled
                    defaultValue={orderDetail?.apartment}
                  />
                </label>
              </div>
              <div className="order-detail-regional-columns-textarea">
                <label className="order-detail-label">
                  <div className="order-detail-label-div">Comment</div>
                  <textarea
                    className="order-detail-regional-textarea"
                    rows="5"
                    placeholder="Additional information: phone numbers or doorphone code"
                    disabled
                    defaultValue={orderDetail?.comment}
                  ></textarea>
                </label>
              </div>
            </div>
          </section>
        ),
        title: "Regional delivery",
        desc: "Postal courier services. Sending to any country",
      };
    }
  }, [orderDetail]);

  const productResult = useMemo(() => {
    const product = orderDetail?.product
      ? JSON.parse(orderDetail?.product)
      : [];

    return product.map((p) => {
      return {
        id: p.id,
        quantity: p.quantity,
        title: p.title,
        unit_price: p.unit_price,
        sum: p.unit_price * p.quantity,
        category: products.find((product) => product.id === p.id).category,
        image: products.find((product) => product.id === p.id).image,
      };
    });
  }, [orderDetail]);

  const fetchOrderDetail = () => {
    setLoading(true);

    fetch(`${apiUrl}/Order/GetOrder/${parseInt(id)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
          setOrderDetail(data.orderDetail);

          setPersonal({
            first_Name: data.personal.first_Name,
            last_Name: data.personal.last_Name,
            created_at: data.personal.created_at,
          });
        } else {
          if (data.user) {
            navigation("/");
            setToken(null);
            localStorage.removeItem("ecommerce-token");
            openNotification("error", "Error", data.message);
          } else {
            navigation("/personal/orders");
          }
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
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <div className="order-detail-card">
      <section className="order-detail-section">
        <h3 className="order-detail-header">
          <span className="order-detail-span">
            #{parseInt(id)}{" "}
            <span className="order-detail-date">
              from {moment(orderDetail?.created_at).format("MMMM D, YYYY")}
            </span>
          </span>
        </h3>
        <div className="order-detail-shipping-detail">
          <p className="order-detail-shipping-title">Shipping</p>
          <div className="order-detail-shipping-sub-title">
            <p className="order-detail-shipping-sub-main">
              {shippingResult.title}
            </p>
            <p className="order-detail-shipping-sub-sub">
              {shippingResult.desc}
            </p>
          </div>
        </div>
        <div
          className="order-detail-card-grid"
          style={{ padding: "10px 12px" }}
        >
          <div className="order-detail-contact-first-columns">
            <label
              style={{
                marginBottom: 0,
                touchAction: "manipulation",
              }}
            >
              <div className="order-detail-contact-first-label">First Name</div>
              <input
                type="text"
                className="order-detail-contact-first-input"
                disabled
                defaultValue={orderDetail?.first_Name}
              />
            </label>
          </div>
          <div className="order-detail-contact-first-columns person-top">
            <label
              style={{
                marginBottom: 0,
                touchAction: "manipulation",
              }}
            >
              <div className="order-detail-contact-first-label">Last Name</div>
              <input
                type="text"
                className="order-detail-contact-first-input"
                disabled
                defaultValue={orderDetail?.last_Name}
              />
            </label>
          </div>
          <div
            className="order-detail-contact-first-columns"
            style={{ marginTop: 15 }}
          >
            <label
              style={{
                marginBottom: 0,
                touchAction: "manipulation",
              }}
            >
              <div className="order-detail-contact-first-label">
                Phone Number
              </div>
              <input
                type="text"
                className="order-detail-contact-first-input"
                disabled
                defaultValue={orderDetail?.phone_Number}
              />
            </label>
          </div>
          <div
            className="order-detail-contact-first-columns"
            style={{ marginTop: 15 }}
          >
            <label
              style={{
                marginBottom: 0,
                touchAction: "manipulation",
              }}
            >
              <div className="order-detail-contact-first-label">Email</div>
              <input
                type="text"
                className="order-detail-contact-first-input"
                disabled
                defaultValue={orderDetail?.email}
              />
            </label>
          </div>
        </div>
        {shippingResult.html}
        <div className="order-detail-cart-item-wrapper">
          <header className="cart-first-column-card-header">
            <div className="cart-first-column-card-header-grid">
              <div className="cart-header-column">product</div>
              <div className="cart-header-column">
                <div className="cart-header-second">
                  <div className="cart-header-second-columns">price</div>
                  <div className="cart-header-second-columns">quantity</div>
                  <div className="cart-header-second-columns">sum</div>
                  <div className="cart-width-auto">
                    <div style={{ width: 20, marginBottom: 0 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {productResult.map((pr) => (
            <div key={pr.id} className="cart-item">
              <div className="cart-item-grid">
                <div className="cart-item-product-cell">
                  <div className="cart-item-product-cell-grid">
                    <div className="cart-item-product-image">
                      <div className="cart-item-product-image-wrapper">
                        <Link
                          to={`/products/${pr.id}`}
                          className="cart-item-product-image-link"
                        >
                          <figure className="cart-item-product-image-figure">
                            <img
                              src={pr.image}
                              alt={pr.title}
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
                        {pr.category}
                      </div>
                      <Link
                        to={`/products/${pr.id}`}
                        className="cart-item-product-title-link"
                      >
                        {pr.title}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="cart-item-product-cell cart-item-product-cell-top">
                  <div className="cart-item-product-prices">
                    <div className="cart-item-product-first">
                      <div className="cart-item-product-responsive">Price</div>
                      <div style={{ marginBottom: 0 }}>
                        {formatter.format(pr.unit_price)}
                      </div>
                    </div>
                    <div className="cart-item-product-second">
                      <div style={{ marginBottom: 0 }}>{pr.quantity}</div>
                    </div>
                    <div className="cart-item-product-third">
                      <div className="cart-item-product-responsive">Sum</div>
                      <div style={{ marginBottom: 0 }}>
                        {formatter.format(pr.sum)}
                      </div>
                    </div>
                    <div
                      className="cart-item-order-detail-auto"
                      style={{ width: 37 }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="order-detail-total-detail">
            <p className="order-detail-total-title">Total</p>
            <div className="order-detail-total-sub-title">
              <p className="order-detail-total-sub-main">
                {formatter.format(orderDetail?.total)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetail;
