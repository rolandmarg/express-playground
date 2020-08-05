import { gql } from 'apollo-server-express';
import * as fragments from './fragments';

export const me = gql`
  query Me {
    me {
      ...UserFields
    }
  }
  ${fragments.user}
`;

export const user = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${fragments.user}
`;

export const users = gql`
  query Users {
    users {
      ...UserFields
    }
  }
  ${fragments.user}
`;

export const meeting = gql`
  query meeting($id: ID!) {
    meeting(id: $id) {
      ...MeetingFields
    }
  }
  ${fragments.meeting}
`;

export const meetings = gql`
  query meetings {
    meetings {
      ...MeetingFields
    }
  }
  ${fragments.meeting}
`;
