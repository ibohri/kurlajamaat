import React, { useState, useRef, useEffect } from "react";
import api from "../utils/api.util";
import "./Login.css";
import { Loading } from "./Loading";
import { useHistory, Redirect } from "react-router-dom";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useAuth } from "../hooks/useProvideAuth";

export function ChangePassword() {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showInvalidPasswordValidation, setShowInvalidPasswordValidation] =
    useState(false);
  const history = useHistory();
  const password = useRef();
  const confimPassword = useRef();
  const auth = useAuth();

  const onPasswordChange = (e) => {
    password.current = e.target.value;
  };
  const onConfirmPasswordChange = (e) => {
    confimPassword.current = e.target.value;
  };

  useEffect(() => {
    if (password.current && confimPassword.current) {
      setShowValidation(password.current === confimPassword.current);
    } else {
      setShowValidation(false);
    }
  }, [password, confimPassword]);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      e.stopPropagation();
      if (form.checkValidity() === false) {
        setValidated(true);
        setShowValidation(false);
      } else if (password.current !== confimPassword.current) {
        setShowValidation(true);
      } else {
        const formData = new FormData(e.currentTarget);
        const data = {};
        for (let [key, value] of formData.entries()) {
          data[key] = value;
        }
        setIsLoading(true);
        const { data: response } = await api.post("/api/user/changePassword", {
          password: data.newPassword,
          oldPassword: data.oldPassword,
        });
        if (response.isSuccess) {
          auth.updateUser({
            ...auth.user,
            mustChangePassword: false,
          });
          history.push("/");
        } else if (response.errors?.length) {
          setShowInvalidPasswordValidation(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="full-size">
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="12">
            Old Password
          </Form.Label>
          <Col sm="12">
            <Form.Control
              required
              name="oldPassword"
              onInput={(e) => setShowInvalidPasswordValidation(false)}
              type="password"
              placeholder="Old Password"
            />
            <Form.Control.Feedback type="invalid">
              Please enter password.
            </Form.Control.Feedback>
            {showInvalidPasswordValidation && (
              <div class="error-message">Password is incorrect.</div>
            )}
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="12">
            New Password
          </Form.Label>
          <Col sm="12">
            <Form.Control
              required
              name="newPassword"
              onInput={(e) => onPasswordChange(e)}
              type="text"
              placeholder="Password"
            />
            <Form.Control.Feedback type="invalid">
              Please enter new password.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Form.Label column sm="12">
            Confirm Password
          </Form.Label>
          <Col sm="12">
            <Form.Control
              required
              onInput={(e) => onConfirmPasswordChange(e)}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />
            <Form.Control.Feedback type="invalid">
              Please confirm password.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        {showValidation && (
          <Row className="mb-3">
            <Col sm="12">
              <div class="error-message">Password does not match.</div>
            </Col>
          </Row>
        )}
        <Button type="submit" disabled={isLoading} variant="primary">
          {isLoading ? "Loading…" : "Submit"}
        </Button>
      </Form>
    </div>
  );
}
