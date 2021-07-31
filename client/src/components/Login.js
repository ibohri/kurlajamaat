import React, { useState } from "react";
import { Loading } from "./Loading";
import { useAuth } from "../hooks/useProvideAuth";
import "./Login.css";
import { Form, Col, Row, Button } from "react-bootstrap";

export function Login() {
  let { signin, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  let onSubmit = async (e) => {
    try {
      e.preventDefault();
      const userName = e.target.username.value;
      const password = e.target.password.value;
      setIsLoading(true);
      await signin(userName, password);
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
        <Form onSubmit={onSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              User Name
            </Form.Label>
            <Col sm="10">
              <Form.Control
                name="username"
                type="text"
                placeholder="User Name"
              />
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
                name="password"
                type="password"
                placeholder="Password"
              />
            </Col>
          </Form.Group>
          <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading ? "Loading…" : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
