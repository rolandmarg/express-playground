import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  directive @auth on OBJECT | FIELD_DEFINITION

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Provider {
    id: ID!
    providerId: String!
    providerName: String!
    email: String!
    accessToken: String!
    refreshToken: String
    photo: String
    displayName: String
    fullName: String
  }

  type User {
    id: ID!
    email: String!
    createdAt: String!
    providers: [Provider!]!
  }

  type Meeting {
    id: ID!
    title: String!
    startsAt: String!
    endsAt: String!
  }

  type MeetingEdge {
    node: Meeting!
    cursor: String!
  }

  type MeetingConnection {
    edges: [MeetingEdge!]!
    pageInfo: PageInfo!
  }

  input CreateMeetingInput {
    title: String!
    startsAt: String!
    endsAt: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type Query {
    me: User @auth
    """
    'after: String' parameter may be date or opaque cursor passed from server
    """
    meetings(first: Int!, after: String): MeetingConnection!
  }

  type Mutation {
    createMeeting(input: CreateMeetingInput!): Meeting!
    deleteMeetings: Boolean
  }
`;
