import { gql } from 'apollo-server-express';
import * as fragments from './fragments';

export const createMeeting = gql`
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
  ${fragments.meeting}
`;

export const deleteMeetings = gql`
  mutation DeleteMeetings {
    deleteMeetings
  }
`;
