import api from "../utils/api.util";
import React, { useState, useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { Loading } from "./Loading";

export function AddUser() {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(!!id);
  const [isButtonLoading, setButtonIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const history = useHistory();

  const onChange = () => setErrors([]);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      try {
        setButtonIsLoading(true);
        const formData = new FormData(event.currentTarget);
        const data = {};
        for (let [key, value] of formData.entries()) data[key] = value;
        data.isEnabled = isEnabled;
        if (id) data["_id"] = id;
        const response = await api.post("/api/user", data);
        if (response.data.isSuccess) {
          history.push("/users");
        } else if (response.data.errors?.length) {
          setErrors(response.data.errors);
        }
      } finally {
        setButtonIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await api.get(`/api/user/${id}`);
      if (data.isSuccess) {
        setUser(data.user);
        setIsEnabled(data.user.isEnabled);
        setIsLoading(false);
      }
    };
    id && getUser();
  }, [id]);

  if (isLoading) return <Loading />;

  const field = (label, content) => (
    <Form.Group as={Row} className="mb-3 align-items-center">
      <Form.Label column sm="3" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.88rem" }}>
        {label}
      </Form.Label>
      <Col sm="9">{content}</Col>
    </Form.Group>
  );

  return (
    <div className="page-card">
      <div className="page-title">{id ? "Edit User" : "Add User"}</div>
      <Form onChange={onChange} noValidate validated={validated} onSubmit={handleSubmit}>
        {field("Name",
          <>
            <Form.Control defaultValue={user?.name} required name="name" type="text" placeholder="Full name" />
            <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
          </>
        )}

        {field("Role",
          <Form.Select defaultValue={user?.role || "User"} name="role">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </Form.Select>
        )}

        {field("ITS Number",
          <>
            <Form.Control defaultValue={user?.username} required name="username" type="text" placeholder="ITS Number" />
            <Form.Control.Feedback type="invalid">Please enter an ITS Number.</Form.Control.Feedback>
          </>
        )}

        {field("Password",
          <>
            <Form.Control required name="password" type="password" placeholder="Password" />
            <Form.Control.Feedback type="invalid">Please enter a password.</Form.Control.Feedback>
          </>
        )}

        {field("Enabled",
          <Form.Check
            type="switch"
            checked={isEnabled}
            onChange={() => setIsEnabled((p) => !p)}
            label={isEnabled ? "Active" : "Disabled"}
          />
        )}

        {errors?.length > 0 && (
          <div className="mb-3">
            {errors.map((err, i) => (
              <div key={i} style={{ color: "var(--danger)", fontSize: "0.88rem" }}>{err}</div>
            ))}
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
          <Button type="submit" disabled={isButtonLoading} variant="primary" style={{ minWidth: 120 }}>
            {isButtonLoading ? "Saving…" : "Save User"}
          </Button>
          <Button variant="outline-secondary" className="ms-3" onClick={() => history.push("/users")} style={{ minWidth: 80 }}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
