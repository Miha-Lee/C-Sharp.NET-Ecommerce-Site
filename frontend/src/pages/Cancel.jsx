import React, { useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigation = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>The payment has been canceled</h1>
      <Button
        type="primary"
        onClick={() => {
          navigation("/");
        }}
      >
        Back to homepage
      </Button>
    </div>
  );
};

export default Cancel;
