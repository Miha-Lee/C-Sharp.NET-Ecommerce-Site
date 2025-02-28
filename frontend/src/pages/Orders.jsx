import React from "react";
import { Button } from "antd";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatter } from "../utils/PriceFormatter";
import moment from "moment";

const Orders = () => {
  const navigation = useNavigate();
  const context = useOutletContext();

  const getShippingResult = (shippingType) => {
    if (shippingType === "pickup_from_store") {
      return "Pick up from store";
    } else if (shippingType === "delivery_in_city") {
      return "Delivery in city";
    } else {
      return "Regional delivery";
    }
  };

  return (
    <div className="orders-card">
      <header className="orders-header">
        <h1 className="orders-h1">Orders</h1>
      </header>
      <div className="orders-secion-wrapper">
        {context?.orders?.length === 0 ? (
          <h1 style={{ fontSize: "2rem", textAlign: "center" }}>
            There are no orders in your account
          </h1>
        ) : (
          <>
            {context?.orders?.map((o, i) => (
              <section
                key={o.order_id}
                className="orders-section"
                style={{ borderTop: i !== 0 ? "1px solid #e5e5e5" : "none" }}
              >
                <h3 className="orders-section-header">
                  <span className="orders-section-header-span">
                    #{o.order_id}{" "}
                    <span className="orders-section-header-date">
                      from {moment(o.created_at).format("MMMM D, YYYY")}
                    </span>
                  </span>
                </h3>
                <table className="orders-section-table">
                  <tbody>
                    <tr>
                      <th className="order-section-table-th">Items</th>
                      <td className="order-section-table-td">{o.items}</td>
                    </tr>
                    <tr>
                      <th className="order-section-table-th">Shipping</th>
                      <td className="order-section-table-td">
                        {getShippingResult(o.shipping)}
                      </td>
                    </tr>
                    <tr>
                      <th className="order-section-table-th">Total</th>
                      <td className="order-section-table-td">
                        {formatter.format(o.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="orders-section-button-wrapper">
                  <Button
                    type="primary"
                    onClick={() => {
                      navigation(`/personal/orders/${o.order_id}`);
                    }}
                  >
                    View Order Detail
                  </Button>
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
