const {ExtractJwt, Strategy} = require('passport-jwt');
const GitHubStrategy = require('passport-github2').Strategy;

const UserModel = require('../user/user.model.js');
const UserService = require('../user/user.service.js');
const {UnauthorizedError} = require('../middleware/errorHandler.js');
const {JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = require('../utils/secret.js');

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

const githubStrategy = new GitHubStrategy(
	{
		clientID: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET,
		callbackURL: 'http://localhost:5000/api/user/auth/github/callback',
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const data = {
				firstName: profile['_json'].name,
				lastName: profile['_json'].name,
				email: `${profile['_json'].login}@github.com`,
				register: 'github',
			};

			const foundUser = await UserModel.findOne({where: {email: data.email}});
			const user = foundUser ? foundUser : await UserService.create(data);

			done(null, user);
		} catch (err) {
			done(err, false);
		}
	}
);

module.exports = {jwtStrategy, githubStrategy};
