import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Popconfirm } from "antd";

const Navbar = () => {
  const navigation = useNavigate();
  const { token, cart, setToken, setLoading, openNotification } =
    useContext(AppContext);

  const cartNumber = useMemo(() => {
    return cart.reduce((prev, curr) => prev + curr.quantity, 0);
  }, [cart]);

  return (
    <header>
      <div className="navbar-container">
        <div className="navbar">
          <div className="navbar-left">
            <Link className="nav-brand" to="/">
              MK E-commerce
            </Link>
            <nav>
              <ul className="navbar-nav">
                <li>
                  <Link to="/products">All Products</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="navbar-right">
            <span className="account">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className="account-svg"
              >
                {" "}
                <circle
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.1"
                  cx="9.9"
                  cy="6.4"
                  r="4.4"
                ></circle>{" "}
                <path
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.1"
                  d="M1.5,19 C2.3,14.5 5.8,11.2 10,11.2 C14.2,11.2 17.7,14.6 18.5,19.2"
                ></path>
              </svg>
              <div className="account-dropdown">
                <ul className="account-list">
                  {token ? (
                    <>
                      <li>
                        <Link to="/personal/orders">Orders</Link>
                      </li>
                      <li>
                        <Link to="/personal/info">Personal</Link>
                      </li>
                      <li>
                        <Link to="/personal/settings">Settings</Link>
                      </li>
                      <li className="account-divider"></li>
                      <Popconfirm
                        title="Logout"
                        description="Are you sure to Logout?"
                        onConfirm={() => {
                          setLoading(true);

                          setTimeout(() => {
                            setLoading(false);
                            localStorage.removeItem("ecommerce-token");
                            setToken(null);
                            navigation("/");
                            openNotification(
                              "success",
                              "Success",
                              "Logout Successfully"
                            );
                          }, 2000);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <li>
                          <span className="account-logout">Log out</span>
                        </li>
                      </Popconfirm>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/register">Register</Link>
                      </li>
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </span>
            <span
              className="cart"
              onClick={() => {
                navigation("/cart");
              }}
            >
              <span className="cart-svg">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <circle cx="7.3" cy="17.3" r="1.4"></circle>{" "}
                  <circle cx="13.3" cy="17.3" r="1.4"></circle>{" "}
                  <polyline
                    fill="none"
                    stroke="#000"
                    points="0 2 3.2 4 5.3 12.5 16 12.5 18 6.5 8 6.5"
                  ></polyline>
                </svg>
              </span>
              {cart.length > 0 && (
                <span className="cart-badge">{cartNumber}</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
