import { gql } from "apollo-server-express";
import { users } from "../datasource/postgres/user";
export const userTypeDef = gql `
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
};
