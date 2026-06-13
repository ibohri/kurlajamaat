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
    if (data.isSuccess) history.push("/");
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSettings((prev) => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const updateContact = (index, key, value) => {
    setSettings((prev) => {
      const contacts = [...prev.contacts];
      contacts[index] = { ...contacts[index], [key]: value };
      return { ...prev, contacts };
    });
  };

  const addContact = () =>
    setSettings((prev) => ({ ...prev, contacts: [...prev.contacts, { name: "", phone: "" }] }));

  const removeContact = (index) =>
    setSettings((prev) => ({ ...prev, contacts: prev.contacts.filter((_, i) => i !== index) }));

  if (isLoading) return <Loading />;

  const field = (label, content) => (
    <Form.Group as={Row} className="mb-4 align-items-start">
      <Form.Label column sm="3" style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.88rem", paddingTop: "0.6rem" }}>
        {label}
      </Form.Label>
      <Col sm="9">{content}</Col>
    </Form.Group>
  );

  return (
    <div className="page-card">
      <div className="page-title">Application Settings</div>
      <Form onSubmit={onSubmit}>
        {field("Site Name",
          <Form.Control
            value={settings.siteName || ""}
            onChange={(e) => setSettings((p) => ({ ...p, siteName: e.target.value }))}
            type="text"
            placeholder="e.g. Anjuman-E-Zainee Kurla"
          />
        )}

        {field("YouTube Video ID",
          <Form.Control
            value={settings.youtubeChannelId || ""}
            onChange={(e) => setSettings((p) => ({ ...p, youtubeChannelId: e.target.value }))}
            type="text"
            placeholder="YouTube Channel / Video ID"
          />
        )}

        {field("Logo",
          <>
            {settings.logo && (
              <img src={settings.logo} alt="logo preview" style={{ height: 72, borderRadius: 8, marginBottom: 10, display: "block", border: "1px solid var(--border)" }} />
            )}
            <Form.Control type="file" accept="image/*" onChange={handleFileChange("logo")} />
          </>
        )}

        {field("Favicon",
          <>
            {settings.favicon && (
              <img src={settings.favicon} alt="favicon preview" style={{ height: 32, marginBottom: 10, display: "block", border: "1px solid var(--border)", borderRadius: 4 }} />
            )}
            <Form.Control type="file" accept="image/x-icon,image/png,image/svg+xml" onChange={handleFileChange("favicon")} />
          </>
        )}

        {field("Contacts",
          <>
            {settings.contacts.map((contact, i) => (
              <Row key={i} className="mb-2 align-items-center g-2">
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
                  <Button variant="outline-danger" size="sm" onClick={() => removeContact(i)} style={{ borderRadius: 8 }}>
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={addContact} style={{ borderRadius: 8, marginTop: 4 }}>
              + Add Contact
            </Button>
          </>
        )}

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
          <Button variant="primary" type="submit" style={{ minWidth: 120 }}>
            Save Settings
          </Button>
          <Button variant="outline-secondary" className="ms-3" onClick={() => history.push("/")} style={{ minWidth: 80 }}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
