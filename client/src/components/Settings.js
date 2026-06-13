import React, { useState } from "react";
import { useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import api from "../utils/api.util";
import { useHistory } from "react-router-dom";
import { Loading } from "./Loading";

export function Settings() {
  const history = useHistory();
  const [settings, setSettings] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSettings = async () => {
      const { data } = await api.get("/api/settings");
      if (data.isSuccess && data.settings) {
        const s = data.settings;
        setSettings({ ...s, contacts: s.contacts || [] });
        setIsLoading(false);
      }
    };
    getSettings();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/api/settings", {
      youtubeChannelId: settings.youtubeChannelId,
      siteName: settings.siteName,
      contacts: settings.contacts,
      logo: settings.logo,
      favicon: settings.favicon,
    });
    if (data.isSuccess) {
      history.push("/");
    }
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const updateContact = (index, key, value) => {
    setSettings((prev) => {
      const contacts = [...prev.contacts];
      contacts[index] = { ...contacts[index], [key]: value };
      return { ...prev, contacts };
    });
  };

  const addContact = () => {
    setSettings((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: "", phone: "" }],
    }));
  };

  const removeContact = (index) => {
    setSettings((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Site Name
        </Form.Label>
        <Col sm="10">
          <Form.Control
            value={settings.siteName || ""}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, siteName: e.target.value }))
            }
            type="text"
            placeholder="e.g. Anjuman-E-Zainee Kurla"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Youtube Video Id
        </Form.Label>
        <Col sm="10">
          <Form.Control
            value={settings.youtubeChannelId || ""}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, youtubeChannelId: e.target.value }))
            }
            type="text"
            placeholder="Youtube Channel / Video Id"
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Logo
        </Form.Label>
        <Col sm="10">
          {settings.logo && (
            <img
              src={settings.logo}
              alt="current logo"
              style={{ height: 60, marginBottom: 8, display: "block" }}
            />
          )}
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange("logo")}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Favicon
        </Form.Label>
        <Col sm="10">
          {settings.favicon && (
            <img
              src={settings.favicon}
              alt="current favicon"
              style={{ height: 32, marginBottom: 8, display: "block" }}
            />
          )}
          <Form.Control
            type="file"
            accept="image/x-icon,image/png,image/svg+xml"
            onChange={handleFileChange("favicon")}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Contacts
        </Form.Label>
        <Col sm="10">
          {settings.contacts.map((contact, i) => (
            <Row key={i} className="mb-2 align-items-center">
              <Col sm="5">
                <Form.Control
                  value={contact.name}
                  onChange={(e) => updateContact(i, "name", e.target.value)}
                  type="text"
                  placeholder="Name"
                />
              </Col>
              <Col sm="5">
                <Form.Control
                  value={contact.phone}
                  onChange={(e) => updateContact(i, "phone", e.target.value)}
                  type="text"
                  placeholder="Phone"
                />
              </Col>
              <Col sm="2">
                <Button variant="danger" size="sm" onClick={() => removeContact(i)}>
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" size="sm" onClick={addContact}>
            + Add Contact
          </Button>
        </Col>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
