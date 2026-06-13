import React, { useEffect, useState } from "react";
import api from "../utils/api.util";
import "./Home.css";
import { Loading } from "./Loading";
import { Row, Col, Container } from "react-bootstrap";
import { useAuth } from "../hooks/useProvideAuth";
import { YouTube } from "./YouTube";
import { Link } from "react-router-dom";

export function Home() {
  const [settings, setSettings] = useState();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSettings = async () => {
      const { data } = await api.get("/api/settings");
      if (data.isSuccess && data.settings) {
        setSettings(data.settings);
        setIsLoading(false);
      }
    };
    getSettings();
  }, [auth]);

  if (isLoading) return <Loading />;

  if (!settings?.youtubeChannelId) {
    const isAdmin = auth.user?.role === "Admin";
    return (
      <Container className="h-100 d-flex align-items-center justify-content-center" fluid>
        <div style={{ textAlign: "center", color: "#ccc" }}>
          {isAdmin ? (
            <>
              <p>No YouTube video configured.</p>
              <Link to="/settings">Go to Settings to add a YouTube Video ID</Link>
            </>
          ) : (
            <p>No live stream is currently available. Please check back later.</p>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="h-100 flex-column d-flex home-container" fluid>
      <Row style={{ flex: 1 }}>
        <Col>
          <YouTube settings={settings} />
        </Col>
      </Row>
    </Container>
  );
}
