import React, { useState } from "react";
import { Loading } from "./Loading";
import { useAuth } from "../hooks/useProvideAuth";
import "./Login.css";
import { Form, Col, Row, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

export function Login() {
  let { signin, loading, user } = useAuth();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  let onSubmit = async (e) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      e.stopPropagation();
      if (form.checkValidity() === false) {
        setValidated(true);
        setShowValidation(false);
      } else {
        const userName = e.target.username.value;
        const password = e.target.password.value;
        setIsLoading(true);
        const isSuccess = await signin(userName, password);
        if (!isSuccess) {
          setShowValidation(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return user ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    ></Redirect>
  ) : loading ? (
    <Loading />
  ) : (
    <div className="full-size login-container-bg">
      <div className="login-container">
        <img className="mb-3 logo" alt="logo" src={"./logo.jpeg"}></img>
        <h2 className="mb-4" style={{ textAlign: "center" }}>
          Anjuman-E-Zainee Kurla
        </h2>
        <div className="mb-3">
          <Form noValidate validated={validated} onSubmit={onSubmit}>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextEmail"
            >
              <Form.Label column sm="12">
                HOF ITS Number
              </Form.Label>
              <Col sm="12">
                <Form.Control
                  required
                  name="username"
                  onInput={() => setShowValidation(false)}
                  type="text"
                  placeholder="HOF ITS Number"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter username.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="12">
                Password
              </Form.Label>
              <Col sm="12">
                <Form.Control
                  required
                  onInput={() => setShowValidation(false)}
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter password.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {showValidation && (
              <Row className="mb-3">
                <Col sm="12">
                  <div class="error-message">
                    Username or Password is invalid
                  </div>
                </Col>
              </Row>
            )}
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? "Loading…" : "Submit"}
            </Button>
          </Form>
        </div>
        <div style={{ lineHeight: "30px" }}>
          <div style={{ fontWeight: "bold" }}>Contact Information</div>
          <div>Burhanuddin Kundawala - +91-9833980159</div>
        </div>
      </div>
    </div>
  );
}
