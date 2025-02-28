import React, { useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Spin } from "antd";

const HomeLayout = () => {
  const { pathname } = useLocation();
  const { loading, setFilters } = useContext(AppContext);

  useEffect(() => {
    if (pathname !== "/products") {
      setFilters({
        prices: {
          from: "",
          to: "",
        },
        brands: [],
        types: [],
        categoryLink: "",
      });
    }
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main>
        {!loading ? (
          <Outlet />
        ) : (
          <Spin
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            size="large"
          />
        )}
        <Footer />
      </main>
    </>
  );
};

export default HomeLayout;
