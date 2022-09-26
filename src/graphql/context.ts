import {ExpressContext} from "apollo-server-express";
import {Roles} from "./types";

export const contextProvider = (( { req }: ExpressContext ) => {
  const { ADMIN_AUTH_TOKEN } = process.env

  if (req.headers.authorization === ADMIN_AUTH_TOKEN) {
    return { roles: [Roles.ADMIN] }
  }

  return { roles: [Roles.GUEST] }
})