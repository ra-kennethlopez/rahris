import {Employee} from "../../graphql/schema/employee";

export default interface EmployeeModel {
  id: string
  firstname: string
  lastname: string
  user_id: string
  company_id: string
  email: string
  password: string
  company_name: string
}

export const toEmployee = ({
  id,
  firstname,
  lastname,
  user_id,
  company_id,
  email,
  company_name
}: EmployeeModel): Employee => ({
  id,
  firstname,
  lastname,
  user: {
    id: user_id,
    email
  },
  company: {
    id: company_id,
    name: company_name
  }
})