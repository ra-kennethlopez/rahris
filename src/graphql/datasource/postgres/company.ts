import {Context} from "../../types";

export const companies = (_: any, __: any, { dataSources: { db } }: Context) => db.getCompanies()