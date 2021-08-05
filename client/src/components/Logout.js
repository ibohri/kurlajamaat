import React, { useEffect } from "react";
import { useAuth } from "../hooks/useProvideAuth";

export function Logout() {
  const auth = useAuth({ forceLogout: true });

  useEffect(() => {
    auth.signout();
  }, [auth]);

  return <></>;
}
