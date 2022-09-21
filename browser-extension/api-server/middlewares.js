const { user } = require("./db/models");

async function authentication(req, res, next) {
  console.log("---1");
  if (req.path.startsWith("/auth/")) {
    next();
  } else {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: "No credentials sent!" });
    } else {
      authorization = req.headers.authorization;
      token = authorization.split(" ")[1];
      const result = await user.findOne({
        where: {
          accessToken: token,
        },
      });
      if (result == null) {
        res.status(401).json({ error: "Unauthorized user" });
      } else {
        req.user = result;
        next();
      }
    }
  }
}

module.exports = {
  authentication,
};
