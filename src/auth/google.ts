import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { Unauthorized } from '../utils';
import env from '../env';

passport.use(
  new GoogleStrategy.OAuth2Strategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const userRepository = getRepository(User);

      if (!profile.emails || !profile.emails.length) {
        return done(new Unauthorized('Email not provided'), null);
      }

      const email = profile.emails[0].value;

      let user = await userRepository.findOne({ email });
      if (!user) {
        user = await userRepository.save({ email });
      }

      return done(null, user);
    }
  )
);

export const googleAuth = passport.authenticate('google', {
  session: false,
  scope: ['email', 'profile'],
});

export const googleAuthCallback = passport.authenticate('google', {
  session: false,
  failureRedirect: '/login',
});
