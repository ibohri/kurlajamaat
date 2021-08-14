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
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [volume, setVolume] = useState(80);
  const player = useRef();
  const playerElem = useRef();
  const dummyRef = useRef();
  const timer = useRef();
  const youtubeChannelId = settings.youtubeChannelId;

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (isHovered) {
      timer.current = setTimeout(() => setIsHovered(false), 5 * 1000);
    }
  }, [isHovered]);

  const onContainerClick = () => {
    if (player.current) {
      if (isPlaying) {
        setIsPlaying(false);
        player.current.pause();
      } else {
        setIsPlaying(true);
        player.current.play();
      }
    }
  };

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
    if (youtubeChannelId && playerElem.current) {
      player.current = new YTPlayer(playerElem.current, {
        controls: false,
        related: false,
        annotations: false,
      });

      player.current.on("ended", () => {
        setIsPlaying(false);
      });
      player.current.on("cued", () => {
        setIsLoading(false);
      });

      player.current.on("paused", () => {
        setIsPlaying(false);
      });

      player.current.load(youtubeChannelId);
    }
  }, [youtubeChannelId, player]);

  const goFullScreen = (e) => {
    e.stopPropagation();
    document.documentElement.requestFullscreen();
    setFullScreen(true);
  };

  const exitFullScreen = (e) => {
    e.stopPropagation();

    document.fullscreenElement && document.exitFullscreen();
    setFullScreen(false);
  };

  const onVolumeChange = (val) => {
    setVolume(val);
  };

  const onControlsClick = (e) => {
    e.stopPropagation();
  };

  const onContainerMouseOver = () => {
    setIsHovered(true);
  };

  const onContainerMouseOut = () => {
    setIsHovered(false);
  };

  const onPauseClick = () => {
    player.current?.pause();
  };

  return (
    <div
      // onClick={onContainerClick}
      onMouseMove={onContainerMouseOver}
      onMouseOut={onContainerMouseOut}
      className={`video-container full-size ${
        isPlaying ? "video-container--playing" : ""
      } ${fullScreen ? "full-screen" : ""} ${
        isHovered ? " video-container--hovered" : ""
      }`}
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
        ) : isPlaying ? (
          <FaPauseCircle
            className="play-pause-btn"
            onClick={onPauseClick}
            style={{
              fontSize: "70px",
              color: "#FF0000",
              cursor: "pointer",
            }}
          />
        ) : (
          <AiFillPlayCircle
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
      <div className="controls" onClick={onControlsClick}>
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
