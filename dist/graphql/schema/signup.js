import { gql } from "apollo-server-express";
import { signup } from "../datasource/postgres/signup";
export const signUpTypeDef = gql `
  input InputSignup {
    firstname: String!
    lastname: String!
    company: String!
    email: String!
    password: String!
  }

  type SignupResult {
    token: String!
  }

  type Mutation {
    signup(param: InputSignup!): SignupResult!
  }
`;
export const signUpResolver = {
    Mutation: {
        signup: signup
    }
};
