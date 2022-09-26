import { gql } from "apollo-server-express";
import { Scalars } from "apollo-server-core/src/plugin/schemaReporting/generated/operations";

export const commonTypeDef = gql`
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

export type NodeG = {
  id: Scalars['ID'];
};