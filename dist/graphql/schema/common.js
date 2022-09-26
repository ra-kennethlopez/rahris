import { gql } from "apollo-server-express";
export const commonTypeDef = gql `
  """
  Should only
  """
  directive @hasRole(role: Role!) on FIELD_DEFINITION

  enum Role {
    ADMIN
    GUEST
  }

  interface NodeG {
    id: ID! @deprecated
  }

`;
