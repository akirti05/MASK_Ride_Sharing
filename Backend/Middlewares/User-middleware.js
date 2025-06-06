const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    // Redirect to login page if no token
    // return res.redirect("/login");
    return res.send("no token passed");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // Redirect to login page if token is invalid
      // return res.redirect("/login");
      return res.send("wrong token");
    }
    req.user = user;
    console.log("user authenticated");
    next();
  });
}

module.exports = { authenticate };
