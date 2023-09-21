import { gql } from "apollo-server-express";

export default gql`
  scalar DateTimeISO

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type AccessToken {
    accessToken: String!
  }
`;
