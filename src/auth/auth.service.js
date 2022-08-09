const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../user/user.model.js');
const {NotFoundError, ForbiddenError} = require('../middleware/errorHandler.js');
const {JWT_SECRET} = require('../utils/secret.js');

const githubAuthenticate = async (data) => {
  const {email, register} = data;

  const foundUser = await UserModel.findOne({where: {email: email}});
  if (!foundUser) throw new NotFoundError('User does not exist.');

  const token = jwt.sign({email, register, userId: foundUser.id, role: foundUser.role}, JWT_SECRET);

  return {token, userId: foundUser.id, role: foundUser.role};
};

const passwordAuthenticate = async (data) => {
  const {email, password, register} = data;

  const foundUser = await UserModel.findOne({where: {email: email}});
  if (!foundUser) throw new NotFoundError('User does not exist.');

  if (password) {
    const matchedPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchedPassword) throw new ForbiddenError('Password is not correct.');
  }

  const token = jwt.sign({email, register, userId: foundUser.id, role: foundUser.role}, JWT_SECRET);

  return {token, userId: foundUser.id, role: foundUser.role};
};

module.exports = {githubAuthenticate, passwordAuthenticate};
