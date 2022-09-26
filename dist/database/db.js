var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { SQLDataSource } from 'datasource-sql';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from "nanoid";
import { UserInputError } from "apollo-server-core";
const SALT_ROUNDS = 10;
const nanoid = customAlphabet('QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-', 21);
export default class DB extends SQLDataSource {
    getCompanies() {
        return this.getAll('company');
    }
    getUsers() {
        return this.getAll('users');
    }
    getEmployees() {
        const col = [
            'employee.*',
            'users.email',
            'company.name as company_name'
        ];
        return this.getAll('employee', col)
            .innerJoin('users', { 'employee.user_id': 'users.id' })
            .innerJoin('company', { 'employee.company_id': 'company.id' });
    }
    getUserById(id) {
        return this.getById('users', id);
    }
    getCompanyById(id) {
        return this.getById('company', id);
    }
    createUser(param) {
        const { password } = param, rest = __rest(param, ["password"]);
        const id = nanoid();
        const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
        return this.knex
            .insert([Object.assign({ id, password: passwordHash }, rest)])
            .returning('id')
            .into('users');
    }
    createCompany(param) {
        const id = nanoid();
        return this.knex
            .insert([Object.assign({ id }, param)])
            .returning('id')
            .into('company');
    }
    createEmployee(param) {
        const id = nanoid();
        return this.knex
            .insert([Object.assign({ id }, param)])
            .returning('id')
            .into('employee');
    }
    signUp({ firstname, lastname, email, password, company }) {
        return this.knex
            .transaction((trx) => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.getAll('users', ['email'])
                .where('email', email)
                .first();
            if (res) {
                throw new UserInputError('That username is taken. Try another.');
            }
            const [{ id: user_id }] = yield this.createUser({ email, password })
                .transacting(trx);
            const [{ id: company_id }] = yield this.createCompany({ name: company })
                .transacting(trx);
            const [{ id: employee_id }] = yield this.createEmployee({
                firstname, lastname, user_id, company_id
            }).transacting(trx);
            return { user_id, company_id, employee_id };
        }));
    }
    getAll(table, column) {
        return this.knex
            .select(column !== null && column !== void 0 ? column : '*')
            .from(table);
    }
    getById(table, id, column) {
        return this.getAll(table, column)
            .where('id', id)
            .first();
    }
}
