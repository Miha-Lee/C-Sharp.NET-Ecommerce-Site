import React, { createContext, useState, useEffect } from "react";
import { notification } from "antd";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("ecommerce-token"));
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [filters, setFilters] = useState({
    prices: {
      from: "",
      to: "",
    },
    brands: [],
    types: [],
    categoryLink: "",
  });
  const [cart, setCart] = useState(
    localStorage.getItem("ecommerce-cart")
      ? JSON.parse(localStorage.getItem("ecommerce-cart"))
      : []
  );
  const [personal, setPersonal] = useState(undefined);

  const openNotification = (type, msg, desc) => {
    api[type]({
      message: msg,
      description: desc,
    });
  };

  useEffect(() => {
    localStorage.setItem("ecommerce-cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        loading,
        setLoading,
        filters,
        setFilters,
        openNotification,
        cart,
        setCart,
        personal,
        setPersonal,
      }}
    >
      {contextHolder}
      {children}
    </AppContext.Provider>
  );
};
