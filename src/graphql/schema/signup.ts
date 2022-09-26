import {gql} from "apollo-server-express";
import {Scalars} from "apollo-server-core/src/plugin/schemaReporting/generated/operations";
import {signup} from "../datasource/postgres/signup";
import exp from "constants";

export const signUpTypeDef = gql`
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
}

export type InputSignup = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  company: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}

export type ArgsInputSignup = {
  param: InputSignup
}