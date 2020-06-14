

const authContext = ({ req, ...rest }) => {
  if (req.headers) {
    const { x_user } = req.headers;
    req.user = x_user;
  }
  return { req, ...rest }
};

module.exports = authContext;
