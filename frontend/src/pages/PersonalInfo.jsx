import React, { useMemo, useState, useContext } from "react";
import country from "country-list-js";
import { DatePicker, Spin } from "antd";
import { useOutletContext } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const context = useOutletContext();
  const navigation = useNavigate();
  const { token, setToken, openNotification, setPersonal } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({
    first_name: context?.userDetail?.first_Name,
    last_name: context?.userDetail?.last_Name,
    phone_number: context?.userDetail?.phone_Number,
    date_of_birth: moment(context?.userDetail?.date_of_birth).format(
      "YYYY-MM-DD"
    ),
    country: context?.userDetail?.country,
  });
  const apiUrl = import.meta.env.VITE_API_URL;

  const countryList = useMemo(() => {
    const countryNames = country.names();

    countryNames.sort();

    return countryNames;
  }, []);

  const onEditPersonalInfo = () => {
    const { first_name, last_name, phone_number, date_of_birth, country } =
      detail;

    if (
      !first_name ||
      !last_name ||
      !phone_number ||
      !date_of_birth ||
      !country
    ) {
      openNotification("error", "Error", "Please do not leave blank value");

      return;
    }

    setLoading(true);

    fetch(`${apiUrl}/Auth/UpdateUserDetail`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_Name: first_name,
        last_Name: last_name,
        phone_Number: phone_number,
        date_of_birth,
        country,
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
          openNotification("success", "Success", data.message);
          setPersonal(data.personal);
        } else {
          navigation("/");
          setToken(null);
          localStorage.removeItem("ecommerce-token");
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
    <div className="personal-info-card">
      <header className="personal-info-card-header">
        <h1 className="personal-info-card-h1" style={{ marginBottom: 0 }}>
          Personal Info
        </h1>
      </header>
      <div className="personal-info-card-body">
        <form className="personal-info-card-form">
          <div className="personal-info-card-grid">
            <fieldset className="personal-info-card-fieldset">
              <legend className="personal-info-card-legend">Contact</legend>
              <div className="personal-info-fieldset-grid">
                <div className="personal-info-grid-columns">
                  <label className="personal-info-grid-label">
                    <div className="personal-info-grid-div">First Name</div>
                    <input
                      className="personal-info-grid-input"
                      type="text"
                      value={detail.first_name}
                      onChange={(e) => {
                        setDetail({ ...detail, first_name: e.target.value });
                      }}
                      disabled={loading}
                    />
                  </label>
                </div>
                <div className="personal-info-grid-columns person-top">
                  <label className="personal-info-grid-label">
                    <div className="personal-info-grid-div">Last Name</div>
                    <input
                      className="personal-info-grid-input"
                      type="text"
                      value={detail.last_name}
                      onChange={(e) => {
                        setDetail({ ...detail, last_name: e.target.value });
                      }}
                      disabled={loading}
                    />
                  </label>
                </div>
                <div
                  className="personal-info-grid-columns"
                  style={{ marginTop: 15 }}
                >
                  <label className="personal-info-grid-label">
                    <div className="personal-info-grid-div">Phone Number</div>
                    <input
                      className="personal-info-grid-input"
                      type="tel"
                      value={detail.phone_number}
                      onChange={(e) => {
                        setDetail({ ...detail, phone_number: e.target.value });
                      }}
                      disabled={loading}
                    />
                  </label>
                </div>
                <div
                  className="personal-info-grid-columns"
                  style={{ marginTop: 15 }}
                >
                  <label className="personal-info-grid-label">
                    <div className="personal-info-grid-div">Date of Birth</div>
                    <DatePicker
                      className="personal-info-grid-datepicker"
                      value={dayjs(detail.date_of_birth)}
                      onChange={(_, dateString) => {
                        setDetail({ ...detail, date_of_birth: dateString });
                      }}
                      disabled={loading}
                    />
                  </label>
                </div>
                <div className="personal-info-grid-columns-country">
                  <label className="personal-info-grid-label">
                    <div className="personal-info-grid-div">Country</div>
                    <select
                      className="personal-info-grid-select"
                      value={detail.country}
                      onChange={(e) => {
                        setDetail({ ...detail, country: e.target.value });
                      }}
                      disabled={loading}
                    >
                      <option className="personal-info-grid-select-color">
                        Choose the country
                      </option>
                      {countryList.map((c, i) => (
                        <option
                          key={i}
                          className="personal-info-grid-select-color"
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
      <div className="personal-info-card-body-footer">
        <button
          className={
            loading
              ? "personal-info-card-body-button disabled"
              : "personal-info-card-body-button"
          }
          onClick={() => {
            onEditPersonalInfo();
          }}
          disabled={loading}
        >
          save
        </button>
      </div>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
