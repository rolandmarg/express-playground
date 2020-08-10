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
    provider: String!
    email: String!
    accessToken: String!
    refreshToken: String
    gender: String
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

  type CreateMeetingPayload {
    meeting: Meeting!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    me: User @auth
    """
    'after: String' parameter may be date or opaque cursor passed from server
    """
    meetings(first: Int!, after: String): MeetingConnection!
    meeting(id: ID!): Meeting
  }

  type Mutation {
    createMeeting(input: CreateMeetingInput!): CreateMeetingPayload!
    deleteMeetings: Boolean!
  }
`;
