import { gql } from "apollo-server-express";
import { NodeG } from "./common";
import { Scalars } from "apollo-server-core/src/plugin/schemaReporting/generated/operations";
import { Maybe } from "graphql/jsutils/Maybe";
import {companies} from "../datasource/postgres/company";

export const companyTypeDef = gql`
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
}

export type Company = NodeG & {
    __typename?: 'Company';
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
};
