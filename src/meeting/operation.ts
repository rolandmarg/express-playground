import { gql } from 'apollo-server-express';

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
    $startsAt: DateTime!
    $endsAt: DateTime!
  ) {
    createMeeting(title: $title, startsAt: $startsAt, endsAt: $endsAt) {
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
