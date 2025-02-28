const apiUrl = import.meta.env.VITE_API_URL;

export const fetchUserDetail = ({
  setLoading,
  token,
  setToken,
  setData,
  setPersonal,
  navigation,
  openNotification,
}) => {
  setLoading(true);

  fetch(`${apiUrl}/Auth/UserDetail`, {
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
        setData({
          userDetail: data.userDetail,
        });
        setPersonal({
          first_Name: data.userDetail.first_Name,
          last_Name: data.userDetail.last_Name,
          created_at: data.userDetail.created_at,
        });
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
        openNotification("warning", "Token has expired", "Please Login again");
      } else {
        openNotification("error", "Error", error.message);
      }

      console.log("Error message:", error.message);
    });
};

export const fetchUserSetting = ({
  setLoading,
  token,
  setData,
  setPersonal,
  navigation,
  setToken,
  openNotification,
}) => {
  setLoading(true);

  fetch(`${apiUrl}/Auth/UserSettingDetail`, {
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
        setData({
          email: data.userSetting.email,
        });
        setPersonal({
          first_Name: data.userSetting.first_Name,
          last_Name: data.userSetting.last_Name,
          created_at: data.userSetting.created_at,
        });
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
        openNotification("warning", "Token has expired", "Please Login again");
      } else {
        openNotification("error", "Error", error.message);
      }

      console.log("Error message:", error.message);
    });
};

export const fetchOrders = ({
  setLoading,
  token,
  setData,
  setPersonal,
  navigation,
  setToken,
  openNotification,
}) => {
  setLoading(true);

  fetch(`${apiUrl}/Order/GetOrders`, {
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
        setData({
          orders: data.orders,
        });

        setPersonal({
          first_Name: data.personal.first_Name,
          last_Name: data.personal.last_Name,
          created_at: data.personal.created_at,
        });
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
        openNotification("warning", "Token has expired", "Please Login again");
      } else {
        openNotification("error", "Error", error.message);
      }

      console.log("Error message:", error.message);
    });
};
