import React, { useState, useRef } from "react";
import api from "../utils/api.util";
import { Loading } from "./Loading";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../hooks/useProvideAuth";

export function ChangePassword() {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const history = useHistory();
  const newPassword = useRef("");
  const confirmPassword = useRef("");
  const auth = useAuth();

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const form = e.currentTarget;
      setPasswordMismatch(false);
      setIncorrectPassword(false);

      if (form.checkValidity() === false) {
        setValidated(true);
        return;
      }
      if (newPassword.current !== confirmPassword.current) {
        setPasswordMismatch(true);
        return;
      }

      setIsLoading(true);
      const formData = new FormData(form);
      const { data: response } = await api.post("/api/user/changePassword", {
        password: formData.get("newPassword"),
        oldPassword: formData.get("oldPassword"),
      });

      if (response.isSuccess) {
        auth.updateUser({ ...auth.user, mustChangePassword: false });
        history.push("/");
      } else if (response.errors?.length) {
        setIncorrectPassword(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = { fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.88rem" };

  return (
    <div className="page-card">
      <div className="page-title">Change Password</div>
      <Form noValidate validated={validated} onSubmit={onSubmit} style={{ maxWidth: 480 }}>
        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Current Password</Form.Label>
          <Form.Control
            required
            name="oldPassword"
            type="password"
            placeholder="Enter current password"
            onInput={() => setIncorrectPassword(false)}
          />
          <Form.Control.Feedback type="invalid">Please enter your current password.</Form.Control.Feedback>
          {incorrectPassword && (
            <div style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: 4 }}>
              Current password is incorrect.
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>New Password</Form.Label>
          <Form.Control
            required
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            onInput={(e) => { newPassword.current = e.target.value; setPasswordMismatch(false); }}
          />
          <Form.Control.Feedback type="invalid">Please enter a new password.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Confirm New Password</Form.Label>
          <Form.Control
            required
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            onInput={(e) => { confirmPassword.current = e.target.value; setPasswordMismatch(false); }}
          />
          <Form.Control.Feedback type="invalid">Please confirm your new password.</Form.Control.Feedback>
          {passwordMismatch && (
            <div style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: 4 }}>
              Passwords do not match.
            </div>
          )}
        </Form.Group>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
          <Button type="submit" disabled={isLoading} variant="primary" style={{ minWidth: 140 }}>
            {isLoading ? "Updating…" : "Update Password"}
          </Button>
          <Button variant="outline-secondary" className="ms-3" onClick={() => history.push("/")} style={{ minWidth: 80 }}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
