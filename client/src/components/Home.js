import React, { useEffect, useState } from "react";
import api from "../utils/api.util";
import "./Home.css";
import { Loading } from "./Loading";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useAuth } from "../hooks/useProvideAuth";
import { YouTube } from "./YouTube";

const VideoType = {
  AudioVideo: 1,
  AudioOnly: 2,
};

export function Home() {
  const [settings, setSettings] = useState();
  const [videoType, setVideoType] = useState(VideoType.AudioVideo);
  const auth = useAuth();
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
  }, [auth]);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      {settings && (
        <Container className="h-100 flex-column d-flex home-container" fluid>
          {settings.youtubeChannelId && (
            <Row className="mb-3">
              <Col>
                <Button
                  className="video-type__btn video-type__btn--av"
                  variant={
                    videoType === VideoType.AudioVideo ? "success" : "primary"
                  }
                  onClick={() => setVideoType(VideoType.AudioVideo)}
                >
                  Server A
                </Button>
                <Button
                  className="video-type__btn"
                  variant={
                    videoType === VideoType.AudioOnly ? "success" : "primary"
                  }
                  onClick={() => setVideoType(VideoType.AudioOnly)}
                >
                  Server B
                </Button>
              </Col>
            </Row>
          )}

          <Row style={{ flex: 1 }}>
            <Col>
              {videoType === VideoType.AudioVideo ? (
                <div className="full-size video-container">
                  <iframe
                    height="100%"
                    width="100%"
                    title="Video"
                    src={
                      videoType === VideoType.AudioVideo
                        ? settings.videoURL
                        : settings.audioURL
                    }
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <YouTube settings={settings}></YouTube>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}
