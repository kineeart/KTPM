module.exports = {
  googleLogin: jest.fn(),
  userLoginWith: jest.fn(),
  signup: jest.fn(),
  signupAdmin: jest.fn(),
  login: jest.fn(),
  verifyResetPass: jest.fn(),
  logout: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  changeStateUser: jest.fn(),
  verifyUser: jest.fn(),
  updatePassword: jest.fn(),

  protect: (req, res, next) => {
    req.user = { id: "test-user", role: "user" };
    next();
  },

  restrictTo: () => (req, res, next) => next(),

  isLoggedIn: (req, res, next) => {
    res.locals.user = null;
    next();
  }
};
