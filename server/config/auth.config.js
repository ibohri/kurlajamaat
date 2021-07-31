const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userRepo = require("../repository/user.repository");
const bcrypt = require("bcrypt");
const JwtCookieComboStrategy = require("passport-jwt-cookiecombo");

passport.use(
  new JwtCookieComboStrategy(
    {
      secretOrPublicKey: process.env.SECRET,
    },
    (payload, done) => {
      return done(null, payload.user);
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await userRepo.findOne({
      username: username,
    });

    if (!user) return done(null, false);
    // authenticate user here
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false);
    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userRepo.findOne({ _id: id });
  done(null, user);
});
