import passport from 'passport';
import LinkedinStrategy from 'passport-linkedin-oauth2';
import { ProviderIn } from '../../db';
import {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  Unauthorized,
} from '../../utils';

const normalizeProvider = (
  accessToken: string,
  refreshToken: string,
  email: string,
  profile: LinkedinStrategy.Profile
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
  new LinkedinStrategy.Strategy(
    {
      clientID: LINKEDIN_CLIENT_ID,
      clientSecret: LINKEDIN_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
    } as LinkedinStrategy.StrategyOption,
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

export const linkedinAuth = passport.authenticate('linkedin', {
  session: false,
});

export const linkedinAuthCallback = passport.authenticate('linkedin', {
  session: false,
});
