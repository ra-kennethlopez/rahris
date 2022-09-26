export const companies = (_, __, { dataSources: { db } }) => db.getCompanies();
