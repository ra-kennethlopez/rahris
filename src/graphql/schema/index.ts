import _ from "lodash";
import {commonTypeDef} from "./common";
import {companyResolver, companyTypeDef} from "./company";
import {employeeResolver, employeeTypeDef} from "./employee";
import {userResolver, userTypeDef} from "./user";
import {authResolver, authTypeDef} from "./auth";

export const typeDefs = [
  commonTypeDef,
  companyTypeDef,
  employeeTypeDef,
  userTypeDef,
  authTypeDef
]

export const resolvers = _.merge(
  {},
  userResolver,
  employeeResolver,
  companyResolver,
  authResolver
)