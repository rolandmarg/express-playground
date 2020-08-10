import { gql } from 'apollo-server-express';

export const userFragment = gql`
  fragment UserFields on User {
    id
    email
    createdAt
  }
`;

export const meQuery = gql`
  query Me {
    me {
      ...UserFields
    }
  }
  ${userFragment}
`;

export const userQuery = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${userFragment}
`;

export const usersQuery = gql`
  query Users {
    users {
      ...UserFields
    }
  }
  ${userFragment}
`;
