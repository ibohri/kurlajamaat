import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Loading } from "./Loading";

export function Home() {
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
          <iframe
            height="70%"
            width="70%"
            title="Video"
            src={videoRef}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            // style="position:absolute;top:0;left:0;width:100%;height:100%;"
          ></iframe>
        </div>
      )}
    </>
  );
}
