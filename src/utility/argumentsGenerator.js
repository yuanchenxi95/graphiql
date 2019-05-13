import {GraphQLList, GraphQLNonNull, parse, print} from 'graphql'

const ROOT_TYPE = {
  QUERY: 'query',
  MUTATION: 'mutation',
  SUBSCRIPTION: 'subscription',
  UNSUPPORTED: 'unsupported',
}

function getRootType(schema, type) {
  // if schema or type is null
  if (!schema || !type) {
    return ROOT_TYPE.UNSUPPORTED;
  }

  if (type === schema.getQueryType()) {
    return ROOT_TYPE.QUERY;
  } else if (type === schema.getMutationType()) {
    return ROOT_TYPE.MUTATION;
  } else if (type === schema.getSubscriptionType()) {
    return ROOT_TYPE.SUBSCRIPTION;
  }

  return ROOT_TYPE.UNSUPPORTED;
};

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
  return print(parse(string));
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