import { Roles } from "./types";
export const contextProvider = (({ req }) => {
    const { ADMIN_AUTH_TOKEN } = process.env;
    if (req.headers.authorization === ADMIN_AUTH_TOKEN) {
        return { roles: [Roles.ADMIN] };
    }
    return { roles: [Roles.GUEST] };
});
