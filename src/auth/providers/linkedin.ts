import passport from 'passport';
import LinkedinStrategy from 'passport-linkedin-oauth2';
import { Provider } from '../../entity/Provider';
import { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET } from '../../utils';

const normalizeProvider = (
  accessToken: string,
  refreshToken: string,
  profile: LinkedinStrategy.Profile
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
  new LinkedinStrategy.Strategy(
    {
      clientID: LINKEDIN_CLIENT_ID,
      clientSecret: LINKEDIN_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
    } as LinkedinStrategy.StrategyOption,
    (accessToken, refreshToken, profile, done) => {
      const provider = normalizeProvider(accessToken, refreshToken, profile);

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
