export type ParamCreateUser = {
  email: string
  password: string
}

export type ParamCreateCompany = {
  name: string
}

export type ParamCreateEmployee = {
  firstname: string
  lastname: string
  user_id: string,
  company_id: string
}