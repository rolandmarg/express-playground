import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';
import { ProviderIn } from '../../db';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  Unauthorized,
} from '../../utils';

const normalizeProvider = (
  accessToken: string,
  refreshToken: string,
  email: string,
  profile: GoogleStrategy.Profile
) => {
  const provider: ProviderIn = {
    email,
    providerId: profile.id,
    providerName: profile.provider,
    accessToken: accessToken,
    refreshToken: refreshToken,
    displayName: profile.displayName,
  };

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
      const emails = profile.emails;

      if (!emails || !emails.length) {
        return done(new Unauthorized('Email not provided'));
      }

      const email = emails[0].value;

      const provider = normalizeProvider(
        accessToken,
        refreshToken,
        email,
        profile
      );

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
