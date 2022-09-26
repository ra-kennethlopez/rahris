export const toEmployee = ({ id, firstname, lastname, user_id, company_id, email, company_name }) => ({
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
});
