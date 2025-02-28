import React, { useContext, useState } from "react";
import { Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const { setToken, openNotification } = useContext(AppContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const onLogin = () => {
    const { email, password } = login;

    if (!email || !password) {
      openNotification("error", "Error", "Please do not leave blank value");

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

    setLoading(true);

    fetch(`${apiUrl}/Auth/Login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setLoading(false);

        if (data.success) {
          openNotification("success", "Success", data.message);
          setToken(data.token);
          localStorage.setItem("ecommerce-token", data.token);
          navigation("/");
        } else {
          openNotification("error", "Something Wrong", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setToken(null);
        localStorage.removeItem("ecommerce-token");
        openNotification(
          "error",
          "Something wrong on the server",
          "There is something wrong on the server, please verify it"
        );
        console.log("Error message:", error.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-card-header">
          <h1 className="login-card-title" style={{ marginBottom: 0 }}>
            Login
          </h1>
        </header>
        <div className="login-card-body">
          <form className="login-card-body-form">
            <div className="login-card-body-grid">
              <fieldset className="login-card-body-fieldset">
                <div className="login-card-grid">
                  <div className="login-grid-columns">
                    <label className="login-grid-label">
                      <div className="login-grid-div">Email</div>
                      <input
                        className="login-grid-input"
                        type="text"
                        value={login.email}
                        onChange={(e) => {
                          setLogin({ ...login, email: e.target.value });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div className="login-grid-columns" style={{ marginTop: 15 }}>
                    <label className="login-grid-label">
                      <div className="login-grid-div">Password</div>
                      <input
                        className="login-grid-input"
                        type="password"
                        value={login.password}
                        onChange={(e) => {
                          setLogin({ ...login, password: e.target.value });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </form>
        </div>
        <div className="login-card-footer">
          <div style={{ textAlign: "center" }}>
            <button
              className={
                loading
                  ? "login-card-footer-button disabled"
                  : "login-card-footer-button"
              }
              onClick={() => {
                onLogin();
              }}
              disabled={loading}
            >
              Login
            </button>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              onClick={() => {
                navigation("/register");
              }}
              disabled={loading}
            >
              Haven't registered?
            </Button>
          </div>
          {loading && (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
