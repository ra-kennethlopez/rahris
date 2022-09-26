import { gql } from "apollo-server-express";
import { companies } from "../datasource/postgres/company";
export const companyTypeDef = gql `
    type Company implements NodeG {
        id: ID!
        name: String
    }

    type Query {
        companies: [Company!]! @hasRole(role: ADMIN)
    }
`;
export const companyResolver = {
    Query: {
        companies: companies
    }
};
