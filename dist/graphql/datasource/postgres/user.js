export const users = (_, __, { dataSources: { db } }) => db.getUsers();
