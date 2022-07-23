const {ExtractJwt, Strategy} = require('passport-jwt');

const UserModel = require('../user/user.model.js');
const {UnauthorizedError} = require('../middleware/errorHandler.js');
const {JWT_SECRET} = require('../utils/secret.js');

const jwtStrategy = new Strategy(
	{
		secretOrKey: JWT_SECRET,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	},
	async (payload, done) => {
		try {
			const {email} = payload;
			const foundUser = await UserModel.findOne({where: {email}});
			if (!foundUser) throw new UnauthorizedError();

			done(null, foundUser);
		} catch (err) {
			done(err, false);
		}
	}
);

module.exports = {jwtStrategy};
