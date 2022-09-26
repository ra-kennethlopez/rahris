import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql/execution";
import { AuthenticationError } from "apollo-server-express";
export const directiveTransformer = (schema) => {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            hasRoleDirectiveTransformer(schema, fieldConfig);
            return fieldConfig;
        }
    });
};
const hasRoleDirectiveTransformer = (schema, fieldConfig) => {
    var _a;
    const directiveName = 'hasRole';
    const hasRoleDirective = (_a = getDirective(schema, fieldConfig, directiveName)) === null || _a === void 0 ? void 0 : _a[0];
    if (hasRoleDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        const { role } = hasRoleDirective;
        fieldConfig.resolve = (source, args, context, info) => {
            if (!context.roles.includes(role)) {
                throw new AuthenticationError('Access denied');
            }
            return resolve(source, args, context, info);
        };
    }
};
