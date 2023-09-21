import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    surveyResult(surveyID: String): SurveyResult!
  }
  extend type Mutation {
    addAnswer(surveyId: String!, answer: String!): SurveyResult!
  }

  type SurveyResult {
    surveyId: String!
    question: String!
    date: DateTimeISO!
    answers: [Answer!]!
  }

  type Answer {
    image: String
    answer: String!
    count: Int!
    percent: Float!
    isCurrentAnswer: Boolean
  }
`;
