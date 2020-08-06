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
  query Meeting($id: ID!) {
    meeting(id: $id) {
      ...MeetingFields
    }
  }
  ${fragments.meeting}
`;

export const meetings = gql`
  query Meetings($first: Int!, $after: String) {
    meetings(first: $first, after: $after) {
      edges {
        node {
          ...MeetingFields
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
  ${fragments.meeting}
  ${fragments.pageInfo}
`;
