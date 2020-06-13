

const authContext = ({ req, ...rest }) => {
  if (req.headers) {
    const { authorization: token } = req.headers;
    req.token = token;
  }
  //if (!req.headers.x_user) throw new Error("PROVIDE USER ID")
  return { req, ...rest }
};

module.exports = authContext;

// user: async (_, args, { req }) => {
//   const { token } = req;
//   const { error } = await isTokenValid(token);
//   if (error) {
//     throw new Error(error);
//   }
//   return {
//     id: 1,
//     username: "oliver-ke"
//   }
// },