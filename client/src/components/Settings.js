import React, { useState } from "react";
import { useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Loading } from "./Loading";

export function Settings() {
  const history = useHistory();
  const [videoURL, setVideoURL] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getVideoURL = async () => {
      const { data } = await axios.get("/api/settings");
      if (data.isSuccess && data.settings) {
        setVideoURL(data.settings.videoURL);
        setIsLoading(false);
      }
    };
    getVideoURL();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post("/api/settings", { videoURL });
    if (response.isSuccess) {
      history.push("/");
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          URL
        </Form.Label>
        <Col sm="10">
          <Form.Control
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            type="text"
            placeholder="URL"
          />
        </Col>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
