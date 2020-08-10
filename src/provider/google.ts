import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import { Provider } from './entity';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../utils';

const normalizeProvider = (
  accessToken: string,
  refreshToken: string,
  profile: GoogleStrategy.Profile
) => {
  const provider = new Provider();

  provider.providerId = profile.id;
  provider.provider = profile.provider;
  provider.accessToken = accessToken;
  provider.refreshToken = refreshToken;
  provider.displayName = profile.displayName;

  if (profile.emails && profile.emails.length) {
    provider.email = profile.emails[0].value;
  }

  if (profile.photos && profile.photos.length) {
    provider.photo = profile.photos[0].value;
  }

  const firstName = profile.name?.givenName;
  const lastName = profile.name?.familyName;
  if (firstName && lastName) {
    provider.fullName = firstName + ' ' + lastName;
  }

  return provider;
};

passport.use(
  new GoogleStrategy.OAuth2Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const provider = normalizeProvider(accessToken, refreshToken, profile);

      return done(null, provider);
    }
  )
);

export const googleAuth = passport.authenticate('google', {
  session: false,
  scope: ['email', 'profile'],
});

export const googleAuthCallback = passport.authenticate('google', {
  session: false,
});
