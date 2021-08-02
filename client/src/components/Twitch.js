import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Loading } from "./Loading";
import { TwitchEmbed } from "react-twitch-embed";

export function TwitchHome() {
  const [videoRef, setVideoRef] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getVideoURL = async () => {
      const { data } = await axios.get("/api/settings");
      if (data.isSuccess && data.settings) {
        setVideoRef(data.settings.videoURL);
        setIsLoading(false);
      }
    };
    getVideoURL();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <>
      {videoRef && (
        <div className="full-size video-container">
          <TwitchEmbed
            channel="kurlajamaat"
            id="kurlajamaat"
            theme="dark"
            muted
            withChat={false}
          />
        </div>
      )}
    </>
  );
}
