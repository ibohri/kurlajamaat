import React, { useState } from "react";
import { Loading } from "./Loading";
import { useAuth } from "../hooks/useProvideAuth";
import "./Login.css";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export function Login() {
  let { signin, loading, user } = useAuth();
  const { siteName, logo, contacts } = useSettings();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        setValidated(true);
        setShowValidation(false);
      } else {
        setIsLoading(true);
        const isSuccess = await signin(e.target.username.value, e.target.password.value);
        if (!isSuccess) setShowValidation(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return <Redirect to={{ pathname: "/" }} />;
  if (loading) return <Loading />;

  return (
    <div className="full-size login-container-bg">
      <div className="login-container">
        <img className="logo" alt="logo" src={logo || "./logo.jpeg"} />
        <h1 className="login-title">{siteName || "Anjuman-E-Zainee Kurla"}</h1>

        <Form noValidate validated={validated} onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="login-form-label">HOF ITS Number</Form.Label>
            <Form.Control
              required
              name="username"
              type="text"
              placeholder="Enter your ITS Number"
              onInput={() => setShowValidation(false)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your ITS Number.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="login-form-label">Password</Form.Label>
            <Form.Control
              required
              name="password"
              type="password"
              placeholder="Enter your password"
              onInput={() => setShowValidation(false)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </Form.Group>

          {showValidation && (
            <div className="error-message mb-3">
              ITS Number or Password is invalid.
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </Form>

        {contacts && contacts.length > 0 && (
          <div className="contact-info">
            <div className="contact-info-title">Contact Information</div>
            {contacts.map((c, i) => (
              <div className="contact-item" key={i}>
                <span>{c.name}{c.name && c.phone ? " — " : ""}{c.phone}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
