import {ArgsInput, Context} from "../../types";
import {InputLogin, InputSignup} from "../../schema/auth";
import {UserInputError} from "apollo-server-core";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10
const SEPARATOR = ';'

const hashSalt = (userSalt: string) => {
  const { SALT } = process.env
  const defaultSalt = '$2b$10$PaGF4DhQGhb0FKDEse7heO'

  return bcrypt.hashSync(userSalt + SALT, SALT ?? defaultSalt)
}

const hashPassword = (userSalt: string, password: string) => {
  return bcrypt.hashSync(password, hashSalt(userSalt)).concat(SEPARATOR).concat(userSalt)
}

const matchesPassword = (password: string, passwordHash: string) => {
  const [, userSalt] = passwordHash.split(SEPARATOR)

  return passwordHash === hashPassword(userSalt, password)
}

export const signup = async (_: any, { param }: ArgsInput<InputSignup>, { dataSources: { db } }: Context) => {
  const { email, password, company, firstname, lastname } = param
  const user = await db.getUser(email)

  if (user) {
    throw new UserInputError('That email is taken. Try another.')
  }

  const res = await db.transaction(async (trx) => {
    const userSalt = bcrypt.genSaltSync(SALT_ROUNDS)
    const passwordHash = hashPassword(userSalt, password)

    const [{ id: userId }] = await db.createUser({ email, password: passwordHash })
      .transacting(trx)

    const [{ id: companyId }] = await db.createCompany({ name: company })
      .transacting(trx)

    const [{ id: employeeId }] = await db.createEmployee({
      firstname,
      lastname,
      user_id: userId,
      company_id: companyId
    }).transacting(trx)

    return { userId, companyId, employeeId }
  })

  console.log('res', res)

  return { token: 'token' }
}

export const login = async (_: any, { param: { email, password } }: ArgsInput<InputLogin>, { dataSources: { db } }: Context) => {
  const user = await db.getUser(email)

  if (!user || !matchesPassword(password, user.password)) {
    throw new UserInputError('Username or password is incorrect')
  }

  return { token: 'token' }
}