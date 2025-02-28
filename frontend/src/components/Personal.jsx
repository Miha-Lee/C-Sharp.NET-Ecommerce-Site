import React, { useMemo, useState, useContext, useEffect } from "react";
import {
  Outlet,
  Link,
  useLocation,
  matchPath,
  useNavigate,
} from "react-router-dom";
import { Spin } from "antd";
import { AppContext } from "../context/AppContext";
import moment from "moment";
import {
  fetchUserSetting,
  fetchOrders,
  fetchUserDetail,
} from "../utils/UserOrder";

const Personal = () => {
  const { pathname } = useLocation();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const { token, setToken, openNotification, personal, setPersonal } =
    useContext(AppContext);

  const orderDetailPathCheck = useMemo(() => {
    return matchPath("/personal/orders/:id", pathname) ? true : false;
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/personal/info") {
      fetchUserDetail({
        setLoading,
        token,
        setToken,
        setData,
        openNotification,
        setPersonal,
        navigation,
      });
    } else if (pathname === "/personal/settings") {
      fetchUserSetting({
        setLoading,
        token,
        setToken,
        setData,
        openNotification,
        setPersonal,
        navigation,
      });
    } else if (pathname === "/personal/orders") {
      fetchOrders({
        setLoading,
        token,
        setToken,
        setData,
        openNotification,
        setPersonal,
        navigation,
      });
    }
  }, [pathname]);

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          width: "100%",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <section className="personal-section">
      <div className="personal-container">
        <div className="personal-grid">
          <div className="personal-first-column">
            <div className="personal-card">
              <div className="personal-card-header">
                <div className="personal-card-grid">
                  <div className="personal-card-grid-first">
                    <div className="personal-card-name">
                      {personal?.first_Name} {personal?.last_Name}
                    </div>
                    <div className="personal-card-joined-date">
                      Joined{" "}
                      {moment(personal?.created_at).format("MMMM D, YYYY")}
                    </div>
                  </div>
                  <div className="personal-card-grid-margin">
                    <div className="personal-card-grid-stack">
                      <div className="personal-card-grid-first-column">
                        <Link
                          to="/personal/settings"
                          className="personal-card-grid-first-column-link"
                        >
                          <span className="personal-card-grid-first-column-icon">
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
                              <circle
                                fill="none"
                                stroke="#000"
                                cx="9.997"
                                cy="10"
                                r="3.31"
                              ></circle>{" "}
                              <path
                                fill="none"
                                stroke="#000"
                                d="M18.488,12.285 L16.205,16.237 C15.322,15.496 14.185,15.281 13.303,15.791 C12.428,16.289 12.047,17.373 12.246,18.5 L7.735,18.5 C7.938,17.374 7.553,16.299 6.684,15.791 C5.801,15.27 4.655,15.492 3.773,16.237 L1.5,12.285 C2.573,11.871 3.317,10.999 3.317,9.991 C3.305,8.98 2.573,8.121 1.5,7.716 L3.765,3.784 C4.645,4.516 5.794,4.738 6.687,4.232 C7.555,3.722 7.939,2.637 7.735,1.5 L12.263,1.5 C12.072,2.637 12.441,3.71 13.314,4.22 C14.206,4.73 15.343,4.516 16.225,3.794 L18.487,7.714 C17.404,8.117 16.661,8.988 16.67,10.009 C16.672,11.018 17.415,11.88 18.488,12.285 L18.488,12.285 Z"
                              ></path>
                            </svg>
                          </span>
                          <span>Settings</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <nav>
                  <ul className="personal-card-ul">
                    <li
                      className={
                        pathname === "/personal/orders" || orderDetailPathCheck
                          ? "active"
                          : ""
                      }
                    >
                      <Link
                        to="/personal/orders"
                        className="personal-card-ul-link"
                      >
                        Orders
                      </Link>
                    </li>
                    <li
                      className={pathname === "/personal/info" ? "active" : ""}
                    >
                      <Link
                        to="/personal/info"
                        className="personal-card-ul-link"
                      >
                        Personal Info
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="personal-second-column">
            <Outlet context={data} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Personal;
