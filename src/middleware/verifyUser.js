export const verifyUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Logged in successfully" });
    });
  });
};

