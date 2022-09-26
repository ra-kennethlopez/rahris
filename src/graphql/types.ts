import {ExpressContext} from "apollo-server-express";
import DB from "../database/db";

export interface Context extends ExpressContext {
  roles: Roles[]
  dataSources: {
    db: DB
  }
}

export enum Roles {
  ADMIN = "ADMIN",
  GUEST = "GUEST"
}