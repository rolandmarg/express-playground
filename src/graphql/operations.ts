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
      ...MeetingFields
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
