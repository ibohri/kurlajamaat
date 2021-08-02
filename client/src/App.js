import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import { Settings } from "./components/Settings";
import { Users } from "./components/Users";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { useAuth, ProvideAuth } from "./hooks/useProvideAuth";
import { TopBar } from "./components/TopBar";

import "./App.css";
import { AddUser } from "./components/AddUser";
import { Loading } from "./components/Loading";
import { TwitchHome } from "./components/Twitch";

export function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.loading ? (
          <Loading />
        ) : auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  return (
    <Router>
      <ProvideAuth>
        <div className="full-size app-container">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <div className="child-container">
              <TopBar />
              <div className="full-size p-3">
                <PrivateRoute path="/users">
                  <Users />
                </PrivateRoute>
                <PrivateRoute path="/settings">
                  <Settings />
                </PrivateRoute>
                <PrivateRoute path="/" exact={true}>
                  <Home />
                </PrivateRoute>
                <PrivateRoute path="/editUser/:id?">
                  <AddUser />
                </PrivateRoute>
                <PrivateRoute path="/twitch">
                  <TwitchHome />
                </PrivateRoute>
                <PrivateRoute path="/vimeo">
                  <Home />
                </PrivateRoute>
              </div>
            </div>
          </Switch>
        </div>
      </ProvideAuth>
    </Router>
  );
}

export default App;
