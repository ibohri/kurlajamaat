import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import YTPlayer from "yt-player";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaPauseCircle } from "react-icons/fa";
import { RiFullscreenLine } from "react-icons/ri";
import { RiFullscreenExitLine } from "react-icons/ri";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Loading } from "./Loading";

export function YouTube({ settings }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [volume, setVolume] = useState(80);
  const player = useRef();
  const playerElem = useRef();
  const dummyRef = useRef();

  useEffect(() => {
    player.current?.setVolume(volume);
  }, [volume]);

  const onPlayClick = () => {
    if (!isPlaying) {
      setIsPlaying((prev) => !prev);
      player.current.play();
      player.current.setSize("100%", "100%");
      dummyRef.current.focus();
    }
  };

  useEffect(() => {
    if (player.current) player.current.destroy();
    if (settings?.youtubeChannelId && playerElem.current) {
      player.current = new YTPlayer(playerElem.current, {
        controls: false,
        related: false,
        annotations: false,
      });
      player.current.load(settings.youtubeChannelId);
      player.current.on("ended", () => {
        setIsPlaying(false);
      });
      player.current.on("cued", () => {
        setIsLoading(false);
      });
    }
  }, [settings?.youtubeChannelId, player]);

  const goFullScreen = () => {
    document.documentElement.requestFullscreen();
    setFullScreen(true);
  };

  const exitFullScreen = () => {
    document.exitFullscreen();
    setFullScreen(false);
  };

  const onVolumeChange = (val) => {
    setVolume(val);
  };

  return (
    <div
      className={`video-container full-size ${
        isPlaying ? "video-container--playing" : ""
      } ${fullScreen ? "full-screen" : ""}`}
    >
      <div tabIndex={0} ref={dummyRef}></div>
      <div ref={playerElem}></div>
      <div
        className="placeholder full-size"
        style={{
          background: isPlaying ? "transparent" : "black",
        }}
      >
        {isLoading ? (
          <Loading />
        ) : !isPlaying ? (
          <AiFillPlayCircle
            className="play-pause-btn"
            onClick={onPlayClick}
            style={{
              fontSize: "70px",
              color: "#FF0000",
              cursor: "pointer",
            }}
          />
        ) : (
          <FaPauseCircle
            className="play-pause-btn"
            onClick={onPlayClick}
            style={{
              fontSize: "70px",
              color: "#FF0000",
              cursor: "pointer",
            }}
          />
        )}
      </div>
      <div className="controls">
        <div className="slider">
          <Slider
            value={volume}
            onChange={onVolumeChange}
            style={{ width: "100px", marginLeft: "20px" }}
          />
        </div>
        <div style={{ flex: 1 }}></div>
        <div className="full-screen-btn">
          {!fullScreen ? (
            <RiFullscreenLine
              size={30}
              color={"white"}
              onClick={goFullScreen}
            />
          ) : (
            <RiFullscreenExitLine
              size={30}
              color={"white"}
              onClick={exitFullScreen}
            />
          )}
        </div>
      </div>
    </div>
  );
}
