import {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

export function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const signout = useCallback(async () => {
    await axios.post("/api/logout");
    history.push("/login");
  }, [history]);

  useEffect(() => {
    const getUser = async () => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        setUser(JSON.parse(userJson));
      } else {
        const { data } = await axios.get(`api/user/current`);
        if (data.isSuccess && data.user) {
          setUser(data.user);
          history.replace(from);
        } else {
          signout();
        }
      }
      setLoading(false);
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signin = async (username, password) => {
    const { data } = await axios.post("/api/login", {
      username,
      password,
    });
    if (data && data.isSuccess) {
      setUser(data.user);
      history.replace(from);
    }
  };

  return {
    user,
    loading,
    signin,
    signout,
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
