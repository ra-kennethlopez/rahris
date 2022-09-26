import { SQLDataSource } from 'datasource-sql';
import * as bcrypt from 'bcrypt';
import {ParamCreateCompany, ParamCreateEmployee, ParamCreateUser} from "./types";
import {InputSignup} from "../graphql/schema/signup";
import {customAlphabet} from "nanoid";
import {UserInputError} from "apollo-server-core";

const SALT_ROUNDS = 10;
const nanoid = customAlphabet('QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-', 21)

export default class DB extends SQLDataSource {
    getCompanies() {
        return this.getAll('company')
    }

    getUsers() {
        return this.getAll('users')
    }

    getEmployees() {
        const col = [
          'employee.*',
          'users.email',
          'company.name as company_name'
        ]
        return this.getAll('employee', col)
            .innerJoin(
                'users',
              {'employee.user_id':'users.id'}
            )
            .innerJoin(
                'company',
              {'employee.company_id':'company.id'}
            )
    }

    getUserById(id: string) {
        return this.getById('users', id)
    }

    getCompanyById(id: string) {
        return this.getById('company', id)
    }

    createUser(param: ParamCreateUser) {
        const { password, ...rest } = param;
        const id = nanoid();

        const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

        return this.knex
          .insert([{ id, password: passwordHash, ...rest }])
          .returning('id')
          .into('users');
    }

    createCompany(param: ParamCreateCompany) {
        const id = nanoid();

        return this.knex
          .insert([{ id, ...param }])
          .returning('id')
          .into('company');
    }

    createEmployee(param: ParamCreateEmployee) {
        const id = nanoid();

        return this.knex
          .insert([{ id, ...param }])
          .returning('id')
          .into('employee')
    }

    signUp({ firstname, lastname, email, password, company }: InputSignup) {
        return this.knex
          .transaction( async trx => {
            const res = await this.getAll('users', ['email'])
              .where('email', email)
              .first()

            if (res) {
              throw new UserInputError('That username is taken. Try another.')
            }

            const [{ id: user_id }] = await this.createUser({ email, password })
              .transacting(trx)

            const [{ id: company_id }] = await this.createCompany({ name: company })
              .transacting(trx)

            const [{ id: employee_id }] = await this.createEmployee({
              firstname, lastname, user_id, company_id
            }).transacting(trx)

            return { user_id, company_id, employee_id }
          })
    }

    private getAll(table: string, column?: string[]) {
        return this.knex
            .select(column ?? '*')
            .from(table)
    }

    private getById(table: string, id: string, column?: string[]) {
        return this.getAll(table, column)
          .where('id', id)
          .first()
    }
}