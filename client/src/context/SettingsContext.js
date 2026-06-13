import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api.util";

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get("/api/settings").then(({ data }) => {
      if (data.isSuccess && data.settings) {
        const s = data.settings;
        setSettings(s);

        if (s.siteName) {
          document.title = s.siteName;
        }

        if (s.favicon) {
          let link = document.querySelector("link[rel='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = s.favicon;
        }
      }
    });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
