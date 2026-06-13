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
import { SettingsProvider } from "./context/SettingsContext";
import { TopBar } from "./components/TopBar";

import "./App.css";
import { AddUser } from "./components/AddUser";
import { Loading } from "./components/Loading";
import { TwitchHome } from "./components/Twitch";
import { Logout } from "./components/Logout";
import { ChangePassword } from "./components/ChangePassword";
import { LoggedInUsers } from "./components/LoggedInUsers";

export function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (auth.loading) {
          return <Loading />;
        }
        if (auth.user) {
          // if (auth.user.mustChangePassword) {
          //   return (
          //     <Redirect
          //       to={{
          //         pathname: "/changePassword",
          //       }}
          //     />
          //   );
          // }
          return children;
        }
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
}

function App() {
  return (
    <Router>
      <SettingsProvider>
      <ProvideAuth>
        <div className="full-size app-container">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>

            <div className="child-container">
              <TopBar />
              <PrivateRoute path="/users">
                <div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}><Users /></div>
              </PrivateRoute>
              <PrivateRoute path="/logged-in-users">
                <div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}><LoggedInUsers /></div>
              </PrivateRoute>
              <PrivateRoute path="/settings">
                <div style={{ padding: "1.5rem", maxWidth: 860, margin: "0 auto" }}><Settings /></div>
              </PrivateRoute>
              <PrivateRoute path="/editUser/:id?">
                <div style={{ padding: "1.5rem", maxWidth: 700, margin: "0 auto" }}><AddUser /></div>
              </PrivateRoute>
              <PrivateRoute path="/twitch">
                <TwitchHome />
              </PrivateRoute>
              <PrivateRoute path="/vimeo">
                <Home />
              </PrivateRoute>
              <PrivateRoute path="/changePassword">
                <div style={{ padding: "1.5rem", maxWidth: 700, margin: "0 auto" }}><ChangePassword /></div>
              </PrivateRoute>
              <PrivateRoute path="/" exact={true}>
                <Home />
              </PrivateRoute>
            </div>
          </Switch>
        </div>
      </ProvideAuth>
      </SettingsProvider>
    </Router>
  );
}

export default App;
