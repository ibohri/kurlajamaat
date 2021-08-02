require("dotenv").config({
  path: __dirname + "/.env",
});
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./config");
const userRoutes = require("./routes/user.route");
const loginRoutes = require("./routes/login.route");
const settingsRoutes = require("./routes/settings.route");
const passport = require("passport");
const { configure } = require("./config/websocket.config");
const distDir = "../client/build";
const app = express();
const server = app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser(process.env.SECRET));
app.use(
  require("express-session")({
    secret: "kjaamat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, distDir)));

app.get("/login", (req, res) => {
  res.json({
    login: true,
  });
});

app.use(
  "/api/user",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
    failureRedirect: "/login",
  }),
  userRoutes
);

app.use(
  "/api/settings",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
    failureRedirect: "/login",
  }),
  settingsRoutes
);
app.use("/api", loginRoutes);

app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/index.html`));
  return;
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server started on port ${process.env.PORT || 3001}`);
});

setTimeout(() => configure(server), 5 * 1000);
