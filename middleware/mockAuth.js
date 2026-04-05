function mockAuth(req, res, next) {
  const userId = req.header("x-user-id") || 1;

  req.user = {
    id: userId,
    role: 0 // default Admin
  };

  next();
}

module.exports = mockAuth;