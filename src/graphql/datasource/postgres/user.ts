import {Context} from "../../types";

export const users = (_: any, __: any, { dataSources: { db } }: Context) => db.getUsers()