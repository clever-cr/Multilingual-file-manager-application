import passport from "../config/passportConfig.js";

export const authenticateLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User doesn't exist or incorrect credentials" });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res
        .status(200)
        .json({ message: "User logged in successfully", user });
    });
  })(req, res, next);
};
