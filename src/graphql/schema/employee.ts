import { gql } from "apollo-server-express";
import { NodeG } from "./common";
import {Scalars} from "apollo-server-core/src/plugin/schemaReporting/generated/operations";
import {Maybe} from "graphql/jsutils/Maybe";
import {User} from "./user";
import {Company} from "./company";
import {employees} from "../datasource/postgres/employee";

export const employeeTypeDef = gql`
    type Employee implements NodeG {
        id: ID!
        firstname: String
        lastname: String
        user: User
        company: Company
    }

    type Query {
        employees: [Employee!]! @hasRole(role: ADMIN)
    }
`;

export const employeeResolver = {
    Query: {
        employees: employees
    }
}

export type Employee = NodeG & {
    __typename?: 'Employee';
    id: Scalars['ID'];
    firstname?: Maybe<Scalars['String']>;
    lastname?: Maybe<Scalars['String']>;
    user?: Maybe<User>;
    company?: Maybe<Company>;
};