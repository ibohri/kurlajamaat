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
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const { configure } = require("./socket");
const distDir = "../client/build";
const app = express();
app.use(cors());
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
    resave: false,
    saveUninitialized: true,
    // genid: (express) => uuidv4(),
  })
);

// app.get("*", function (req, res, next) {
//   if (req.headers["x-forwarded-proto"] !== "https") {
//     return res.redirect(["https://", req.get("Host"), req.url].join(""));
//   }
//   return next();
// });

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/build")));
app.use(express.static(path.join(__dirname, distDir)));

app.use("/api/user", userRoutes);

app.use(
  "/api/settings",
  passport.authenticate("jwt-cookiecombo", {
    session: false,
  }),
  settingsRoutes
);
app.use("/api", loginRoutes);

app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/index.html`));
  return;
});

const server = http.createServer(app);

configure(server);

server.listen(process.env.PORT || 3001, () => {
  console.log("listening on *:3001");
});
