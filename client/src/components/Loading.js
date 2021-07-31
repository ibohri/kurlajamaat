import React from "react";
import { Spinner } from "react-bootstrap";
import "./Loading.css";

export function Loading() {
  return (
    <div className="loading-container full-size">
      <Spinner animation="border" variant="primary" />
    </div>
  );
}
