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
    const getVideoURL = async () => {
      const { data } = await api.get("/api/settings");
      if (data.isSuccess && data.settings) {
        setSettings(data.settings);
        setIsLoading(false);
      }
    };
    getVideoURL();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/api/settings", {
      videoURL: settings.videoURL,
      daarulImaratVideoURL: settings.daarulImaratVideoURL,
      audioURL: settings.audioURL,
      youtubeChannelId: settings.youtubeChannelId,
    });
    if (data.isSuccess) {
      history.push("/");
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Masjid Video URL
        </Form.Label>
        <Col sm="10">
          <Form.Control
            value={settings.videoURL}
            onChange={(e) =>
              setSettings((prev) => {
                return {
                  ...prev,
                  videoURL: e.target.value,
                };
              })
            }
            type="text"
            placeholder="URL"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Dar-ul-Imarat Video URL
        </Form.Label>
        <Col sm="10">
          <Form.Control
            value={settings.daarulImaratVideoURL}
            onChange={(e) =>
              setSettings((prev) => {
                return {
                  ...prev,
                  daarulImaratVideoURL: e.target.value,
                };
              })
            }
            type="text"
            placeholder="URL"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Audio URL
        </Form.Label>
        <Col sm="10">
          <Form.Control
            value={settings.audioURL}
            onChange={(e) =>
              setSettings((prev) => {
                return {
                  ...prev,
                  audioURL: e.target.value,
                };
              })
            }
            type="text"
            placeholder="Audio URL"
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Youtube Video Id
        </Form.Label>
        <Col sm="10">
          <Form.Control
            value={settings.youtubeChannelId}
            onChange={(e) =>
              setSettings((prev) => {
                return {
                  ...prev,
                  youtubeChannelId: e.target.value,
                };
              })
            }
            type="text"
            placeholder="Youtube Video Id"
          />
        </Col>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
