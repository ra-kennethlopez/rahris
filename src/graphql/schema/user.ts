import { gql } from "apollo-server-express";
import { NodeG } from "./common";
import { Scalars } from "apollo-server-core/src/plugin/schemaReporting/generated/operations";
import { Maybe } from "graphql/jsutils/Maybe";
import {users} from "../datasource/postgres/user";

export const userTypeDef = gql`
    type User implements NodeG {
        id: ID!
        email: String!
    }

    type Query {
        users: [User!]! @hasRole(role: ADMIN)
    }
`;

export const userResolver = {
    Query: {
        users: users
    }
}

export type User = NodeG & {
    __typename?: 'User';
    id: Scalars['ID'];
    email?: Maybe<Scalars['String']>;
};