import {gql} from "apollo-server-express";
import {Scalars} from "apollo-server-core/src/plugin/schemaReporting/generated/operations";
import {login, signup} from "../datasource/postgres/auth";

export const authTypeDef = gql`
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

  input InputLogin {
    email: String!
    password: String!
  }

  type LoginResult {
    token: String!
  }
  
  type Query {
    login(param: InputLogin!): LoginResult!
  }
`;

export const authResolver = {
  Mutation: {
    signup: signup
  },
  Query: {
    login: login
  }
}

export type InputSignup = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  company: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}

export type InputLogin = {
  email: Scalars['String'];
  password: Scalars['String'];
};
