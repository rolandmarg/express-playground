import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLField,
} from 'graphql';

import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { IContext } from './apollo';
import { unsealRequest } from '../auth/helpers';

export class AuthDirective extends SchemaDirectiveVisitor {
  public static getDirectiveDeclaration(
    directiveName: string,
    schema: GraphQLSchema
  ): GraphQLDirective {
    const previousDirective = schema.getDirective(directiveName);
    if (previousDirective) {
      return previousDirective;
    }

    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION],
    });
  }

  public visitObject(object: GraphQLObjectType<any, IContext>) {
    const fields = object.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const next = field.resolve || defaultFieldResolver;

      field.resolve = async function (result, args, context, info) {
        const user = await unsealRequest(context.req);

        return next(result, args, { ...context, user }, info);
      };
    });
  }

  public visitFieldDefinition(field: GraphQLField<any, IContext>) {
    const next = field.resolve || defaultFieldResolver;
    field.resolve = async function (result, args, context, info) {
      const user = await unsealRequest(context.req);
      return next(result, args, { ...context, user }, info);
    };
  }
}
