import api from "../utils/api.util";
import React, { useState, useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { Loading } from "./Loading";

export function AddUser() {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
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
        for (let [key, value] of formData.entries()) {
          data[key] = value;
        }
        data.isEnabled = isEnabled;
        if (id) {
          data["_id"] = id;
        }
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

  const onCancelClick = () => history.push("/users");

  return isLoading ? (
    <Loading />
  ) : (
    <Form
      onChange={onChange}
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Name
        </Form.Label>
        <Col sm="10">
          <Form.Control
            defaultValue={user && user.name}
            required
            name="name"
            type="text"
          />
          <Form.Control.Feedback type="invalid">
            Please enter name.
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Role
        </Form.Label>
        <Col sm="10">
          <Form.Select defaultValue={user && user.role} name="role">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </Form.Select>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          User Name
        </Form.Label>
        <Col sm="10">
          <Form.Control
            defaultValue={user && user.username}
            required
            name="username"
            type="text"
          />
          <Form.Control.Feedback type="invalid">
            Please enter username.
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Password
        </Form.Label>
        <Col sm="10">
          <Form.Control required name="password" type="password" />
          <Form.Control.Feedback type="invalid">
            Please enter password.
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formIsEnabled">
        <Form.Label column sm="2">
          Is Enabled
        </Form.Label>
        <Col sm="10">
          <Form.Check
            type="checkbox"
            checked={isEnabled}
            onChange={() => {
              setIsEnabled((prev) => !prev);
            }}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Relay From
        </Form.Label>
        <Col sm="10">
          <Form.Select defaultValue={user && user.relayFrom} name="relayFrom">
            <option value="Masjid">Masjid</option>
            <option value="Dar-ul-Imarat">Dar-ul-Imarat</option>
          </Form.Select>
        </Col>
      </Form.Group>
      {errors?.length > 0 && (
        <div className="errors">
          {errors.map((err) => (
            <Row>
              <Col sm="2"></Col>
              <Col
                sm="10"
                style={{
                  color: "red",
                }}
              >
                {err}
              </Col>
            </Row>
          ))}
        </div>
      )}
      <Button type="submit" disabled={isButtonLoading} variant="primary">
        {isButtonLoading ? "Loading…" : "Submit"}
      </Button>
      <Button variant="secondary" className="m-3" onClick={onCancelClick}>
        Cancel
      </Button>
    </Form>
  );
}
