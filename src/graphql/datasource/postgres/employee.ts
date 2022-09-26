import {Context} from "../../types";
import {toEmployee} from "../../../database/models/employee";

export const employees = async (_: any, __: any, { dataSources: { db } }: Context) => (await db.getEmployees()).map((val) => toEmployee(val))