import React from "react";
import "./Home.css";
import { TwitchEmbed } from "react-twitch-embed";

export function TwitchHome() {
  return (
    <div className="full-size video-container">
      <TwitchEmbed
        channel="kurlajamaat"
        id="kurlajamaat"
        theme="dark"
        muted
        withChat={false}
      />
    </div>
  );
}
