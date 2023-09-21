import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    surveys: [Survey!]!
  }
  extend type Mutation {
    addSurvey(question: String!): Survey!
  }

  type Survey {
    id: ID!
    question: String!
    date: DateTimeISO!
    didAnswer: Boolean
    answers: [Answer!]!
  }

  type Answer {
    image: String
    answer: String!
  }
`;
