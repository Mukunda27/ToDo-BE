const jwt = require("jsonwebtoken");

// Generate an Access Token for the given User ID
const generateAccessToken = (userId) => {
  const expiresIn = "1h";
  const secret = "mason_mount_is_a special_player";

  const token = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    subject: userId.toString(),
  });

  return token;
};

module.exports = {
  generateAccessToken: generateAccessToken,
};
