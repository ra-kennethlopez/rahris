import _ from "lodash";
import { commonTypeDef } from "./common";
import { companyResolver, companyTypeDef } from "./company";
import { employeeResolver, employeeTypeDef } from "./employee";
import { userResolver, userTypeDef } from "./user";
import { signUpResolver, signUpTypeDef } from "./signup";
export const typeDefs = [
    commonTypeDef,
    companyTypeDef,
    employeeTypeDef,
    userTypeDef,
    signUpTypeDef
];
export const resolvers = _.merge({}, userResolver, employeeResolver, companyResolver, signUpResolver);
