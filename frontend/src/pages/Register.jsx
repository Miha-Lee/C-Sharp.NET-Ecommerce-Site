import React, { useMemo, useContext, useState } from "react";
import { DatePicker, Button, Spin } from "antd";
import country from "country-list-js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Register = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    country: "",
    password: "",
    password_confirm: "",
  });
  const { openNotification } = useContext(AppContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const countryList = useMemo(() => {
    const countryNames = country.names();

    countryNames.sort();

    return countryNames;
  }, []);

  const onRegister = () => {
    const {
      email,
      first_name,
      last_name,
      phone_number,
      date_of_birth,
      country,
      password,
      password_confirm,
    } = register;

    if (
      !email ||
      !first_name ||
      !last_name ||
      !phone_number ||
      !date_of_birth ||
      !country ||
      !password ||
      !password_confirm
    ) {
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

    fetch(`${apiUrl}/Auth/Register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_Name: first_name,
        last_Name: last_name,
        phone_Number: phone_number,
        date_of_birth: date_of_birth,
        country,
        password,
        passwordConfirm: password_confirm,
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
          navigation("/login");
        } else {
          openNotification("error", "Something Wrong", data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        openNotification(
          "error",
          "Something wrong on the server",
          "There is something wrong on the server, please verify it"
        );
        console.log("Error message:", error.message);
      });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <header className="register-card-header">
          <h1 className="register-card-title" style={{ marginBottom: 0 }}>
            Register
          </h1>
        </header>
        <div className="register-card-body">
          <form className="register-card-body-form">
            <div className="register-card-body-grid">
              <fieldset className="register-card-body-fieldset">
                <div className="register-card-grid">
                  <div className="register-grid-columns">
                    <label className="register-grid-label">
                      <div className="register-grid-div">Email</div>
                      <input
                        className="register-grid-input"
                        type="text"
                        value={register.email}
                        onChange={(e) => {
                          setRegister({ ...register, email: e.target.value });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div
                    className="register-grid-columns"
                    style={{ marginTop: 15 }}
                  >
                    <label className="register-grid-label">
                      <div className="register-grid-div">First Name</div>
                      <input
                        className="register-grid-input"
                        type="text"
                        value={register.first_name}
                        onChange={(e) => {
                          setRegister({
                            ...register,
                            first_name: e.target.value,
                          });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div
                    className="register-grid-columns"
                    style={{ marginTop: 15 }}
                  >
                    <label className="register-grid-label">
                      <div className="register-grid-div">Last Name</div>
                      <input
                        className="register-grid-input"
                        type="text"
                        value={register.last_name}
                        onChange={(e) => {
                          setRegister({
                            ...register,
                            last_name: e.target.value,
                          });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div
                    className="register-grid-columns"
                    style={{ marginTop: 15 }}
                  >
                    <label className="register-grid-label">
                      <div className="register-grid-div">Phone Number</div>
                      <input
                        className="register-grid-input"
                        type="tel"
                        value={register.phone_number}
                        onChange={(e) => {
                          setRegister({
                            ...register,
                            phone_number: e.target.value,
                          });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div
                    className="register-grid-columns"
                    style={{ marginTop: 15 }}
                  >
                    <label className="register-grid-label">
                      <div className="register-grid-div">Date of Birth</div>
                      <DatePicker
                        className="register-grid-datepicker"
                        onChange={(_, dateString) => {
                          setRegister({
                            ...register,
                            date_of_birth: dateString,
                          });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div
                    className="register-grid-columns"
                    style={{ marginTop: 15 }}
                  >
                    <label className="register-grid-label">
                      <div className="register-grid-div">Country</div>
                      <select
                        className="register-grid-select"
                        value={register.country}
                        onChange={(e) => {
                          setRegister({ ...register, country: e.target.value });
                        }}
                        disabled={loading}
                      >
                        <option className="register-grid-select-color">
                          Choose the country
                        </option>
                        {countryList.map((c, i) => (
                          <option
                            key={i}
                            className="register-grid-select-color"
                          >
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div
                    className="register-grid-columns"
                    style={{ marginTop: 15 }}
                  >
                    <label className="register-grid-label">
                      <div className="register-grid-div">Password</div>
                      <input
                        className="register-grid-input"
                        type="password"
                        value={register.password}
                        onChange={(e) => {
                          setRegister({
                            ...register,
                            password: e.target.value,
                          });
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div
                    className="register-grid-columns"
                    style={{ marginTop: 15 }}
                  >
                    <label className="register-grid-label">
                      <div className="register-grid-div">Confirm Password</div>
                      <input
                        className="register-grid-input"
                        type="password"
                        value={register.password_confirm}
                        onChange={(e) => {
                          setRegister({
                            ...register,
                            password_confirm: e.target.value,
                          });
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
        <div className="register-card-footer">
          <div style={{ textAlign: "center" }}>
            <button
              className={
                loading
                  ? "register-card-footer-button disabled"
                  : "register-card-footer-button"
              }
              onClick={() => {
                onRegister();
              }}
              disabled={loading}
            >
              register
            </button>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              onClick={() => {
                navigation("/login");
              }}
              disabled={loading}
            >
              Already Registered, Please Login
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

export default Register;
