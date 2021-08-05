import React, { useEffect, useState } from "react";
import api from "../utils/api.util";
import "./Home.css";
import { Loading } from "./Loading";
import { useAuth } from "../hooks/useProvideAuth";

export function Home() {
  const [videoRef, setVideoRef] = useState();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getVideoURL = async () => {
      const { data } = await api.get("/api/settings");
      if (data.isSuccess && data.settings) {
        setVideoRef(
          auth.user.relayFrom === "Masjid"
            ? data.settings.videoURL
            : data.settings.daarulImaratVideoURL
        );
        setIsLoading(false);
      }
    };
    getVideoURL();
  }, [auth]);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      {videoRef && (
        <div className="full-size video-container">
          <iframe
            height="70%"
            width="70%"
            title="Video"
            src={videoRef}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  );
}
