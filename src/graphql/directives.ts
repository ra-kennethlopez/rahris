import {GraphQLFieldConfig, GraphQLResolveInfo, GraphQLSchema} from "graphql/type";
import {getDirective, MapperKind, mapSchema} from "@graphql-tools/utils";
import {defaultFieldResolver} from "graphql/execution";
import {AuthenticationError} from "apollo-server-express";

export const directiveTransformer = (schema: GraphQLSchema) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      hasRoleDirectiveTransformer(schema, fieldConfig)

      return fieldConfig
    }
  })
}

const hasRoleDirectiveTransformer = (schema: GraphQLSchema, fieldConfig: GraphQLFieldConfig<any, any>) => {
  const directiveName = 'hasRole'
  const hasRoleDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

  if (hasRoleDirective) {
    // Get this field's original resolver
    const { resolve = defaultFieldResolver } = fieldConfig;
    const { role } = hasRoleDirective;

    fieldConfig.resolve = (source, args, context, info) => {
      if (!context.roles.includes(role)) {
        throw new AuthenticationError('Access denied')
      }

      return resolve(source, args, context, info)
    }
  }
}