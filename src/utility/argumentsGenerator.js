import {GraphQLList, GraphQLNonNull, parse} from 'graphql';

import { customizedPrint } from './customizedPrint';

const ROOT_TYPE = {
  QUERY: 'query',
  MUTATION: 'mutation',
  SUBSCRIPTION: 'subscription',
  UNSUPPORTED: 'unsupported',
}

let schemaCached = null;
let schemaMap = new Map();

function buildSchemaMap(type, typeEnum) {
  if (type && type.getFields) {
    const fields = type.getFields();

    Object.keys(fields).forEach(fieldName => {
      schemaMap.set(fields[fieldName], typeEnum);
    });

  }
}

function getRootType(schema, field) {
  // if schema or type is null
  if (!schema || !field) {
    return ROOT_TYPE.UNSUPPORTED;
  }

  // schema is not equals to the cached schema, rebuild the map
  if (schema !== schemaCached) {
    schemaCached = schema;
    schemaMap = new Map();

    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();
    buildSchemaMap(queryType, ROOT_TYPE.QUERY);
    buildSchemaMap(mutationType, ROOT_TYPE.MUTATION);
    buildSchemaMap(subscriptionType, ROOT_TYPE.SUBSCRIPTION);
  }

  if (schemaMap.has(field)) {
    return schemaMap.get(field);
  }

  return ROOT_TYPE.UNSUPPORTED;
}

function printType(type) {
  if (type instanceof GraphQLNonNull) {
    return printType(type.ofType)+ '!';
  }
  if (type instanceof GraphQLList) {
    return `[${printType(type.ofType)}]`;
  }
  return type.name;
}

function printArguments(field, rootType) {

  const { name, args } = field;
  let variablesString = '';
  let argumentsString = '';

  if (args.length !== 0) {
    const variableList = args.map(item => {
      return '$' + item.name + ': ' + printType(item.type)
    })

    if (variableList.length !== 0) {
      variablesString = '(' + variableList.join(', ') + ')';
    }

    const argumentList = args.map(item => {
      return `${item.name}: $${item.name}`;
    })

    if (argumentList.length !== 0) {
      argumentsString = '(' + argumentList.join(', ') + ')';
    }
  }

  const string =
    `${rootType} ${name}${variablesString}{
      ${name}${argumentsString}
    }`;

  // prettify the string
  return customizedPrint(parse(string));
}

function injectQuery(field, rootType, setEditorValue) {
  const string = printArguments(field, rootType);
  setEditorValue(string);
}

export {
  injectQuery,
  ROOT_TYPE,
  getRootType,
}