import { gql } from 'apollo-server-express';

export const user = gql`
  fragment UserFields on User {
    id
    email
    createdAt
  }
`;

export const meeting = gql`
  fragment MeetingFields on Meeting {
    id
    title
    startsAt
    endsAt
  }
`;
