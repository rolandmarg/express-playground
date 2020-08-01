import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  directive @auth on OBJECT | FIELD_DEFINITION

  type User {
    id: ID!
    email: String!
    createdAt: String!
  }

  type CalendarEvent {
    id: ID!
    title: String!
    startsAt: String!
    endsAt: String!
  }

  input CreateCalendarEventInput {
    title: String!
    startsAt: String!
    endsAt: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  union SignInResult = SignInPayload | SignInError

  type SignInPayload {
    user: User!
    token: String!
  }

  type SignInError {
    message: String!
  }

  type CreateCalendarEventPayload {
    calendarEvent: CalendarEvent
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    viewer: User @auth
    calendarEvents: [CalendarEvent!]!
    calendarEvent(id: ID!): CalendarEvent
  }

  type Mutation {
    signIn(input: SignInInput!): SignInResult!
    createCalendarEvent(
      input: CreateCalendarEventInput!
    ): CreateCalendarEventPayload!
    deleteCalendarEvents: Boolean
  }
`;
