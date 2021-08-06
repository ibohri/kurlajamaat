import {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../utils/api.util";
import axios from "axios";
import socket from "../socket";
import { useHistory, useLocation } from "react-router-dom";

export function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const signout = useCallback(async () => {
    setUser(null);
    socket.offAny();
    await api.get("/api/logout");
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    if (user) {
      socket.on(user._id, (data) => {
        if (data.type === "LOGOUT") {
          signout();
          // window.location.href = "/login";
        }
      });
    } else {
      socket.offAny();
    }
  }, [signout, user]);

  useEffect(() => {
    const getUser = async () => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        setUser(JSON.parse(userJson));
      } else {
        const { data } = await api.get(`api/user/current`);
        if (data.isSuccess && data.user) {
          setUser(data.user);
          history.replace(from);
        }
      }
      setLoading(false);
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signin = async (username, password) => {
    try {
      const { data } = await axios.post("/api/login", {
        username,
        password,
      });
      if (data && data.isSuccess) {
        setUser(data.user);
        history.replace(from);
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return {
    user,
    loading,
    signin,
    signout,
    updateUser,
  };
}

const authContext = createContext();

export function useAuth() {
  return useContext(authContext);
}

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
