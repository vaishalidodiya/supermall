function isAuthenticated(req, res, next) {
  console.log("Session userId:", req.session.userId);
  if (req.session && req.session.userId) return next();
  return res.redirect("/");
}

module.exports = isAuthenticated;
