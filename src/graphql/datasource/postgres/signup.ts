import {ArgsInputSignup} from "../../schema/signup";
import {Context} from "../../types";

export const signup = async (_: any, { param }: ArgsInputSignup, { dataSources: { db } }: Context) => {
  const res = await db.signUp(param)

  console.log('res', res)

  return { token: 'token' }
}