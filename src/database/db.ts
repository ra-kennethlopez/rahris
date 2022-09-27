import { SQLDataSource } from 'datasource-sql';
import {Knex} from "knex";
import {customAlphabet} from "nanoid";
import {ParamCreateCompany, ParamCreateEmployee, ParamCreateUser} from "./types";
import UserModel from "./models/user";

const nanoid = customAlphabet('QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-', 21)

export default class DB extends SQLDataSource {
    getUsers() {
        return this.getAll('users')
    }

    getUserById(id: string) {
        return this.getById('users', id)
    }

    getUser(email: string) {
        return this.getAll('users')
          .where<UserModel>('email', email)
          .first()
    }

    createUser(param: ParamCreateUser) {
        return this.insert('users', param)
    }

    getCompanies() {
        return this.getAll('company')
    }

    getCompanyById(id: string) {
        return this.getById('company', id)
    }

    createCompany(param: ParamCreateCompany) {
        return this.insert('company', param)
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

    createEmployee(param: ParamCreateEmployee) {
        return this.insert('employee', param)
    }

    transaction<T>(
      transactionScope: (trx: Knex.Transaction) => Promise<T> | void,
      config?: Knex.TransactionConfig
    ): Promise<T> {
        return this.knex.transaction(transactionScope, config)
    }

    private insert<T>(tableName: string, param: T, column?: string | readonly (string | any)[] | any, options?: { includeTriggerModifications?: boolean }) {
        const id = nanoid();

        return this.knex
          .insert([{ id, ...param }])
          .returning(column ?? 'id', options)
          .into(tableName)
    }

    private getAll(table: string, column?: string[]) {
        return this.knex
            .select(column ?? '*')
            .from(table)
    }

    private getById<T>(table: string, id: string, column?: string[]) {
        return this.getAll(table, column)
          .where<T>('id', id)
          .first()
    }
}