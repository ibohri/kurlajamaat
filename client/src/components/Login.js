import React, { useState } from "react";
import { Loading } from "./Loading";
import { useAuth } from "../hooks/useProvideAuth";
import "./Login.css";
import { Form, Col, Row, Button } from "react-bootstrap";

export function Login() {
  let { signin, loading } = useAuth();
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

  return loading ? (
    <Loading />
  ) : (
    <div className="login-container">
      <h2 className="mb-4" style={{ textAlign: "center" }}>
        Kurla Jamaat
      </h2>
      <div>
        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              User Name
            </Form.Label>
            <Col sm="10">
              <Form.Control
                required
                name="username"
                onInput={() => setShowValidation(false)}
                type="text"
                placeholder="User Name"
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
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Col sm="10">
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
            <Row>
              <Col sm="2"></Col>
              <Col sm="10">
                <div class="error-message">Username or Password is invalid</div>
              </Col>
            </Row>
          )}
          <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading ? "Loading…" : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
