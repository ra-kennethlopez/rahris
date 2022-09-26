import { gql } from "apollo-server-express";
import { employees } from "../datasource/postgres/employee";
export const employeeTypeDef = gql `
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
};
