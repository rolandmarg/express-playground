import { gql } from 'apollo-server-express';

export const userFragment = gql`
  fragment UserFields on User {
    id
    email
    createdAt
  }
`;

export const meetingFragment = gql`
  fragment MeetingFields on Meeting {
    id
    title
    startsAt
    endsAt
  }
`;

export const pageInfoFragment = gql`
  fragment PageInfoFields on PageInfo {
    startCursor
    endCursor
    hasNextPage
    hasPreviousPage
  }
`;

export const createMeetingMutation = gql`
  mutation CreateMeeting(
    $title: String!
    $startsAt: String!
    $endsAt: String!
  ) {
    createMeeting(
      input: { title: $title, startsAt: $startsAt, endsAt: $endsAt }
    ) {
      meeting {
        ...MeetingFields
      }
    }
  }
  ${meetingFragment}
`;

export const deleteMeetingsMutation = gql`
  mutation DeleteMeetings {
    deleteMeetings
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

export const meetingQuery = gql`
  query Meeting($id: ID!) {
    meeting(id: $id) {
      ...MeetingFields
    }
  }
  ${meetingFragment}
`;

export const meetingsQuery = gql`
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
  ${meetingFragment}
  ${pageInfoFragment}
`;
