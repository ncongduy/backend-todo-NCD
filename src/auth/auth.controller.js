const authService = require('./auth.service.js');
const {BadRequestError} = require('../middleware/errorHandler.js');

const githubAuthenticate = async (req, res, next) => {
  try {
    const data = req.user;
    const userAuthenticated = await authService.githubAuthenticate(data);

    return res.status(200).json(userAuthenticated);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

const passwordAuthenticate = async (req, res, next) => {
  try {
    const data = req.body;
    const userAuthenticated = await authService.passwordAuthenticate(data);

    return res.status(200).json(userAuthenticated);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

module.exports = {githubAuthenticate, passwordAuthenticate};
