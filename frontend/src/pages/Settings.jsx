import React, { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { Spin } from "antd";
import { AppContext } from "../context/AppContext";

const Settings = () => {
  const context = useOutletContext();
  const [loading, setLoading] = useState(false);
  const { token, setToken, openNotification } = useContext(AppContext);
  const [passwordObj, setPasswordObj] = useState({
    password: "",
    password_confirm: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;

  const onResetPassword = () => {
    const { password, password_confirm } = passwordObj;

    if (!password || !password_confirm) {
      openNotification("error", "Error", "Please do not leave blank value");

      return;
    }

    setLoading(true);

    fetch(`${apiUrl}/Auth/ResetPassword`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
        password_Confirm: password_confirm,
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
          setPasswordObj({ password: "", password_confirm: "" });
          openNotification("success", "Success", data.message);
        } else {
          openNotification("error", "Error", data.message);
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

  return (
    <div className="settings-card">
      <header className="settings-card-header">
        <h1 className="settings-card-h1" style={{ marginBottom: 0 }}>
          Settings
        </h1>
      </header>
      <div className="settings-card-body">
        <form className="settings-card-body-form">
          <div className="settings-card-body-grid">
            <fieldset className="settings-card-body-fieldset-columns">
              <legend className="settings-card-body-legends">Email</legend>
              <div className="settings-card-body-divs">
                <div className="settings-card-body-columns">
                  <label className="settings-card-body-label">
                    <div className="settings-card-body-label-div">
                      Current Email
                    </div>
                    <input
                      className="settings-card-body-input"
                      type="email"
                      defaultValue={context?.email}
                      disabled
                    />
                  </label>
                </div>
              </div>
            </fieldset>
            <fieldset
              className="settings-card-body-fieldset-columns"
              style={{ marginTop: 30 }}
            >
              <legend className="settings-card-body-legends">Password</legend>
              <div className="settings-card-body-divs">
                <div className="settings-card-body-columns">
                  <label className="settings-card-body-label">
                    <div className="settings-card-body-label-div">
                      New Password
                    </div>
                    <input
                      className="settings-card-body-input"
                      type="password"
                      value={passwordObj.password}
                      onChange={(e) => {
                        setPasswordObj({
                          ...passwordObj,
                          password: e.target.value,
                        });
                      }}
                      disabled={loading}
                    />
                  </label>
                </div>
                <div
                  className="settings-card-body-columns"
                  style={{ marginTop: 15 }}
                >
                  <label className="settings-card-body-label">
                    <div className="settings-card-body-label-div">
                      Confirm Password
                    </div>
                    <input
                      className="settings-card-body-input"
                      type="password"
                      value={passwordObj.password_confirm}
                      onChange={(e) => {
                        setPasswordObj({
                          ...passwordObj,
                          password_confirm: e.target.value,
                        });
                      }}
                      disabled={loading}
                    />
                  </label>
                </div>
                <div
                  className="settings-card-body-columns"
                  style={{ marginTop: 15 }}
                >
                  <button
                    className={
                      loading
                        ? "settings-card-body-button disabled"
                        : "settings-card-body-button"
                    }
                    onClick={() => {
                      onResetPassword();
                    }}
                    disabled={loading}
                  >
                    update password
                  </button>
                  {loading && (
                    <div>
                      <Spin size="large" />
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
