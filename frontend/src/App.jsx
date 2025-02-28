import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./pages/HomeLayout";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Personal from "./components/Personal";
import Orders from "./pages/Orders";
import PersonalInfo from "./pages/PersonalInfo";
import Settings from "./pages/Settings";
import OrderDetail from "./pages/OrderDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "products",
        element: <AllProducts />,
      },
      {
        path: "products/:id",
        element: <SingleProduct />,
      },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      {
        path: "personal/*",
        element: <Personal />,
        children: [
          {
            path: "orders",
            element: <Orders />,
          },
          { path: "orders/:id", element: <OrderDetail /> },
          { path: "info", element: <PersonalInfo /> },
          { path: "settings", element: <Settings /> },
        ],
      },
      { path: "success", element: <Success /> },
      { path: "cancel", element: <Cancel /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
