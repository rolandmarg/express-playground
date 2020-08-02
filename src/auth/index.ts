import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import { getRepository } from 'typeorm';
import { User } from '../entity';

passport.use(
  new GoogleStrategy.OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const userRepository = getRepository(User);

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
