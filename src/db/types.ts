export type Meeting = {
  id: number;
  title: string;
  startsAt: Date;
  endsAt: Date;
};

export type MeetingIn = Omit<Meeting, 'id'>;

export type User = {
  id: number;
  email: string;
  providers?: Provider[];
};

export type Provider = {
  id: number;
  providerName: string;
  providerId: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  photo?: string;
  displayName?: string;
  fullName?: string;
  user: User;
};

export type ProviderIn = Omit<Provider, 'id' | 'user'>;
