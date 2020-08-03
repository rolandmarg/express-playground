import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  directive @auth on OBJECT | FIELD_DEFINITION

  type User {
    id: ID!
    email: String!
    createdAt: String!
  }

  type Meeting {
    id: ID!
    title: String!
    startsAt: String!
    endsAt: String!
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
    viewer: User @auth
    meetings: [Meeting!]!
    meeting(id: ID!): Meeting
  }

  type Mutation {
    createMeeting(input: CreateMeetingInput!): CreateMeetingPayload!
    deleteMeetings: Boolean!
  }
`;
